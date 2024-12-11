import { DataSource, Repository } from 'typeorm';
import { KiwiClient } from '@/client';

import { dataSource } from '@/datasource';

import { ConfigEntity } from '@/entities/Config';
import { UserLevelEntity } from '@/entities/UserLevel';
import { InfractionEntity } from '@/entities/Infraction';

export class DatabaseManager {
	public dataSource: DataSource;
	public client: KiwiClient;
	public repos: {
		config?: Repository<ConfigEntity>;
		levels?: Repository<UserLevelEntity>;
		infractions?: Repository<InfractionEntity>;
	};

	constructor(client: KiwiClient) {
		this.client = client;
		this.dataSource = dataSource;

		this.onCreate();
	}

	private async onCreate() {
		this.repos = {
			config: this.dataSource.getMongoRepository(ConfigEntity),
			levels: this.dataSource.getMongoRepository(UserLevelEntity),
			infractions: this.dataSource.getMongoRepository(InfractionEntity),
		};
	}

	public async generateConfigs(guildId: string) {
		var config = await this.getGuildConfig(guildId);
		console.log(config, 1011);
		if (!config) {
			console.log('Creating new config', 1013);
			config = new ConfigEntity();
			config.guildId = guildId;
		}
		if (!config.prefix) {
			config.prefix = '!';
		}
		if (!config.trustedRole) {
			config.trustedRole = null;
		}
		if (!config.roles) {
			config.roles = {};
		}
		if (!config.levelRewards) {
			config.levelRewards = {};
		}
		if (!config.levelUpMessage) {
			config.levelUpMessage =
				'**Congrats {userMention} you have leveled up to level {level}!**';
		}
		if (!config.levelUpChannel) {
			config.levelUpChannel = null;
		}
		for (var module of this.client.ModuleManager.Modules.keys()) {
			if (!config.modules[module]) {
				config.modules[module] = false;
			}
		}
		console.log(config, 1040);

		return await this.saveGuildConfig(config);
	}

	public async getGuildConfig(guildId: string) {
		return await this.repos.config.findOne({ where: { guildId: guildId } });
	}

	public async saveGuildConfig(config: ConfigEntity) {
		return await this.repos.config.save(config);
	}

	public async isModuleEnabled(guildId: string, moduleId: string) {
		let config = await this.repos.config.findOne({
			where: { guildId: guildId },
		});
		if (config?.modules[moduleId]) {
			return true;
		}
		return false;
	}

	public async createUserLevel(
		guildId: string,
		userId: string,
		userName: string
	) {
		let userLevel = new UserLevelEntity();
		userLevel.guildId = guildId;
		userLevel.userId = userId;
		userLevel.userName = userName;
		return await this.repos.levels.save(userLevel);
	}

	public async getUserLevel(guildId: string, userId: string) {
		return await this.repos.levels.findOne({
			where: { guildId: guildId, userId: userId },
		});
	}

	public async saveUserLevel(userLevel: UserLevelEntity) {
		return await this.repos.levels.save(userLevel);
	}

	public async createInfraction(
		guildId: string,
		userId: string,
		userName: string,
		reason: string
	) {
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
		return await this.repos.infractions.save(infraction);
	}

	public async getInfractions(guildId: string, userId: string) {
		return await this.repos.infractions.find({
			where: { guildId: guildId, userId: userId },
		});
	}

	public async getInfraction(
		guildId: string,
		userId: string,
		infractionId: number
	) {
		return await this.repos.infractions.findOne({
			where: {
				guildId: guildId,
				userId: userId,
				infractionId: infractionId,
			},
		});
	}

	public async saveInfraction(infraction: InfractionEntity) {
		return await this.repos.infractions.save(infraction);
	}

	public async deleteInfraction(userId: string, infractionId: number) {
		return await this.repos.infractions.delete({
			userId: userId,
			infractionId: infractionId,
		});
	}
}
