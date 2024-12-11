import { KiwiClient } from '@/client';
import {
	CommandOptions,
	ConfigOptionTypes,
	SlashCommand,
} from '@/types/command';
import {
	Message,
	EmbedBuilder,
	User,
	SlashCommandBuilder,
	ChatInputCommandInteraction,
} from 'discord.js';

export const TrustedRoleCommand: SlashCommand = {
	config: new SlashCommandBuilder()
		.setName('trusted-role')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('set')
				.setDescription('Set a trusted role for the server')
				.addRoleOption((option) =>
					option.setName('role').setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('remove')
				.setDescription('Remove a trusted role from the server')
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('view')
				.setDescription('View the guilds trusted role')
		),

	async execute(client: KiwiClient, interaction): Promise<void> {
		var cfg = await client.db.getGuildConfig(interaction.guild.id);
		switch (interaction.options.getSubcommand(true)) {
			case 'set': {
				cfg.trustedRole = interaction.options.getRole('role').id;
				await client.db.saveGuildConfig(cfg);
				interaction.reply({
					content: `**Trusted Role:** <@&${
						interaction.options.getRole('role').id
					}>`,
					allowedMentions: { parse: [] },
				});
				break;
			}

			case 'remove': {
				cfg.trustedRole = null;
				await client.db.saveGuildConfig(cfg);
				interaction.reply({
					content: '**Trusted role:** none',
				});
				break;
			}

			case 'view': {
				interaction.reply({
					content: `**Trusted Role:** <@&${cfg.trustedRole}>`,
					allowedMentions: { parse: [] },
				});
				break;
			}
		}
	},
};
