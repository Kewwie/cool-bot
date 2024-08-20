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

    public async createGuildConfig(guildId: string) {
        let config = new ConfigEntity();
        config.guildId = guildId;
        return await this.repositories.config.save(config);
    }

    public async getGuildConfig(guildId: string) {
        return await this.repositories.config.findOne({ where: { guildId: guildId } });
    }

    public async saveGuildConfig(config: ConfigEntity) {
        return await this.repositories.config.save(config);
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