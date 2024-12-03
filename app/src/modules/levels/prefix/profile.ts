import { KiwiClient } from '@/client';
import {
	CommandOptions,
	ConfigOptionTypes,
	PrefixCommand,
} from '@/types/command';
import { Message, EmbedBuilder, User } from 'discord.js';

/**
 * @type {PrefixCommand}
 */
export const ProfilePrefix: PrefixCommand = {
	config: {
		name: 'profile',
		description: "Show your or someone else's profile",
		autoDelete: false,
		options: [
			{
				name: 'user',
				type: ConfigOptionTypes.USER,
			},
		],
	},

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {KiwiClient} client
	 */
	async execute(
		client: KiwiClient,
		message: Message,
		commandOptions: CommandOptions,
		user: User
	): Promise<void> {
		var userLevel = await client.db.getUserLevel(message.guild.id, user.id);
		if (!userLevel) {
			message.reply('User has no profile');
			return;
		}
		var levelXp =
			userLevel.xp - (await client.calculateXp(userLevel.level));
		var neededXp =
			(await client.calculateXp(userLevel.level + 1)) -
			(await client.calculateXp(userLevel.level));

		var profileDescription = '';
		profileDescription += `**Rank:** Soon\n`;
		profileDescription += `**Level:** ${userLevel.level}\n`;
		profileDescription += `**Progress:** ${levelXp} / ${neededXp}\n`;

		var profileEmbed = new EmbedBuilder()
			.setColor('#2b2d31')
			.setTitle(`**${client.capitalize(user.username)}'s Profile**`)
			.setThumbnail(user.displayAvatarURL())
			.setDescription(profileDescription);

		message.reply({ embeds: [profileEmbed] });
	},
};
