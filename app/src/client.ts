import {
	Client,
	GatewayIntentBits,
	Partials,
	ColorResolvable,
	ClientPresenceStatus,
	Message,
	TextChannel,
} from "discord.js";

import { DatabaseManager } from "./managers/databaseManager";

import { EventManager } from "./managers/eventManager";
import { ComponentManager } from "./managers/componentManager";
import { CommandManager } from "./managers/commandManager";
import { ScheduleManager } from "./managers/scheduleManager";
import { ModuleManager } from "./managers/moduleManager";
import { CustomOptions } from "./types/component";

import { Emojis } from "./emojis";

export class KiwiClient extends Client {
	public Settings: {
		color: ColorResolvable;
	};
	public Colors: {
		primary: ColorResolvable;
		secondary: ColorResolvable;
		success: ColorResolvable;
		error: ColorResolvable;
	};
	public db: DatabaseManager;

	public EventManager: EventManager;
	public ComponentManager: ComponentManager;
	public CommandManager: CommandManager;
	public ScheduleManager: ScheduleManager;
	public ModuleManager: ModuleManager;

	private _logChannel: TextChannel;

	public formatNumber: (value: number) => string;

	constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildModeration,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.MessageContent,
				//GatewayIntentBits.AutoModerationExecution,
				//GatewayIntentBits.AutoModerationConfiguration,
			],
			partials: [Partials.GuildMember, Partials.Channel, Partials.Message, Partials.User],
			presence: {
				status: "online" as ClientPresenceStatus,
			},
		});

		this.Settings = {
			color: "#7289DA",
		};

		this.Colors = {
			primary: "#2b2d31",
			secondary: "#2C2F33",
			success: "#43B581",
			error: "#F04747",
		};

		// Database Manager
		this.db = new DatabaseManager(this);

		// Event Manager
		this.EventManager = new EventManager(this);

		// Component Manager
		this.ComponentManager = new ComponentManager(this);

		// Command Manager
		this.CommandManager = new CommandManager(this);

		// Schedule Manager
		this.ScheduleManager = new ScheduleManager(this);

		this.ModuleManager = new ModuleManager(this);

		this.formatNumber = new Intl.NumberFormat("en-US", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format;
	}

	public capitalize(str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	public addSpace(value: string) {
		return value.replace(/([A-Z])/g, " $1").trim();
	}

	public generateProgressBar(progress: number, total: number, length: number) {
		if (progress > total) progress = total;
		if (progress < 0) progress = 0;

		var filledBlocks = Math.floor((progress / total) * length);
		var emptyBlocks = length - filledBlocks;
		var progressBar = "";

		progressBar +=
			filledBlocks > 0 ? Emojis.progressBar.filledStart : Emojis.progressBar.emptyStart;
		if (filledBlocks > 1) filledBlocks--;
		progressBar += Emojis.progressBar.filledMiddle.repeat(filledBlocks);
		if (emptyBlocks > 1) emptyBlocks--;
		progressBar += Emojis.progressBar.emptyMiddle.repeat(emptyBlocks);
		progressBar +=
			filledBlocks === length ? Emojis.progressBar.filledEnd : Emojis.progressBar.emptyEnd;
		return progressBar;
	}

	public createCustomId(options: CustomOptions): string {
		var customId = new Array<string>();
		for (var [key, value] of Object.entries(options)) {
			if (customId.includes("&")) continue;
			if (!key || !value) continue;
			key = this.ComponentManager.getShortKey(key);
			customId.push(`${key}=${value}`);
		}
		return customId.join("&");
	}

	public getBoolean(value: string) {
		if (value.toLowerCase() === "true") {
			return true;
		} else {
			return false;
		}
	}

	public async getId(message: Message, value: string): Promise<string> {
		if (value.startsWith("<@") && value.endsWith(">") && !value.startsWith("<@&")) {
			value = value.slice(2, -1);
			if (value.startsWith("!")) {
				value = value.slice(1);
			}
		} else if (value.startsWith("<#") && value.endsWith(">")) {
			value = value.slice(2, -1);
		} else if (value.startsWith("<@&") && value.endsWith(">")) {
			value = value.slice(3, -1);
		} else if (value.includes("u") && message.reference) {
			var messageReference = await message.fetchReference().catch(() => null);
			value = messageReference?.author?.id;
		} else if (!/^\d{17,19}$/.test(value)) {
			value = null;
		}
		return value;
	}

	public createMessageUrl(guildId: string, channelId: string, messageId: string): string {
		return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
	}

	public calculateXp(level: number) {
		return 100 * Math.pow(level, 2) + 50 * level;
	}
}
