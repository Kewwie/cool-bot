import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('config')
export class ConfigEntity {
	@ObjectIdColumn()
	id: ObjectId;

	@Column('guild_id')
	guildId: string;

	@Column('prefix')
	prefix: string;

	@Column('trusted_role')
	trustedRole: string;

	@Column('roles')
	roles: {
		[id: string]: {
			[command: string]: boolean;
		};
	};

	@Column('level_reward')
	levelRewards: {
		roleId: string;
		level: number;
		permanent: boolean;
	}[];

	@Column('level_up_message')
	levelUpMessage: string;

	@Column('level_up_channel')
	levelUpChannel: string;

	@Column('modules')
	modules: {
		[moduleId: string]: boolean;
	};
}
