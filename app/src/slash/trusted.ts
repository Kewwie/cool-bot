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
export const Trusted: SlashCommand = {
    premission_level: 50,
	config: {
        name: "trusted",
        description: "Trusted commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: null,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "add",
                description: "Add the trusted role to a user",
                options: [
                    {
                        type: OptionTypes.USER,
                        name: "member",
                        description: "The user to add the role to",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "remove",
                description: "Remove the trusted role from a user",
                options: [
                    {
                        type: OptionTypes.USER,
                        name: "member",
                        description: "The user to remove the role from",
                        required: true
                    }
                ]
            }
        ]
    },

	/**
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        var user = interaction.options.getUser("member");
        if (!user) {
            interaction.reply({ content: "User not found", ephemeral: true });
            return;
        }

        var member = await interaction.guild.members.fetch(user.id);
        if (!member) {
            interaction.reply({ content: "Member not found", ephemeral: true });
            return;
        }

        var guildConfig = await client.DatabaseManager.getGuildConfig(interaction.guildId);
        if (!guildConfig.trustedRole && !(await interaction.guild.roles.cache.get(guildConfig.trustedRole))) {
            interaction.reply({ content: "Trusted role can't be found", ephemeral: true });
            return;
        }

        switch (interaction.options.getSubcommand()) {
            case "add":
                if (member.roles.cache.has(guildConfig.trustedRole)) {
                    interaction.reply({ content: `**${user.username}** already has trusted`, ephemeral: true });
                    
                } else {
                    await member.roles.add(guildConfig.trustedRole).catch(() => {});
                    interaction.reply({ content: `Added trusted to **${user.username}**`, ephemeral: true });
                }
                break;

            case "remove":
                if (!member.roles.cache.has(guildConfig.trustedRole)) {
                    interaction.reply({ content: `**${user.username}** doesn't have trusted`, ephemeral: true });
                    
                } else {
                    await member.roles.remove(guildConfig.trustedRole).catch(() => {});
                    interaction.reply({ content: `Removed trusted from **${user.username}**`, ephemeral: true });
                }
                break;
        }
    }
}