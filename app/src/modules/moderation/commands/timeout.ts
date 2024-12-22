import { KiwiClient } from "@/client";
import { CommandOptions, ConfigOptionTypes, PrefixCommand } from "@/types/command";
import { Message, GuildMember, EmbedBuilder, PermissionFlagsBits } from "discord.js";

import { checkBeforeModeration } from "../checks/checkBeforeModeration";

export const TimeoutPrefix: PrefixCommand = {
    config: {
        name: "timeout",
        description: "Timeout a member",
        aliases: ["time", "t"],
        autoDelete: false,
        defaultPermissions: [PermissionFlagsBits.ModerateMembers],
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

    checks: [
        checkBeforeModeration,
        async (client, message, commandOptions, member: GuildMember, minutes: number) => {
            if (!member.moderatable) {
                return { status: false, message: "I cannot timeout this user" };
            }

            return { status: true };
        },
    ],

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

        try {
            if (minutes <= 0) {
                member.timeout(null, reason);
            } else {
                var time = minutes * 1000 * 60;
                member.timeout(time, reason);
                client.db.createInfraction(
                    message.guild.id,
                    member.id,
                    member.user.username,
                    reason
                );
            }

            var timeoutEmbed = new EmbedBuilder()
                .setTitle("User Timed Out")
                .setColor(client.Colors.primary)
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
