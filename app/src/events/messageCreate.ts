import { Message } from "discord.js";
import { KiwiClient } from "../client";
import { Event, Events } from "../types/event";

/**
 * @type {Event}
 */
export const MessageCreate: Event = {
    name: Events.MessageCreate,

    /**
    * @param {KiwiClient} client
    * @param {Guild} guild
    */
    async execute(client: KiwiClient, message: Message) {
        let xpGain = 50;
        
        let userLevel = await client.DatabaseManager.getUserLevel(message.guild.id, message.author.id);
        if (!userLevel) {
            userLevel = await client.DatabaseManager.createUserLevel(message.guild.id, message.author.id, message.author.username);
        }
        let xp = userLevel.xp + xpGain;
        let neededXp = await client.calculateXp(userLevel.level + 1) - xp;

        if (neededXp <= 0) {
            userLevel.level++;
        }

        userLevel.xp = xp;
        await client.DatabaseManager.saveUserLevel(userLevel);
    }
}