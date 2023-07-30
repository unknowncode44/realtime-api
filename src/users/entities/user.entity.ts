import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    BeforeInsert, 
    BeforeUpdate, 
    CreateDateColumn, 
    UpdateDateColumn 
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


    @BeforeInsert()
    @BeforeUpdate()
    toLowerCase() {
        this.email      = this.email.toLowerCase();
        this.username   = this.username.toLowerCase();
    }

}
