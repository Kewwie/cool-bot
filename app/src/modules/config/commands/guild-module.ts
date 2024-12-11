import { KiwiClient } from '@/client';
import { SlashCommand } from '@/types/command';
import {
	Message,
	EmbedBuilder,
	User,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from 'discord.js';

export const GuildModuleCommand: SlashCommand = {
	config: new SlashCommandBuilder()
		.setName('guild-module')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('toggle')
				.setDescription('Toggle a guild module')
				.addStringOption((option) =>
					option
						.setName('module')
						.setRequired(true)
						.setDescription('The module to toggle')
						.addChoices([{ name: 'Levels', value: 'levels' }])
				)
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('view').setDescription('View the guilds modules')
		),

	async execute(
		client: KiwiClient,
		interaction: ChatInputCommandInteraction
	): Promise<void> {
		var cfg = await client.db.getGuildConfig(interaction.guild.id);
		switch (interaction.options.getSubcommand(true)) {
			case 'toggle': {
				var module = interaction.options.getString('module');
				if (!cfg.modules[module]) {
					cfg.modules[module] = true;
				} else {
					cfg.modules[module] = false;
				}
				break;
			}

			case 'list': {
				var enabledModules = Object.keys(cfg.modules).filter(
					(module) => cfg.modules[module] === true
				);
				var disabledModules = Object.keys(cfg.modules).filter(
					(module) => cfg.modules[module] === false
				);

				interaction.reply({
					content: [
						`**Enabled Modules** ${enabledModules.join('\n')}`,
						`**Disabled Modules** ${disabledModules.join('\n')}`,
					].join('\n\n'),
				});
				break;
			}
		}
	},
};
