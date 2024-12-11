import { Module } from '../../types/module';

// Events
import { GuildCreate } from './events/guildCreate';
import { GuildReady } from './events/guildReady';

// Commands
import { ConfigCommand } from './commands/config';

export const ConfigModule: Module = {
	id: 'config',
	events: [GuildCreate, GuildReady],
	prefixCommands: [ConfigCommand],
	default: true,
};
