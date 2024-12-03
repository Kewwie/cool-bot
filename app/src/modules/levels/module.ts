import { Module } from '@/types/module';

// Events
import { MessageCreate } from './events/messageCreate';

// Prefix Commands
import { ProfilePrefix } from './prefix/profile';
import { XpForLevelPrefix } from './prefix/xp-for-level';

export const LevelsModule: Module = {
	id: 'levels',
	events: [MessageCreate],
	prefixCommands: [ProfilePrefix, XpForLevelPrefix],
};
