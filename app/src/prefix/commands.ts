import { KiwiClient } from "../client";
import { Message } from "discord.js";

import { 
	PrefixCommand
} from "../types/command";

/**
 * @type {PrefixCommand}
 */
export const command: PrefixCommand = {
	config: {
        name: "commands", 
        description: "List of all of my commands",
    },

	/**
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(message: Message, client: KiwiClient): Promise<void> {
        message.reply("soon");
    }
}