import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity("user_levels")
export class UserLevelEntity {
    @ObjectIdColumn()
    id: ObjectId;

    @Column("guild_id")
    guildId: string;

    @Column("user_id")
    userId: string;

    @Column("user_name")
    userName: string;

    @Column("level")
    level: number;

    @Column("xp")
    xp: number;

    @Column("last_updated")
    lastUpdated: Date;
}