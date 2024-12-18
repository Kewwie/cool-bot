import { Module } from "@/types/module";

// Commands
import { BanPrefix } from "./commands/ban";
import { DeleteManyPrefix } from "./commands/delete-many";
import { DeletePrefix } from "./commands/delete";
import { InfractionsPrefix } from "./commands/infractions";
import { TimeoutPrefix } from "./commands/timeout";

// Schedules
import { CheckInfracitonsSchedule } from "./schedules/checkInfractions";

export const ModerationModule: Module = {
	id: "moderation",
	prefixCommands: [BanPrefix, DeleteManyPrefix, DeletePrefix, InfractionsPrefix, TimeoutPrefix],
	schedules: [CheckInfracitonsSchedule],
};
