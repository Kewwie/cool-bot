import {
	ChatInputCommandInteraction,
	AutocompleteInteraction,
	Message,
} from 'discord.js';
import { KiwiClient } from '../client';

export interface PrefixCommand {
	premission_level?: number;
	config: {
		name: string;
		alies: string[];
		description?: string;
	};
	execute: (
		message: Message,
		commandOptions: CommandOptions,
		client: KiwiClient
	) => Promise<void>;
}

export interface CommandOptions {
	commandName: string;
	auther: string;
	args: string[];
}

export interface SlashCommand {
	premission_level?: number;
	config: {
		type: CommandTypes;
		name: string;
		description: string;
		default_member_permissions?: Permissions | null;
		contexts: SlashCommandContexts[];
		integration_types: IntegrationTypes[];
		options?: CommandOption[];
	};
	autocomplete?: (
		interaction: AutocompleteInteraction,
		client: KiwiClient
	) => Promise<void>;
	execute: (
		interaction: ChatInputCommandInteraction,
		client: KiwiClient
	) => Promise<void>;
}

export interface CommandOption {
	type: OptionTypes;
	name: string;
	description: string;
	required?: boolean;
	options?: CommandOption[];
	choices?: Choice[];
	autocomplete?: boolean;
	channel_types?: ChannelTypes[];
}

export interface Choice {
	name: string;
	value: string | number;
}

export enum CommandTypes {
	CHAT_INPUT = 1,
	USER = 2,
	MESSAGE = 3,
}

export enum SlashCommandContexts {
	GUILD = 0,
	BOT_DM = 1,
	PRIVATE_CHANNEL = 2,
}

export enum IntegrationTypes {
	GUILD = 0,
	USER = 1,
}

export enum OptionTypes {
	SUB_COMMAND = 1,
	SUB_COMMAND_GROUP = 2,
	STRING = 3,
	INTEGER = 4,
	BOOLEAN = 5,
	USER = 6,
	CHANNEL = 7,
	ROLE = 8,
	MENTIONABLE = 9,
	NUMBER = 10,
	ATTACHMENT = 11,
}

export enum ChannelTypes {
	GUILD_TEXT = 0,
	DM = 1,
	GUILD_VOICE = 2,
	GROUP_DM = 3,
	GUILD_CATEGORY = 4,
	GUILD_ANNOUNCEMENT = 5,
	ANNOUNCEMENT_THREAD = 10,
	PUBLIC_THREAD = 11,
	PRIVATE_THREAD = 12,
	GUILD_STAGE_VOICE = 13,
	GUILD_DIRECTORY = 14,
	GUILD_FORUM = 15,
	GUILD_MEDIA = 16,
}

export enum Permissions {
	CreateInstantInvite = 0x1,
	KickMembers = 0x2,
	BanMembers = 0x4,
	Administrator = 0x8,
	ManageChannels = 0x10,
	ManageGuild = 0x20,
	AddReactions = 0x40,
	ViewAuditLog = 0x80,
	PrioritySpeaker = 0x100,
	Stream = 0x200,
	ViewChannel = 0x400,
	SendMessages = 0x800,
	SendTtsMessages = 0x1000,
	ManageMessages = 0x2000,
	EmbedLinks = 0x4000,
	AttachFiles = 0x8000,
	ReadMessageHistory = 0x10000,
	MentionEveryone = 0x20000,
	UseExternalEmojis = 0x40000,
	ViewGuildInsights = 0x80000,
	Connect = 0x100000,
	Speak = 0x200000,
	MuteMembers = 0x400000,
	DeafenMembers = 0x800000,
	MoveMembers = 0x1000000,
	UseVad = 0x2000000,
	ChangeNickname = 0x4000000,
	ManageNicknames = 0x8000000,
	ManageRoles = 0x10000000,
	ManageWebhooks = 0x20000000,
	ManageGuildExpressions = 0x40000000,
	UseApplicationCommands = 0x80000000,
	RequestToSpeak = 0x100000000,
	ManageEvents = 0x200000000,
	ManageThreads = 0x400000000,
	CreatePublicThreads = 0x800000000,
	CreatePrivateThreads = 0x1000000000,
	UseExternalStickers = 0x2000000000,
	SendMessagesInThreads = 0x4000000000,
	UseEmbeddedActivities = 0x8000000000,
	ModerateMembers = 0x10000000000,
	ViewCreatorMonetizationAnalytics = 0x20000000000,
	UseSoundboard = 0x40000000000,
	CreateGuildExpressions = 0x80000000000,
	CreateEvents = 0x100000000000,
	UseExternalSounds = 0x200000000000,
	SendVoiceMessages = 0x400000000000,
}
