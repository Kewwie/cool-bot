import {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    ColorResolvable
} from "discord.js";

import { ClientEvents } from "./events";
import { ClientPrefixCommands } from "./prefixCommands";
import { ClientSlashCommands } from "./slashCommands";

import { CommandManager } from "./commandManager";
import { EventManager } from "./eventManager";
import { DatabaseManager } from "./databaseManager";

import { SlashCommand, PrefixCommand } from "./types/command";
import { Event, Events } from "./types/event";

export class KiwiClient extends Client {
    public embed: { 
        color: {
            fail: ColorResolvable | null;
            success: ColorResolvable | null;
            normal: ColorResolvable | null;
        };
    };

    public SlashCommands: Collection<string, SlashCommand>;
    public PrefixCommands: Collection<string, PrefixCommand>;
    public Events: Collection<string, Event>;

    public CommandManager: CommandManager;
    public EventManager: EventManager;
    public DatabaseManager: DatabaseManager;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.MessageContent,
                //GatewayIntentBits.GuildVoiceStates,
                //GatewayIntentBits.AutoModerationExecution,
                //GatewayIntentBits.AutoModerationConfiguration,
            ],
            partials: [
                Partials.GuildMember,
                Partials.Channel,
                Partials.Message,
                Partials.User,
            ],
        });

        this.Events = new Collection();
        this.SlashCommands = new Collection();
        this.PrefixCommands = new Collection();

        // Event Manager
        this.EventManager = new EventManager(this);
        for (let event of ClientEvents) {
            this.EventManager.load(event);
        }
        this.EventManager.register([...this.Events.values()]);

        // Command Manager
        this.CommandManager = new CommandManager(this);
        for (let command of ClientPrefixCommands) {
            this.CommandManager.loadPrefix(command);
        }
        for (let command of ClientSlashCommands) {
            this.CommandManager.loadSlash(command);
        }
        this.on(Events.InteractionCreate, this.CommandManager.onInteraction.bind(this.CommandManager));
        this.on(Events.MessageCreate, this.CommandManager.onMessage.bind(this.CommandManager));

        // Database Manager
        this.DatabaseManager = new DatabaseManager(this);

        this.on(Events.Ready, async () => {
            console.log(`${this.user?.username} is Online`);
            for (let guild of await this.guilds.fetch()) {
                this.CommandManager.register([...this.SlashCommands.values()], guild[0]);
                this.emit(Events.GuildReady, await guild[1].fetch());
            }
        });

        this.on(Events.GuildCreate, async (guild) => {
            console.log(`Joined ${guild.name}`);
            this.CommandManager.register([...this.SlashCommands.values()], guild.id);
        });
    }
};