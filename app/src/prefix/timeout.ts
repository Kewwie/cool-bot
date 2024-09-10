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
        if (!member) {
            message.reply("Member not found");
            return;
        }

        if (!member.bannable) {
            message.reply("I can't timeout this user");
            return;
        }

        var minutes = parseInt(commandOptions.args[1]);
        if (isNaN(minutes)) {
            message.reply("Please provide a valid number of minutes");
            return;
        }
        var ms = minutes * 60 * 1000;
        if (!ms) {
            message.reply("Please provide amount of minutes");
            return;
        }

        var reason = commandOptions.args.slice(2).join(" ");
        if (!reason) {
            message.reply("Please provide a reason");
            return;
        }

        await member.disableCommunicationUntil(Date.now() + ms, reason);
        message.reply(`**${member.user.username}** has been timed for **${ms}** minutes for **${reason}**`);
        
        client.DatabaseManager.createInfraction(message.guild.id, member.id, member.user.username, reason);
    }
}