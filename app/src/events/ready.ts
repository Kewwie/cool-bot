import { ActivityType } from "discord.js";
import { KiwiClient } from "../client";
import { Event, Events } from "../types/event";

/**
 * @type {Event}
 */
export const event: Event = {
    name: Events.Ready,

    /**
    * @param {KiwiClient} client
    * @param {Guild} guild
    */
    async execute(client: KiwiClient, newClient: KiwiClient) {
        newClient.user.setPresence({
            status: "online",
            activities: [
                {
                    name: "Kewi the kiwi",
                    type: ActivityType.Custom,
                },
            ],
        });
    }
}