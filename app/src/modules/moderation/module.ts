import { Module } from "@/types/module";

// Commands
import { TimeoutPrefix } from "./commands/timeout";

export const ModerationModule: Module = {
	id: "Moderation",
	prefixCommands: [TimeoutPrefix],
};
