import { DataSource, Repository } from "typeorm";
import { KiwiClient } from "./client";

import { dataSource } from "./datasource";

import { ConfigEntity } from "./entities/Config";
import { UserLevelEntity } from "./entities/UserLevel";
import { InfractionEntity } from "./entities/Infraction";

export class DatabaseManager {
    private dataSource: DataSource;
    private client: KiwiClient;
    private repositories: {
        config: Repository<ConfigEntity>;
        levels: Repository<UserLevelEntity>;
        infractions: Repository<InfractionEntity>;
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
            infractions: await this.dataSource.getMongoRepository(InfractionEntity)
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

    public async createInfraction(guildId: string, userId: string, userName: string, reason: string) {
        var infractions = await this.getInfractions(guildId, userId);
        let highestInfractionId = 0;
        infractions.forEach((infraction) => {
            if (infraction.infractionId > highestInfractionId) {
                highestInfractionId = infraction.infractionId;
            }
        });
        let infraction = new InfractionEntity();
        infraction.guildId = guildId;
        infraction.userId = userId;
        infraction.infractionId = highestInfractionId + 1;
        infraction.userName = userName;
        infraction.reason = reason;
        return await this.repositories.infractions.save(infraction);
    }

    public async getInfractions(guildId: string, userId: string) {
        return await this.repositories.infractions.find({ where: { guildId: guildId, userId: userId } });
    }

    public async getInfraction(guildId: string, userId: string, infractionId: number) {
        return await this.repositories.infractions.findOne({ where: { guildId: guildId, userId: userId, infractionId: infractionId } });
    }

    public async saveInfraction(infraction: InfractionEntity) {
        return await this.repositories.infractions.save(infraction);
    }

    public async deleteInfraction(userId: string, infractionId: number) {
        return await this.repositories.infractions.delete({ userId: userId, infractionId: infractionId });
    }
}