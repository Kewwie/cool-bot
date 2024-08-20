import { DataSource, Repository } from "typeorm";
import { KiwiClient } from "./client";

import { dataSource } from "./datasource";

import { ConfigEntity } from "./entities/Config";
import { UserLevelEntity } from "./entities/UserLevel";

export class DatabaseManager {
    private dataSource: DataSource;
    private client: KiwiClient;
    private repositories: {
        config: Repository<ConfigEntity>;
        levels: Repository<UserLevelEntity>;
    };

    constructor(client: KiwiClient) {
        this.client = client;
        this.dataSource = dataSource;

        this.onCreate();
    }

    private async onCreate() {
        this.repositories = {
            config: await this.dataSource.getMongoRepository(ConfigEntity),
            levels: await this.dataSource.getMongoRepository(UserLevelEntity),
        }
    }

    private async createConfigForGuild(guildId: string) {
        let config = new ConfigEntity();
        config.guildId = guildId;
        await this.repositories.config.save(config);
        return await this.repositories.config.findOne({ where: { guildId: guildId } });
    }

    private async getConfigForGuild(guildId: string) {
        let config = await this.repositories.config.findOne({ where: { guildId: guildId } });
        if (!config) config = await this.createConfigForGuild(guildId);
        return config;
    }

    public async getPermissionLevelById(guildId: string, id: string) {
        let config = await this.getConfigForGuild(guildId);
        return config.permissionLevels[id];
    }

    public async setPermissionLevelById(guildId: string, id: string, level: number) {
        let config = await this.getConfigForGuild(guildId);
        config.permissionLevels[id] = level;
        await this.repositories.config.save(config);
    }

    public async getPermissionLevels(guildId: string) {
        let config = await this.getConfigForGuild(guildId);
        return config.permissionLevels;
    }

    public async setTrustedRole(guildId: string, roleId: string) {
        let config = await this.getConfigForGuild(guildId);
        config.trustedRole = roleId;
        await this.repositories.config.save(config);
    }

    public async getTrustedRole(guildId: string) {
        let config = await this.getConfigForGuild(guildId);
        return config.trustedRole;
    }

    public async createUserLevel(guildId: string, userId: string, userName: string) {
        let userLevel = new UserLevelEntity();
        userLevel.guildId = guildId;
        userLevel.userId = userId;
        userLevel.userName = userName;
        return await this.repositories.levels.save(userLevel);
    }

    public async getUserLevel(guildId: string, userId: string) {
        return await this.repositories.levels.findOne({ where: { guildId: guildId, userId: userId } });
    }

    public async saveUserLevel(userLevel: UserLevelEntity) {
        return await this.repositories.levels.save(userLevel);
    }
}