import { KiwiClient } from '../client';
import { EmbedBuilder, Message } from 'discord.js';

import { CommandOptions, PrefixCommand } from '../types/command';

import { getUserId } from '@/utils/getUserId';

/**
 * @type {PrefixCommand}
 */
export const Timeout: PrefixCommand = {
	premission_level: 100,
	config: {
		name: 'timeout',
		alies: ['mute', 't'],
		description: 'Timeout a user',
	},

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {KiwiClient} client
	 */
	async execute(
		message: Message,
		commandOptions: CommandOptions,
		client: KiwiClient
	): Promise<void> {
		var memberId = await getUserId(commandOptions.args[0], message);
		var member = message.guild.members.cache.get(memberId);
		if (!member) {
			message.reply('Member not found');
			return;
		}

		if (!member.bannable) {
			message.reply("I can't timeout this user");
			return;
		}

		var minutes = parseInt(commandOptions.args[1]);
		if (isNaN(minutes)) {
			message.reply('Please provide a valid number of minutes');
			return;
		}
		var ms = minutes * 60 * 1000;
		if (!ms) {
			message.reply('Please provide amount of minutes');
			return;
		}

		var reason = commandOptions.args.slice(2).join(' ');
		if (!reason) {
			message.reply('Please provide a reason');
			return;
		}

		await member.disableCommunicationUntil(Date.now() + ms, reason);

		var em = new EmbedBuilder()
			.setTitle('User Timed Out')
			.setColor('DarkRed')
			.addFields(
				{ name: 'User', value: member.user.tag, inline: false },
				{ name: 'Time', value: `${minutes} minutes`, inline: false },
				{ name: 'Reason', value: reason, inline: false }
			)
			.setFooter({
				text: `Moderator: ${message.author.tag}`,
				iconURL: message.author.displayAvatarURL(),
			});
		message.reply({ embeds: [em] });

		client.DatabaseManager.createInfraction(
			message.guild.id,
			member.id,
			member.user.username,
			reason
		);
	},
};
