import { Module } from '../../types/module';

// Events
import { GuildCreate } from './events/guildCreate';
import { GuildReady } from './events/guildReady';

// Slash Commands
import { ConfigSlash } from './slash/config';

export const ConfigModule: Module = {
	id: 'config',
	events: [GuildCreate, GuildReady],
	slashCommands: [ConfigSlash],
	default: true,
};
