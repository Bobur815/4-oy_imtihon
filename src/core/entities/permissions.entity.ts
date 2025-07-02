import { Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UserPermission } from "./userPermission.entity";

@Table({
    tableName:'permissions',
    underscored:true
})

export class Permission extends Model{
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string

    @Column(DataType.STRING(30))
    name:string

    @HasMany(()=> UserPermission)
    user_permissions: UserPermission
}