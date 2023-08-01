import { Column, PrimaryGeneratedColumn, Entity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Status, Complexity } from "../todo.interface";
import { UserI } from "../../users/user.interface";

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status      : Status;

    @Column()
    complexity  : Complexity;

    @Column()
    title   : string;
    
    @Column()
    subtitle: string;
    
    @Column()
    text    : string;

    // @CreateDateColumn()
    // createdAt: Date;

    // @UpdateDateColumn()
    // updatedAt: Date;

    // @Column()
    // createdBy: UserI

    // @Column()
    // updatedBy: UserI

}