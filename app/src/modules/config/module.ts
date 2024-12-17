import { Module } from "../../types/module";
import { PermissionFlagsBits } from "discord.js";

// Events
import { GuildCreate } from "./events/guildCreate";
import { GuildReady } from "./events/guildReady";

// Commands
import { GuildModuleCommand } from "./commands/guild-module";
import { LevelRewardCommand } from "./commands/level-reward";
import { PermissionCommand } from "./commands/permission";
import { TrustedRoleCommand } from "./commands/trusted-role";

export const ConfigModule: Module = {
	id: "config",
	permissions: [PermissionFlagsBits.Administrator],
	events: [GuildCreate, GuildReady],
	slashCommands: [TrustedRoleCommand, LevelRewardCommand, PermissionCommand, GuildModuleCommand],
	default: true,
};
