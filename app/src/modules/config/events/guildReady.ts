import { Guild } from 'discord.js';
import { KiwiClient } from '@/client';
import { Event, EventList } from '@/types/event';

export const GuildReady: Event = {
	name: EventList.GuildReady,

	async execute(client: KiwiClient, guild: Guild) {
		console.log(await client.db.generateConfigs(guild.id));
	},
};
