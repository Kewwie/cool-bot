import { KiwiClient } from "@/client";
import { CommandOptions, ConfigOptionTypes, PrefixCommand } from "@/types/command";
import { Message, User, PermissionFlagsBits } from "discord.js";

export const UpdateXpPrefix: PrefixCommand = {
	config: {
		name: "update-xp",
		description: "Update a user xp",
		aliases: ["updatexp"],
		autoDelete: false,
		defaultPermissions: [PermissionFlagsBits.Administrator],
		options: [
			{
				name: "user",
				type: ConfigOptionTypes.USER,
			},
			{
				name: "amount",
				type: ConfigOptionTypes.NUMBER,
			},
		],
	},

	async execute(
		client: KiwiClient,
		message: Message,
		commandOptions: CommandOptions,
		user: User,
		amount: number
	) {
		var userLevel = await client.db.getUserLevel(message.guild.id, user.id);
		if (!userLevel) {
			message.reply("User has no profile");
			return;
		}
		userLevel.xp += amount;
		await client.db.saveUserLevel(userLevel);
		commandOptions.channel.send("User xp updated");
	},
};
