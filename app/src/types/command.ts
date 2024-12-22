import { KiwiClient } from "@/client";
import { Module } from "./module";

import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    AutocompleteInteraction,
    Message,
    User,
    GuildMember,
    Channel,
    Role,
    TextChannel,
    PermissionResolvable,
} from "discord.js";

export interface PrefixCommand {
    module?: Module;
    level?: number;
    config: {
        name: string;
        description?: string;
        aliases?: string[];
        autoDelete?: boolean;
        defaultPermissions?: PermissionResolvable[];
        options?: {
            name: string;
            type: ConfigOptionTypes;
            optional?: boolean;
            default?: string;
            options?: string[];
            maxValue?: number;
            includeAfter?: boolean;
            defaultSelf?: boolean;
        }[];
    };
    checks?: Array<
        (
            client: KiwiClient,
            message: Message,
            commandOptions: CommandOptions,
            ...args: any[]
        ) => Promise<{ status: boolean; message?: string }>
    >;
    execute: (
        client: KiwiClient,
        message: Message,
        commandOptions: CommandOptions,
        ...args: any[]
    ) => Promise<void>;
}

export enum ConfigOptionTypes {
    USER = 1,
    MEMBER = 2,
    CHANNEL = 3,
    ROLE = 4,
    TEXT = 5,
    NUMBER = 6,
    OPTIONS = 7,
}

export interface CommandOptions {
    commandName: string;
    auther: string;
    module: Module;
    command: PrefixCommand;
    channel: TextChannel;
}

export interface UserCommand {
    module?: Module;
    level?: number;
    config: {
        type: CommandTypes.User;
        name: string;
    };
    execute: (interaction, client: KiwiClient) => Promise<void>;
}

export interface SlashCommand {
    module?: Module;
    level?: number;
    config: SlashCommandBuilder | any;
    autocomplete?: (client: KiwiClient, interaction: AutocompleteInteraction) => Promise<void>;
    execute: (client: KiwiClient, interaction: ChatInputCommandInteraction) => Promise<void>;
}

export enum CommandTypes {
    ChatInput = 1,
    User = 2,
    Message = 3,
}
