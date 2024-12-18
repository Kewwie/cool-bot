import { KiwiClient } from "@/client";
import { CommandOptions, ConfigOptionTypes, PrefixCommand } from "@/types/command";
import { Message, GuildMember, EmbedBuilder, PermissionFlagsBits } from "discord.js";

export const BanPrefix: PrefixCommand = {
	config: {
		name: "ban",
		description: "Ban a member",
		aliases: ["banish", "terminate", "getout"],
		autoDelete: false,
		defaultPermissions: [PermissionFlagsBits.BanMembers],
		options: [
			{
				name: "member",
				type: ConfigOptionTypes.MEMBER,
			},
			{
				name: "reason",
				type: ConfigOptionTypes.TEXT,
				includeAfter: true,
				optional: true,
				default: "No reason provided",
			},
		],
	},

	async execute(
		client: KiwiClient,
		message: Message,
		commandOptions: CommandOptions,
		member: GuildMember,
		reason?: string
	) {
		if (message.author.bot) {
			commandOptions.channel.send("You cannot timeout a bot");
			return;
		}

		if (!member.bannable) {
			commandOptions.channel.send("User cannot be banned");
			return;
		}

		try {
			await member.ban({ reason });
			var timeoutEmbed = new EmbedBuilder()
				.setTitle("User Banned")
				.setColor(client.Colors.primary)
				.addFields(
					{ name: "User", value: `<@${member.id}>\n${member.user.username}` },
					{ name: "Reason", value: reason }
				)
				.setFooter({ text: `Moderator: ${message.author.username}` });
			commandOptions.channel.send({ embeds: [timeoutEmbed] });
		} catch (error) {
			commandOptions.channel.send("Could not ban user");
		}
	},
};
