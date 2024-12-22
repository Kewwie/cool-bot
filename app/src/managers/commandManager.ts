import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { env } from "@/env";
import { KiwiClient } from "@/client";
import {
    PrefixCommand,
    SlashCommand,
    UserCommand,
    CommandOptions,
    ConfigOptionTypes,
} from "@/types/command";
import { Collection, Message, TextChannel } from "discord.js";
import { EventList } from "@/types/event";

export class CommandManager {
    public client: KiwiClient;
    public PrefixCommands: Collection<string, PrefixCommand>;
    public Aliases: Collection<string, string>;
    public SlashCommands: Collection<string, SlashCommand>;
    public UserCommands: Collection<string, UserCommand>;
    private RestAPI: REST;

    constructor(client: KiwiClient) {
        this.client = client;

        this.PrefixCommands = new Collection();
        this.Aliases = new Collection();
        this.SlashCommands = new Collection();
        this.UserCommands = new Collection();
        this.RestAPI = new REST({ version: "10" }).setToken(env.CLIENT_TOKEN);

        this.client.on(EventList.InteractionCreate, this.onInteraction.bind(this));
        this.client.on(EventList.MessageCreate, this.onMessage.bind(this));
    }

    loadPrefix(command: PrefixCommand) {
        this.PrefixCommands.set(command.config.name, command);
        for (let alias of command.config.aliases || []) {
            this.Aliases.set(alias, command.config.name);
        }
    }

    loadSlash(command: SlashCommand) {
        this.SlashCommands.set(command.config.name, command);
    }

    loadUser(command: UserCommand) {
        this.UserCommands.set(command.config.name, command);
    }

    async register(commands: any[], guildId?: string) {
        if (!guildId) {
            this.RestAPI.put(Routes.applicationCommands(env.CLIENT_ID), {
                body: commands,
            });
        } else {
            this.RestAPI.put(Routes.applicationGuildCommands(env.CLIENT_ID, guildId), {
                body: commands,
            });
        }
    }

