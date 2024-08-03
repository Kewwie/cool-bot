import {
	ChatInputCommandInteraction
} from "discord.js";

import { KiwiClient } from "@/client";

import { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
    SlashCommand
} from "@/types/command";

/**
 * @type {SlashCommand}
 */
export const AboutSlash: SlashCommand = {
	config: {
        name: "about",
        description: "Some information about me",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: null,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
    },

	/**
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        interaction.reply({ content: "I am a bot", ephemeral: true });
    }
}