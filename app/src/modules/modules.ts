import { Module } from "@/types/module";

// Modules Imports
import { ConfigModule } from "./config/module";
import { LevelsModule } from "./levels/module";
import { ModerationModule } from "./moderation/module";

export const ClientModules: Module[] = [ConfigModule, LevelsModule, ModerationModule];