    async unregisterAll(guildId?: string) {
        try {
            if (!guildId) {
                this.RestAPI.put(Routes.applicationCommands(env.CLIENT_ID), {
                    body: [],
                });
            } else {
                this.RestAPI.put(Routes.applicationGuildCommands(env.CLIENT_ID, guildId), {
                    body: [],
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    async onInteraction(interaction: any) {
        if (interaction.isChatInputCommand()) {
            let command = this.SlashCommands.get(interaction.commandName);

            if (!command) return;

            if (interaction.guildId) {
                var checks = await this.client.ModuleManager.checkGuild(
                    interaction.guild,
                    interaction.user,
                    command.module
                );
                if (!checks.status) {
                    interaction.reply({
                        content: checks.response,
                        ephemeral: true,
                    });
                    return;
                }
            }

            try {
                await command.execute(this.client, interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: "There is an issue!",
                    ephemeral: true,
                });
            }
        } else if (interaction.isAutocomplete()) {
            let command = this.SlashCommands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.autocomplete(this.client, interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: "There is an issue!",
                    ephemeral: true,
                }); // Fix this to respond in autocomplete
            }
        } else if (interaction.isUserContextMenuCommand()) {
            const command = this.UserCommands.get(interaction.commandName);

            if (!command) return;

            if (interaction.guildId) {
                var checks = await this.client.ModuleManager.checkGuild(
                    interaction.guild,
                    interaction.user,
                    command.module
                );
                if (!checks.status) {
                    interaction.reply({
                        content: checks.response,
                        ephemeral: true,
                    });
                    return;
                }
            }

            try {
                await command.execute(interaction, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: "There is an issue!",
                    ephemeral: true,
                });
            }
        }
    }

    async onMessage(message: Message) {
        if (!message.guildId) return;
        if (message.author.bot) return;
        if (!message.content.startsWith(env.PREFIX)) return;

        let textArgs = message.content.slice(env.PREFIX.length).trim().split(/ +/);
        let commandName = textArgs.shift()?.toLowerCase();
        if (!commandName) return;

        commandName = this.Aliases.get(commandName) || commandName;
        let command = this.PrefixCommands.get(commandName);
        if (!command) return;

        var channel = message.channel as TextChannel;

        if (command.config.autoDelete) {
            message.delete();
        }

        if (message.guildId) {
            var userAllowed = false;
            var cfg = await this.client.db.getGuildConfig(message.guildId);
            var member = await message.guild?.members.fetch(message.author.id);
            var permissionExists = cfg.permissions.find((perm) =>
                perm.commands.includes(commandName)
            );

            if (env.STAFF.includes(message.author.id)) {
                userAllowed = true;
            } else if (command.module.developerOnly) {
                channel.send({
                    content: `You are not a developer!`,
                });
                return;
            }

            if (!command.module?.default) {
                var isEnabled = await this.client.db.isModuleEnabled(
                    message.guild.id,
                    command.module.id
                );
                if (!isEnabled) {
                    channel.send({
                        content: `This module is disabled!`,
                    });
                    return;
                }
            }

            for (var role of member.roles.cache.values()) {
                var perm = cfg.permissions.find((perm) => perm.roleId === role.id);
                if (perm && perm.commands.includes(commandName)) {
                    userAllowed = true;
                    break;
                }
            }

            if (!userAllowed && !permissionExists && command.config.defaultPermissions) {
                for (var permission of command.config.defaultPermissions || []) {
                    if (member.permissions.has(permission)) {
                        userAllowed = true;
                        break;
                    }
                }
            }

            if (!userAllowed && command.module.permissions) {
                for (var permission of command.module.permissions) {
                    if (member.permissions.has(permission)) {
                        userAllowed = true;
                        break;
                    }
                }
            }

            if (
                !permissionExists &&
                (!command.config.defaultPermissions ||
                    command.config.defaultPermissions?.length <= 0) &&
                (!command.module.permissions || command.module.permissions?.length <= 0)
            ) {
                userAllowed = true;
            }

            if (!userAllowed) {
                channel.send({
                    content: "You do not have permission to use this command",
                });
                return;
            }
        }

        var commandOptions: CommandOptions = {
            commandName: commandName,
            auther: message.author.id,
            module: command.module,
            command: command,
            channel: message.channel as TextChannel,
        };

        var count = 0;
        var args = new Array();
        if (command.config.options) {
            for (let option of command.config.options) {
                if (!textArgs[count] && !option.defaultSelf && !option.optional) {
                    channel.send({
                        content: `You must provide a ${option.name}`,
                    });
                    return;
                } else if (option.optional && !textArgs[count]) {
                    if (option.default) args.push(option.default);
                    continue;
                }

                if (option.type === ConfigOptionTypes.TEXT) {
                    if (option.includeAfter) {
                        args.push(textArgs.slice(count).join(" "));
                    } else {
                        args.push(textArgs[count]);
                    }
                } else if (option.type === ConfigOptionTypes.NUMBER) {
                    var number = parseInt(textArgs[count]);
                    if (isNaN(number)) {
                        channel.send({
                            content: `You must provide a valid number`,
                        });
                        return;
                    }
                    if (option.maxValue && number > option.maxValue) {
                        channel.send({
                            content: `You must provide a number less than ${option.maxValue}`,
                        });
                        return;
                    }
                    args.push(number);
                } else if (option.type === ConfigOptionTypes.OPTIONS) {
                    if (!option.options?.includes(textArgs[count])) {
                        channel.send({
                            content: `You must provide a valid ${
                                option.name
                            } which is one of these ${option.options.join(", ")}`,
                        });
                        return;
                    }
                    args.push(textArgs[count]);
                } else {
                    var id;
                    if (!option.defaultSelf || textArgs[count]) {
                        id = await this.client.getId(message, textArgs[count]);
                        if (!id) {
                            channel.send({
                                content: `You must provide a valid ${option.name}`,
                            });
                            return;
                        }
                    }

                    var entry;
                    if (option.type === ConfigOptionTypes.USER) {
                        if (!id && option.defaultSelf) {
                            id = message.author.id;
                        }
                        entry = await this.client.users.fetch(id).catch(() => null);
                        args.push(entry);
                    } else if (option.type === ConfigOptionTypes.MEMBER) {
                        if (!id && option.defaultSelf) {
                            id = message.author.id;
                        }
                        entry = await message.guild?.members.fetch(id).catch(() => null);
                        args.push(entry);
                    } else if (option.type === ConfigOptionTypes.CHANNEL) {
                        if (!id && option.defaultSelf) {
                            id = message.channel.id;
                        }
                        entry = await message.guild?.channels.fetch(id).catch(() => null);
                        args.push(entry);
                    } else if (option.type === ConfigOptionTypes.ROLE && id) {
                        entry = await message.guild?.roles.fetch(id).catch(() => null);
                        args.push(entry);
                    }
                    if (!entry) {
                        channel.send({
                            content: `You must provide a valid ${option.name}`,
                        });
                        return;
                    }
                }
                count++;
            }
        }

        if (command.checks) {
            for (let check of command.checks) {
                var checks = await check(this.client, message, commandOptions, ...args);
                if (!checks.status) {
                    commandOptions.channel.send({
                        content: checks.message,
                    });
                    return;
                }
            }
        }

        try {
            await command.execute(this.client, message, commandOptions, ...args);
        } catch (error) {
            console.error(error);
            await channel.send("There is an issue!");
        }
    }
}
