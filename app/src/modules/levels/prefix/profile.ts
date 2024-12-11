import { KiwiClient } from '@/client';
import {
	CommandOptions,
	ConfigOptionTypes,
	PrefixCommand,
} from '@/types/command';
import { Message, EmbedBuilder, User } from 'discord.js';

export const ProfilePrefix: PrefixCommand = {
	config: {
		name: 'profile',
		description: "Show your or someone else's profile",
		autoDelete: false,
		options: [
			{
				name: 'user',
				type: ConfigOptionTypes.USER,
				defaultSelf: true,
			},
		],
	},

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
		profileDescription += `**Level:** ${userLevel.level}\n`;
		profileDescription += `**Progress:** ${client.formatNumber(
			levelXp
		)} / ${client.formatNumber(neededXp)}\n`;
		profileDescription += `${client.generateProgressBar(
			levelXp,
			neededXp,
			8
		)}`; // Change the number to change the length of the progress bar (Do on emoji update)

		var profileEmbed = new EmbedBuilder()
			.setColor('#2b2d31')
			.setTitle(`**${client.capitalize(user.username)}'s Profile**`)
			.setThumbnail(user.displayAvatarURL())
			.setDescription(profileDescription);

		message.reply({
			embeds: [profileEmbed],
			allowedMentions: { parse: [] },
		});
	},
};
