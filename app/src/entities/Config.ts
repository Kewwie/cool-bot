import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';
import { IsNotEmpty, IsDefined } from 'class-validator';

@Entity("config")
export class ConfigEntity {
    @ObjectIdColumn()
    id: ObjectId;

    @Column({ name: "guild_id", nullable: false })
    @IsNotEmpty()
    @IsDefined()
    guildId: string;

    @Column({ name: "trusted_role", nullable: false })
    @IsNotEmpty()
    @IsDefined()
    trustedRole: string = null;

    @Column("permission_levels")
    permissionLevels: {
        [key: string]: number;
    } = {};

    @Column("level_role")
    levelRole: {
        [key: string]: number;
    } = {};
}