import { KiwiClient } from "../client";
import { Message } from "discord.js";

import { 
    CommandOptions,
	PrefixCommand
} from "../types/command";

/**
 * @type {PrefixCommand}
 */
export const Timeout: PrefixCommand = {
    premission_level: 100,
	config: {
        name: "timeout", 
        description: "Timeout a user",
    },

	/**
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(message: Message, commandOptions: CommandOptions, client: KiwiClient): Promise<void> {
        var memberId = commandOptions.args[0];
        var member = message.guild.members.cache.get(memberId);
        console.log(commandOptions.args[0]);
        message.reply("soon");
    }
}