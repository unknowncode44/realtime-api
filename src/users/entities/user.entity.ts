import { ConnectionEntity } from "../../todo/entities/connection.entity";
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    BeforeInsert, 
    BeforeUpdate, 
    CreateDateColumn, 
    UpdateDateColumn, 
    OneToMany
} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id      :         number;

    @Column({unique: true, nullable: false})
    username:   string;

    @Column({unique: true, nullable: false})
    email   :      string;

    @Column({nullable: false, select: false})
    password:   string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() =>  ConnectionEntity, (connection) => connection.connectedUser)
    connections: ConnectionEntity[]


    @BeforeInsert()
    @BeforeUpdate()
    toLowerCase() {
        this.email      = this.email.toLowerCase();
        this.username   = this.username.toLowerCase();
    }

}
