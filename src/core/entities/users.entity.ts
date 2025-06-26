
import { UUIDV4 } from "sequelize";
import { Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: 'users',
    underscored: true
})

export class User extends Model{
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: UUIDV4
    })
    declare id:string

    @Column
    username:string

    @Column
    email: string

    @Column
    password:string

    @Column
    role: enum

}