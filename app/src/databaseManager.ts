import { DataSource, Repository } from "typeorm";
import { KiwiClient } from "./client";

import { dataSource } from "./datasource";

import { ConfigEntity } from "./entities/Config";

export class DatabaseManager {
    private dataSource: DataSource;
    private client: KiwiClient;
    private repositories: {
        config: Repository<ConfigEntity>;
    };

    constructor(client: KiwiClient) {
        this.client = client;
        this.dataSource = dataSource;

        this.onCreate();
    }

    private async onCreate() {
        this.repositories = {
            config: await this.dataSource.getMongoRepository(ConfigEntity),
        }
    }

    private async getConfigForGuild(guildId: string) {
        let config = await this.repositories.config.findOne({ where: { guildId: guildId } });
        if (!config) {
            config = new ConfigEntity();
            config.guildId = guildId;
            await this.repositories.config.save(config);
            config = await this.repositories.config.findOne({ where: { guildId: guildId } });
        }
        return config;
    }

    async getPermissionLevelById(guildId: string, id: string) {
        let config = await this.getConfigForGuild(guildId);
        return config.permissionLevels[id];
    }

    async setPermissionLevelById(guildId: string, id: string, level: number) {
        let config = await this.getConfigForGuild(guildId);
        config.permissionLevels[id] = level;
        await this.repositories.config.save(config);
    }

    async getPermissionLevels(guildId: string) {
        let config = await this.getConfigForGuild(guildId);
        return config.permissionLevels;
    }

    async setTrustedRole(guildId: string, roleId: string) {
        let config = await this.getConfigForGuild(guildId);
        config.trustedRole = roleId;
        await this.repositories.config.save(config);
    }

    async getTrustedRole(guildId: string) {
        let config = await this.getConfigForGuild(guildId);
        return config.trustedRole;
    }
}