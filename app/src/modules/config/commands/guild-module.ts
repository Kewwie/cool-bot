import { KiwiClient } from "@/client";
import { SlashCommand } from "@/types/command";
import {
	Message,
	EmbedBuilder,
	User,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from "discord.js";

export const GuildModuleCommand: SlashCommand = {
	config: new SlashCommandBuilder()
		.setName("guild-module")
		.setDescription("Manage the guilds modules")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("toggle")
				.setDescription("Toggle a guild module")
				.addStringOption((option) =>
					option
						.setName("module")
						.setRequired(true)
						.setDescription("The module to toggle")
						.setAutocomplete(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand.setName("view").setDescription("View the guilds modules")
		),

	async autocomplete(client, interaction) {
		var focused = interaction.options.getFocused(true);
		var options;

		switch (focused.name) {
			case "module": {
				let modules = client.ModuleManager.Modules.filter(
					(module) => !module.default && !module.developerOnly
				);
				options = modules.map((module) => {
					return {
						name: module.id,
						value: module.id,
					};
				});
				break;
			}
		}

		interaction.respond(options);
	},

	async execute(client: KiwiClient, interaction: ChatInputCommandInteraction): Promise<void> {
		var cfg = await client.db.getGuildConfig(interaction.guild.id);
		switch (interaction.options.getSubcommand(true)) {
			case "toggle": {
				var module = interaction.options.getString("module");
				var response = "";
				if (!cfg.modules[module]) {
					cfg.modules[module] = true;
					response = `**${client.capitalize(module)}:** Enabled`;
				} else {
					cfg.modules[module] = false;
					response = `**${client.capitalize(module)}:** Disabled`;
				}
				await client.db.saveGuildConfig(cfg);
				interaction.reply({ content: response });
				break;
			}

			case "view": {
				var enabledModules = Object.keys(cfg.modules).filter(
					(module) => cfg.modules[module] === true
				);
				var disabledModules = Object.keys(cfg.modules).filter(
					(module) => cfg.modules[module] === false
				);

				interaction.reply({
					content: [
						`**Enabled Modules**\n${enabledModules.join("\n")}`,
						`**Disabled Modules**\n${disabledModules.join("\n")}`,
					].join("\n\n"),
				});
				break;
			}
		}
	},
};
