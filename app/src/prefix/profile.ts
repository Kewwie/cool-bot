import { KiwiClient } from "../client";
import { Message, EmbedBuilder } from "discord.js";

import { 
    CommandOptions,
	PrefixCommand
} from "../types/command";

/**
 * @type {PrefixCommand}
 */
export const Profile: PrefixCommand = {
	config: {
        name: "profile", 
        description: "Show your or someone else's profile",
    },

	/**
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(message: Message, commandOptions: CommandOptions, client: KiwiClient): Promise<void> {
        var user = 
            await client.getUserFromArg(commandOptions.args[0]) ||
            await client.getRepliedUser(message) ||
            message.author;
        var userLevel = await client.DatabaseManager.getUserLevel(message.guild.id, user.id);
        if (!userLevel) {
            message.reply("User has no profile");
        }
        var levelXp = userLevel.xp - await client.calculateXp(userLevel.level);
        var neededXp = await client.calculateXp(userLevel.level + 1) - await client.calculateXp(userLevel.level);

        var profileDescription = "";
        profileDescription += `**Rank:** Soon\n`;
        profileDescription += `**Level:** ${userLevel.level}\n`;
        profileDescription += `**Progress:** ${levelXp} / ${neededXp}\n`;        

        var profileEmbed = new EmbedBuilder()
            .setColor("#2b2d31")
            .setTitle(`**${client.capitalize(user.username)}'s Profile**`)
            .setThumbnail(user.displayAvatarURL())
            .setDescription(profileDescription)

        message.reply({ embeds: [profileEmbed] });
    }
}