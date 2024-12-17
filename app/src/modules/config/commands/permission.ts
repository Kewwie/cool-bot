import { KiwiClient } from "@/client";
import { SlashCommand } from "@/types/command";
import {
	Message,
	EmbedBuilder,
	User,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from "discord.js";

export const PermissionCommand: SlashCommand = {
	config: new SlashCommandBuilder()
		.setName("premission")
		.setDescription("Manage the guilds permissions")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("add")
				.setDescription("Add a command to a role")
				.addRoleOption((option) =>
					option
						.setName("role")
						.setRequired(true)
						.setDescription("The role to set the permission for")
				)
				.addStringOption((option) =>
					option
						.setName("command")
						.setRequired(true)
						.setDescription("The command to set the permission for")
						.setAutocomplete(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("delete")
				.setDescription("Delete a roles permission level")
				.addRoleOption((option) =>
					option
						.setName("role")
						.setRequired(true)
						.setDescription("The role to delete the permission for")
				)
				.addStringOption((option) =>
					option
						.setName("command")
						.setRequired(true)
						.setDescription("The command to delete the permission for")
						.setAutocomplete(true)
				)
		)
		.addSubcommand((subcommand) => subcommand.setName("view").setDescription("View the ")),

	async autocomplete(client, interaction) {
		var focused = interaction.options.getFocused(true);
		var options;

		switch (focused.name) {
			case "command": {
				let commands = client.CommandManager.PrefixCommands.filter(
					(command) => !command.module.default && !command.module.developerOnly
				);
				options = commands.map((command) => {
					return {
						name: client.capitalize(command.config.name),
						value: command.config.name,
					};
				});
				break;
			}
		}

		interaction.respond(options);
	},

	async execute(client, interaction) {
		var cfg = await client.db.getGuildConfig(interaction.guild.id);
		switch (interaction.options.getSubcommand(true)) {
			case "add": {
				let role = interaction.options.getRole("role");
				let command = interaction.options.getString("command");

				let perm = cfg.permissions?.find((perm) => perm.roleId === role.id);
				if (!perm) {
					cfg.permissions.push({ roleId: role.id, commands: [] });
					perm = cfg.permissions.find((perm) => perm.roleId === role.id);
				} else if (perm.commands?.find((c) => c === command)) {
					interaction.reply({
						content: `**${role.name}** already has permission to use **${command}**`,
						ephemeral: true,
					});
					return;
				}
				perm.commands.push(command);

				await client.db.saveGuildConfig(cfg);

				interaction.reply({
					content: `**${role.name}** can now use **${command}**`,
					ephemeral: true,
				});
				break;
			}

			case "delete": {
				let role = interaction.options.getRole("role");
				let command = interaction.options.getString("command");

				let perm = cfg.permissions?.find((perm) => perm.roleId === role.id);
				if (!perm) {
					interaction.reply({
						content: `**${role.name}** does not have permission to use **${command}**`,
						ephemeral: true,
					});
					return;
				}

				let commandIndex = perm.commands.indexOf(command);
				if (commandIndex === -1) {
					interaction.reply({
						content: `**${role.name}** does not have permission to use **${command}**`,
						ephemeral: true,
					});
					return;
				}

				perm.commands.splice(commandIndex, 1);
				await client.db.saveGuildConfig(cfg);

				interaction.reply({
					content: `**${role.name}** no longer has permission to use **${command}**`,
					ephemeral: true,
				});

				break;
			}

			case "view": {
				let response = "";
				for (let perm of cfg.permissions) {
					response += `<@&${perm.roleId}>\n${perm.commands.join("\n")}\n\n`;
				}
				interaction.reply({
					content: response,
					ephemeral: true,
					allowedMentions: { parse: [] },
				});
				break;
			}
		}
	},
};
