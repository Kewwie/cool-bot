import { KiwiClient } from "@/client";
import { CommandOptions } from "@/types/command";
import { GuildMember, Message } from "discord.js";

export const checkBeforeModeration = async (
    client: KiwiClient,
    message: Message,
    commandOptions: CommandOptions,
    member: GuildMember,
    reason?: string
) => {
    if (message.author.id === member.id) {
        return { status: false, message: "You cannot punish yourself" };
    }

    if (member.id === message.guild.ownerId) {
        return { status: false, message: "You cannot punish the owner" };
    }

    if (message.author.bot) {
        return { status: false, message: "You cannot punish a bot" };
    }

    if (member.roles.highest.position >= message.member.roles.highest.position) {
        return { status: false, message: "You cannot punish this user" };
    }

    return { status: true };
};
