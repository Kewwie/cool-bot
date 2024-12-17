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
		commandOptions.channel.send("Updating xp coming soon");
	},
};
