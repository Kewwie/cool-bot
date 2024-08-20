import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity("config")
export class ConfigEntity {
    @ObjectIdColumn()
    id: ObjectId;

    @Column("guild_id")
    guildId: string;

    @Column("trusted_role")
    trustedRole: string = null;

    @Column("permission_levels")
    permissionLevels: {
        [key: string]: number;
    } = {};

    @Column("level_reward")
    levelReward: {
        [key: number]: string;
    } = {};

    @Column("level_up_message")
    levelUpMessage: string = "**Congrats {userMention} you have leveled up to level {level}!**";

    @Column("level_up_channel")
    levelUpChannel: string = null;
}