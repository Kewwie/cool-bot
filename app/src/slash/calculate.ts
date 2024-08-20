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
export const Calculate: SlashCommand = {
	config: {
        name: "calculate",
        description: "Calculate Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: null,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                name: "level",
                description: "Level of the user",
                type: OptionTypes.INTEGER,
                required: true
            }
        ]
    },

	/**
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        let level = interaction.options.getInteger("level");
        let xp = await client.calculateXp(level);
        interaction.reply({ content: `You need **${xp}** xp to achive level **${level}**`, ephemeral: true });
    }
}