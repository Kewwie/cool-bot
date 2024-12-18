import { KiwiClient } from "@/client";
import { CommandOptions, ConfigOptionTypes, PrefixCommand } from "@/types/command";
import { Message, GuildMember, EmbedBuilder, PermissionFlagsBits } from "discord.js";

export const DeletePrefix: PrefixCommand = {
	config: {
		name: "delete",
		description: "Deletes the message you reply to",
		aliases: ["d"],
		autoDelete: true,
		defaultPermissions: [PermissionFlagsBits.ManageMessages],
	},

	async execute(client: KiwiClient, message: Message, commandOptions: CommandOptions) {
		var messageToDelete = await message.fetchReference().catch(() => null);
		if (!messageToDelete) {
			commandOptions.channel.send(
				"Could not find message to delete, you must reply to a message to delete it."
			);
			return;
		}

		try {
			await messageToDelete.delete();
		} catch (error) {
			commandOptions.channel.send("Could not delete message");
		}
	},
};
