import { Module } from "@/types/module";

// Events
import { MessageCreate } from "./events/messageCreate";

// Prefix Commands
import { ProfilePrefix } from "./prefix/profile";
import { UpdateXpPrefix } from "./prefix/update-xp";
import { XpForLevelPrefix } from "./prefix/xp-for-level";

export const LevelsModule: Module = {
	id: "levels",
	events: [MessageCreate],
	prefixCommands: [ProfilePrefix, UpdateXpPrefix, XpForLevelPrefix],
};
