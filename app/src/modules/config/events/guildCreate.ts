import { Guild } from 'discord.js';
import { KiwiClient } from '@/client';
import { EventList, Event } from '@/types/event';

export const GuildCreate: Event = {
	name: EventList.GuildCreate,
	async execute(client: KiwiClient, guild: Guild) {
		await client.db.generateConfigs(guild.id);
	},
};
