import { KiwiClient } from '@/client';
import {
	CommandOptions,
	ConfigOptionTypes,
	PrefixCommand,
} from '@/types/command';
import { Message, EmbedBuilder, User } from 'discord.js';

export const ConfigCommand: PrefixCommand = {
	config: {
		name: 'trusted-role',
		description: 'Manage the trusted role for the server',
		autoDelete: false,
		options: [
			{
				name: 'type',
				type: ConfigOptionTypes.OPTIONS,
				options: ['set', 'remove', 'list'],
			},
		],
	},

	async execute(
		client: KiwiClient,
		message: Message,
		commandOptions: CommandOptions,
		type: String
	): Promise<void> {
		switch (type) {
			case 'set': {
				break;
			}

			case 'remove': {
				break;
			}

			case 'list': {
				break;
			}
		}
	},
};
