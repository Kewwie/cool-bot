import {
	ChatInputCommandInteraction
} from "discord.js";

import { KiwiClient } from "../client";

import { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
    SlashCommand,
    OptionTypes
} from "../types/command";

/**
 * @type {SlashCommand}
 */
export const command: SlashCommand = {
	config: {
        name: "config",
        description: "Config commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: null,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "trusted-role",
                description: "Set the trusted role",
                options: [
                    {
                        type: OptionTypes.ROLE,
                        name: "role",
                        description: "The role you want to set as the trusted role",
                        required: false
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "permission-level",
                description: "Remove the trusted role from a user",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "level",
                        description: "Pick a level from 1-500",
                        required: true
                    },
                    {
                        type: OptionTypes.USER,
                        name: "member",
                        description: "The user to set the permission level for",
                        required: false
                    },
                    {
                        type: OptionTypes.ROLE,
                        name: "role",
                        description: "The role to set the permission level for",
                        required: false
                    },
                ]
            }
        ]
    },

	/**
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        switch (interaction.options.getSubcommand()) {
            case "trusted-role": {
                let role = await interaction.options.getRole("role");

                await client.DatabaseManager.setTrustedRole(interaction.guildId, role.id);
                interaction.reply({ content: `The trusted role has been set to ${role}`, ephemeral: true });
                break;
            }

            case "permission-level": {
                let level = await interaction.options.getString("level");
                let member = await interaction.options.getUser("member");
                let role = await interaction.options.getRole("role");

                break;
            }
        }
    }
}