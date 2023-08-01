import { User } from "../../users/entities/user.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, Connection } from "typeorm";

@Entity()
export class ConnectionEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    socketId: string;


    @ManyToOne(() => User, (user) => user.connections)
    @JoinColumn()
    connectedUser: User

}