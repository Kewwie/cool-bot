import { KiwiClient } from "@/client";
import { CommandOptions, ConfigOptionTypes, PrefixCommand } from "@/types/command";
import { Message, GuildMember, EmbedBuilder } from "discord.js";

export const TimeoutPrefix: PrefixCommand = {
	config: {
		name: "timeout",
		description: "Timeout a member",
		aliases: ["time", "t"],
		autoDelete: false,
		options: [
			{
				name: "member",
				type: ConfigOptionTypes.MEMBER,
			},
			{
				name: "minutes",
				type: ConfigOptionTypes.NUMBER,
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
		minutes: number,
		reason?: string
	) {
		if (message.author.bot) {
			commandOptions.channel.send("You cannot timeout a bot");
			return;
		}
		var time = minutes * 1000 * 60;
		try {
			await member.timeout(time, reason);
			var timeoutEmbed = new EmbedBuilder()
				.setTitle("User Timeout")
				.setColor("#2b2d31")
				.addFields(
					{ name: "User", value: `<@${member.id}>\n${member.user.username}` },
					{ name: "Minutes", value: minutes.toString() },
					{ name: "Reason", value: reason }
				)
				.setFooter({ text: `Moderator: ${message.author.username}` });
			commandOptions.channel.send({ embeds: [timeoutEmbed] });
		} catch (error) {
			commandOptions.channel.send("Could not timeout user");
		}
	},
};