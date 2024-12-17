import { RecurrenceRule } from "node-schedule";
import { Schedule } from "@/types/schedule";
import { KiwiClient } from "@/client";

var timeRule = new RecurrenceRule();
timeRule.tz = "UTC";
timeRule.hour = 0;
timeRule.minute = 0;

export const CheckInfracitonsSchedule: Schedule = {
	rule: timeRule,
	execute: async (client: KiwiClient, guildId: string) => {
		for (var infraction of await client.db.repos.infractions.find()) {
			if (infraction.expiresAt < new Date()) {
				await client.db.deleteInfraction(infraction.userId, infraction.infractionId);
			}
		}
	},
};
