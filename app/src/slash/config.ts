import {
	ChatInputCommandInteraction
} from "discord.js";

import { KiwiClient } from "../client";

import { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
    SlashCommand,
    OptionTypes
} from "../types/command";

/**
 * @type {SlashCommand}
 */
export const Config: SlashCommand = {
    premission_level: 500,
	config: {
        name: "config",
        description: "Config commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: null,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "trusted-role",
                description: "Set the trusted role",
                options: [
                    {
                        type: OptionTypes.ROLE,
                        name: "role",
                        description: "The role you want to set as the trusted role",
                        required: false
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "permission-level",
                description: "Remove the trusted role from a user",
                options: [
                    {
                        type: OptionTypes.NUMBER,
                        name: "level",
                        description: "Pick a level from 1-500",
                        required: false
                    },
                    {
                        type: OptionTypes.USER,
                        name: "member",
                        description: "The user to set the permission level for",
                        required: false
                    },
                    {
                        type: OptionTypes.ROLE,
                        name: "role",
                        description: "The role to set the permission level for",
                        required: false
                    },
                ]
            }
        ]
    },

	/**
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        let guildConfig = await client.DatabaseManager.getGuildConfig(interaction.guildId);
        if (!guildConfig) {
            guildConfig = await client.DatabaseManager.createGuildConfig(interaction.guildId);
        }

        switch (interaction.options.getSubcommand()) {
            case "trusted-role": {
                let role = await interaction.options.getRole("role");

                guildConfig.trustedRole = role.id;
                await client.DatabaseManager.saveGuildConfig(guildConfig);
                interaction.reply({ content: `The trusted role has been set to ${role}`, ephemeral: true });
                break;
            }

            case "permission-level": {
                let level = await interaction.options.getNumber("level");
                let member = await interaction.options.getUser("member");
                let role = await interaction.options.getRole("role");

                if (level && !member && !role) {
                    interaction.reply({ content: "You need to provide a member or role", ephemeral: true });
                } else

                if (level && member) {
                    guildConfig.permissionLevels[member.id] = level;
                    await client.DatabaseManager.saveGuildConfig(guildConfig);
                    interaction.reply({ content: `The permission level for **${member.username}** has been set to **${level}**`, ephemeral: true });
                } else
                
                if (level && role) {
                    guildConfig.permissionLevels[role.id] = level;
                    await client.DatabaseManager.saveGuildConfig(guildConfig);
                    interaction.reply({ content: `The permission level for **${role.name}** has been set to **${level}**`, ephemeral: true });
                } else 

                if (!level) {
                    let userLevels = guildConfig.permissionLevels;
                    let userLevelsString = new String();
                    for (let [key, value] of Object.entries(userLevels)) {
                        let keyMember = await interaction.guild.members.fetch(key);
                        let keyRole = await interaction.guild.roles.fetch(key);
                        let name = new String();

                        if (keyMember) {
                            name = keyMember.user.username;
                        } else

                        if (keyRole) {
                            name = keyRole.name;
                        }

                        userLevelsString += `**${name}** - ${value}\n`;
                    }
                    interaction.reply({ content: `# Permission Levels \n${userLevelsString}`, ephemeral: true });
                }
                break;
            }
        }
    }
}