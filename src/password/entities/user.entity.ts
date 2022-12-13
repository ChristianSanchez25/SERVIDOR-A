import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/*
    La clase User es una entidad que se guarda en la base de datos
*/
@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    nombre: string;
    
    @Column({ unique: true, type: 'integer'})
    password: number;

}