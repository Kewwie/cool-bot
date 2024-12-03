import { Module } from '@/types/module';

// Prefix Commands
import { ProfilePrefix } from './prefix/profile';
import { XpForLevelPrefix } from './prefix/xp-for-level';

export const LevelsModule: Module = {
	id: 'levels',
	prefixCommands: [ProfilePrefix, XpForLevelPrefix],
};
