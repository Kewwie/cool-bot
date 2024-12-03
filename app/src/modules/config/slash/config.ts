import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '@/types/command';
import { KiwiClient } from '@/client';

/**
 * @type {SlashCommand}
 */
export const ConfigSlash: SlashCommand = {
	config: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Config commands')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('trusted-role')
				.setDescription('Set the trusted role')
				.addRoleOption((option) =>
					option
						.setName('role')
						.setDescription(
							'The role you want to set as the trusted role'
						)
						.setRequired(false)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('level-rewards')
				.setDescription('Add or remove a role for a level')
				.addNumberOption((option) =>
					option
						.setName('level')
						.setDescription('Pick a level from 1-1000')
						.setRequired(false)
				)
				.addRoleOption((option) =>
					option
						.setName('role')
						.setDescription('The role to set the level for')
						.setRequired(false)
				)
		),

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {KiwiClient} client
	 */
	async execute(
		interaction: ChatInputCommandInteraction,
		client: KiwiClient
	): Promise<void> {
		let guildConfig = await client.db.getGuildConfig(interaction.guildId);
		if (!guildConfig) {
			guildConfig = await client.db.generateConfigs(interaction.guildId);
		}

		switch (interaction.options.getSubcommand()) {
			case 'trusted-role': {
				let role = interaction.options.getRole('role');

				guildConfig.trustedRole = role.id;
				await client.db.saveGuildConfig(guildConfig);
				interaction.reply({
					content: `The trusted role has been set to ${role}`,
					ephemeral: true,
				});
				break;
			}

			case 'level-rewards': {
				let level = interaction.options.getNumber('level');
				let role = interaction.options.getRole('role');

				if (!level) {
					let userRewards = guildConfig.levelReward;
					if (userRewards) {
						let userRewardsString = '';
						for (let [key, value] of Object.entries(userRewards)) {
							userRewardsString += `**Level ${key}** - <@&${value}>\n`;
						}
						interaction.reply({
							content: `# Level Rewards \n${userRewardsString}`,
							ephemeral: true,
						});
					} else {
						interaction.reply({
							content: 'No level rewards have been set',
							ephemeral: true,
						});
					}
				} else if (!role) {
					interaction.reply({
						content: 'You need to provide a role',
						ephemeral: true,
					});
				} else if (level <= 0 || level > 200) {
					interaction.reply({
						content: 'The level must be between 1-200',
						ephemeral: true,
					});
				} else {
					guildConfig.levelReward[level] = role.id;
					await client.db.saveGuildConfig(guildConfig);
					interaction.reply({
						content: `The level reward for level **${level}** has been set to **<@&${role.id}>**`,
						ephemeral: true,
					});
				}
				break;
			}
		}
	},
};
