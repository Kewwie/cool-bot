import {
	PermissionFlags,
	PermissionFlagsBits,
	PermissionResolvable,
	Permissions,
} from "discord.js";

import { PrefixCommand } from "./command";
import { SlashCommand } from "./command";
import { UserCommand } from "./command";
import { Button, SelectMenu } from "./component";
import { Event } from "./event";
import { Schedule } from "./schedule";

export interface Module {
	id: string;
	permissions?: PermissionResolvable[];
	events?: Event[];
	prefixCommands?: PrefixCommand[];
	slashCommands?: SlashCommand[];
	userCommands?: UserCommand[];
	selectMenus?: SelectMenu[];
	buttons?: Button[];
	schedules?: Schedule[];
	functions?: { [key: string]: Function };
	default?: boolean;
	developerOnly?: boolean;
}
