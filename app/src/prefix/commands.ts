import { KiwiClient } from "../client";
import { Message } from "discord.js";

import { 
    CommandOptions,
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
	async execute(message: Message, commandOptions: CommandOptions, client: KiwiClient): Promise<void> {
        console.log(commandOptions.args);
        message.reply("soon");
    }
}