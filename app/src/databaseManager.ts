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
    }

    async connect() {
        console.log("Connecting to database");

        this.repositories = {
            config: await this.dataSource.getRepository(ConfigEntity),
        }
    }

    private async getConfigForGuild(guildId: string) {
        let config = await this.repositories.config.findOne({ where: { guildId: guildId } });
        if (!config) {
            config = new ConfigEntity();
            config.guildId = guildId;
            //config.trustedRole = null;
            //config.permissionLevels = {};
            await this.repositories.config.save(config);
            config = await this.repositories.config.findOne({ where: { guildId: guildId } });
        }
        return config;
    }

    async setTrustedRole(guildId: string, roleId: string) {
        let config = await this.getConfigForGuild(guildId);
        console.log(config);
    }
}