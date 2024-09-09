import { Entity, ObjectIdColumn, ObjectId, Column, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity("infractions")
export class InfractionsEntity {
    @ObjectIdColumn()
    id: ObjectId;

    @Column("guild_id")
    guildId: string;

    @Column("user_id")
    userId: string;

    @Column("user_name")
    userName: string;

    @Column("level")
    reason: string;

    @Column("created_at")
    createdAt: Date;

    @BeforeInsert()
    AddCreatedAt() {
        this.createdAt = new Date();
    }
}