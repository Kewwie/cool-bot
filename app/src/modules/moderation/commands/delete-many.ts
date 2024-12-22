import { KiwiClient } from "@/client";
import { CommandOptions, ConfigOptionTypes, PrefixCommand } from "@/types/command";
import { Message, GuildMember, EmbedBuilder, PermissionFlagsBits } from "discord.js";

import { checkBeforeModeration } from "../checks/checkBeforeModeration";

export const DeleteManyPrefix: PrefixCommand = {
    config: {
        name: "delete-many",
        description: "Delete x amount of a users messages",
        aliases: ["deletemany", "dm"],
        autoDelete: true,
        defaultPermissions: [PermissionFlagsBits.ManageMessages],
        options: [
            {
                name: "member",
                type: ConfigOptionTypes.MEMBER,
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
        member: GuildMember,
        amount: number
    ) {
        amount = Math.min(amount, 50);
        let fetchedMessages;
        let userMessages = [];
        let lastMessageId = message.id;
        let maxSeachAmount = 1000;

        while (userMessages.length < amount) {
            fetchedMessages = await message.channel.messages.fetch({
                limit: 50,
                before: lastMessageId,
            });
            if (fetchedMessages.size === 0) break;
            if ((maxSeachAmount -= 50) <= 0) break;

            let filteredMessages = fetchedMessages.filter((msg) => msg.author.id === member.id);
            userMessages = userMessages.concat(Array.from(filteredMessages.values()));

            lastMessageId = fetchedMessages.last().id;
        }

        for (var messageToDelete of userMessages) {
            try {
                await messageToDelete.delete();
            } catch (error) {
                commandOptions.channel.send(`Could not delete message: ${messageToDelete.id}`);
            }
        }
    },
};
