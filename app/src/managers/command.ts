import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { env } from "../env";
import { KiwiClient } from "../client";
import { PrefixCommand, SlashCommand } from "../types/command";

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

    async unregister(guildId: string) {
        const rest = new REST({ version: '10' }).setToken(env.CLIENT_TOKEN);

        await rest.put(
            Routes.applicationGuildCommands(env.CLIENT_ID, guildId),
            { body: [] }
        )

        console.log(`Successfully removed all (/) commands in ${guildId}`);
    }

    async onInteraction(interaction: any) {

        if (interaction.isChatInputCommand()) {

            const command = this.client.SlashCommands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }

        } else if (interaction.isAutocomplete()) {

            const command = this.client.SlashCommands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.autocomplete(interaction, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
            
        }
    }
}