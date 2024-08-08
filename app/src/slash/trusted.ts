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
        name: "trusted",
        description: "Trusted commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: null,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "add",
                description: "Add the trusted role to a user",
                options: [
                    {
                        type: OptionTypes.USER,
                        name: "member",
                        description: "The user to add the role to",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "remove",
                description: "Remove the trusted role from a user",
                options: [
                    {
                        type: OptionTypes.USER,
                        name: "member",
                        description: "The user to remove the role from",
                        required: true
                    }
                ]
            }
        ]
    },

	/**
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        interaction.reply({ content: "I am a bot", ephemeral: true });
    }
}