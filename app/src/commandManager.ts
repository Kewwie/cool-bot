import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { Message } from "discord.js";

import { env } from "./env";
import { KiwiClient } from "./client";
import { PrefixCommand, CommandOptions, SlashCommand } from "./types/command";

export class CommandManager {
    public client: KiwiClient;
    
    constructor(client: KiwiClient) {
        this.client = client;
    }

    loadPrefix(command: PrefixCommand) {
        this.client.PrefixCommands.set(command.config.name, command);
    }

    loadSlash(command: SlashCommand) {
        this.client.SlashCommands.set(command.config.name, command);
    }

    async register(commands: SlashCommand[], guildId: string) {
        var cmds = new Array();

        for (let command of commands) {
            cmds.push(command.config);
        }

        const rest = new REST({ version: '10' }).setToken(env.CLIENT_TOKEN);

        var data: any = await rest.put(
            Routes.applicationGuildCommands(env.CLIENT_ID, guildId),
            { body: cmds }
        )
        console.log(`Successfully reloaded ${data.length} (/) commands in ${guildId}`);
    }

    async unregister(guildId?: string) {
        const rest = new REST({ version: '10' }).setToken(env.CLIENT_TOKEN);

        if (!guildId) {
            await rest.put(
                Routes.applicationCommands(env.CLIENT_ID),
                { body: [] }
            )
            console.log(`Successfully removed all (/) commands globally`);
        }
        else {
            await rest.put(
                Routes.applicationGuildCommands(env.CLIENT_ID, guildId),
                { body: [] }
            )
            console.log(`Successfully removed all (/) commands in ${guildId}`);
        }
    }

    async onInteraction(interaction: any) {

        if (interaction.isChatInputCommand()) {

            let command = this.client.SlashCommands.get(interaction.commandName);

            if (!command) return;

            if (interaction.guildId) {
                let guildConfig = await this.client.DatabaseManager.getGuildConfig(interaction.guildId);
                if (command.premission_level) {
                    let hasHigherPermission = false;

                    if (guildConfig.permissionLevels[interaction.userId] >= command.premission_level) {
                        hasHigherPermission = true;
                    }

                    interaction.member.roles.cache.forEach(async (role) => {
                        if (guildConfig.permissionLevels[role.id] >= command.premission_level) {
                            hasHigherPermission = true;
                        }
                    });

                    if (interaction.guild.ownerId === interaction.user.id) {
                        hasHigherPermission = true;
                    }

                    if (!hasHigherPermission) {
                        await interaction.reply({ content: `You need permission level ${command.premission_level} to use this command!`, ephemeral: true });
                        return;
                    }
                }
            }

            try {
                await command.execute(interaction, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }

        } else if (interaction.isAutocomplete()) {

            let command = this.client.SlashCommands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.autocomplete(interaction, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
            
        }
    }

    async onMessage(message: Message) {

        if (message.author.bot) return;
        if (!message.content.startsWith(env.PREFIX)) return;

        let args = message.content.slice(env.PREFIX.length).trim().split(/ +/);
        let commandName = args.shift()?.toLowerCase();
        if (!commandName) return;

        let command = this.client.PrefixCommands.get(commandName);
        if (!command) return;

        let commandOptions: CommandOptions = {
            commandName: commandName,
            auther: message.author.id,
            args
        }

        if (message.guildId) {
            let guildConfig = await this.client.DatabaseManager.getGuildConfig(message.guildId);
            if (command.premission_level) {
                let hasHigherPermission = false;

                if (guildConfig.permissionLevels[message.author.id] >= command.premission_level) {
                    hasHigherPermission = true;
                }

                message.member.roles.cache.forEach(async (role) => {
                    if (guildConfig.permissionLevels[role.id] >= command.premission_level) {
                        hasHigherPermission = true;
                    }
                });

                if (message.guild.ownerId === message.author.id) {
                    hasHigherPermission = true;
                }

                if (!hasHigherPermission) {
                    await message.reply({ content: `You need permission level ${command.premission_level} to use this command!`});
                    return;
                }
            }
        }

        try {
            await command.execute(message, commandOptions, this.client);
        } catch (error) {
            console.error(error);
            await message.reply('There was an error while executing this command!');
        }
    }
}