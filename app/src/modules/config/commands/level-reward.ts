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

export const LevelRewardCommand: SlashCommand = {
	config: new SlashCommandBuilder()
		.setName('level-reward')
		.setDescription('Manage the servers level rewards')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('add')
				.setDescription('Add a level reward')
				.addRoleOption((option) =>
					option
						.setName('role')
						.setDescription('The role to add at the level')
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName('level')
						.setDescription('The level to add the role at')
						.setRequired(true)
						.setMaxLength(4)
				)
				.addBooleanOption((option) =>
					option
						.setName('permanent')
						.setDescription('Whether the role is permanent')
						.setRequired(false)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('remove')
				.setDescription('Remove a level reward from the server')
				.addRoleOption((option) =>
					option
						.setName('role')
						.setDescription('The role to remove as a level reward')
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('view')
				.setDescription('View all of the servers level rewards')
		),

	async execute(client: KiwiClient, interaction): Promise<void> {
		var cfg = await client.db.getGuildConfig(interaction.guild.id);
		switch (interaction.options.getSubcommand(true)) {
			case 'add': {
				var roleId = interaction.options.getRole('role').id;
				if (
					Object.values(cfg.levelRewards).find(
						(reward) => reward.roleId === roleId
					)
				) {
					interaction.reply({
						content: 'Role already has a level reward',
					});
					return;
				}
				var level = parseInt(interaction.options.getString('level'));
				var permanent =
					interaction.options.getBoolean('permanent') || false;
				cfg.levelRewards[level] = { roleId, permanent };
				await client.db.saveGuildConfig(cfg);
				interaction.reply({
					content: `**Level Reward:** <@&${roleId}> at level **${level}**`,
					allowedMentions: { parse: [] },
				});
				break;
			}

			case 'remove': {
				var roleId = interaction.options.getRole('role').id;
				let level = Object.keys(cfg.levelRewards).find(
					(level) => cfg.levelRewards[level].roleId === roleId
				);
				if (!level) {
					interaction.reply({
						content: `<@&${roleId}> has no level reward`,
						allowedMentions: { parse: [] },
					});
					return;
				}
				delete cfg.levelRewards[level];
				await client.db.saveGuildConfig(cfg);
				break;
			}

			case 'view': {
				let rewards = Object.entries(cfg.levelRewards).map(
					([level, reward]) =>
						`**Level:** ${level}\n**Role:** <@&${reward.roleId}>`
				);
				interaction.reply({
					content: rewards.join('\n\n'),
					allowedMentions: { parse: [] },
				});
				break;
			}
		}
	},
};