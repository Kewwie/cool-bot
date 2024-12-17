import { Module } from "@/types/module";

// Commands
import { BanPrefix } from "./commands/ban";
import { InfractionsPrefix } from "./commands/infractions";
import { TimeoutPrefix } from "./commands/timeout";

// Schedules
import { CheckInfracitonsSchedule } from "./schedules/checkInfractions";

export const ModerationModule: Module = {
	id: "Moderation",
	prefixCommands: [BanPrefix, InfractionsPrefix, TimeoutPrefix],
	schedules: [CheckInfracitonsSchedule],
};
