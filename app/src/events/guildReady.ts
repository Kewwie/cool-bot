import { Guild } from "discord.js";

import { KiwiClient } from "@/client";
import { Event, Events } from "@/types/event";

/**
 * @type {Event}
 */
export default {
    name: Events.GuildReady,

    /**
    * @param {KiwiClient} client
    * @param {Guild} guild
    */
    async execute(client: KiwiClient, guild: Guild) {
        console.log(`Guild ${guild.name} is ready`); 
    }
}