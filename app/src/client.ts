import {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    ColorResolvable,
    ClientPresenceStatus
} from "discord.js";
import { readdirSync } from "fs";
import { resolve } from "path";

import { CommandManager } from "./managers/command";
import { EventManager } from "./managers/event";

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
            presence: {
                status: "online" as ClientPresenceStatus,
            }
        });

        this.SlashCommands = new Collection();
        this.PrefixCommands = new Collection();
        this.Events = new Collection();

        // Command Manager
        this.CommandManager = new CommandManager(this);
        for (var file of readdirSync(resolve(__dirname, "./prefix"))) {
            let command = require(resolve(__dirname, `./prefix/${file}`));
            this.CommandManager.loadPrefix(command.default);
        }
        for (var file of readdirSync(resolve(__dirname, "./slash"))) {
            let command = require(resolve(__dirname, `./slash/${file}`));
            this.CommandManager.loadSlash(command.default);
        }

        // Event Manager
        this.EventManager = new EventManager(this);
        for (var file of readdirSync(resolve(__dirname, "./events"))) {
            let event = require(resolve(__dirname, `./events/${file}`));
            this.EventManager.load(event.default);
        }

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