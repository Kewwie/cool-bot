import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';
import { IsNotEmpty, IsDefined } from 'class-validator';

@Entity("user_levels")
export class UserLevelEntity {
    @ObjectIdColumn()
    id: ObjectId;

    @Column({ name: "guild_id", nullable: false })
    @IsNotEmpty()
    @IsDefined()
    guildId: string;

    @Column({ name: "user_id", nullable: false })
    @IsNotEmpty()
    @IsDefined()
    userId: string;

    @Column({ name: "user_name", nullable: false })
    @IsNotEmpty()
    @IsDefined()
    userName: string;

    @Column("level")
    level: number = 0;

    @Column("xp")
    xp: number = 0;

    @Column("last_updated")
    lastUpdated: Date = new Date();
}