import { KiwiClient } from '@/client';
import {
	CommandOptions,
	ConfigOptionTypes,
	PrefixCommand,
} from '@/types/command';
import { Message, EmbedBuilder, User } from 'discord.js';

export const XpForLevelPrefix: PrefixCommand = {
	config: {
		name: 'xp-for-level',
		description: 'Calculate xp needed for a level',
		autoDelete: false,
		options: [
			{
				name: 'level',
				type: ConfigOptionTypes.NUMBER,
			},
		],
	},

	async execute(
		client: KiwiClient,
		message: Message,
		commandOptions: CommandOptions,
		level: number
	) {
		let xp = await client.calculateXp(level);
		message.reply({
			content: `You need **${xp}** xp to achive level **${level}**`,
		});
	},
};
