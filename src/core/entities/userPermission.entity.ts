import { BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./users.entity";
import { Permission } from "./permissions.entity";

@Table({
    tableName:'user_permissions',
    underscored:true
})

export class UserPermission extends Model{
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string

    @ForeignKey(()=> User)
    user_id: string

    @BelongsTo(()=> User)
    user: User

    @ForeignKey(()=> Permission)
    permission_id:string

    @BelongsTo(()=> Permission)
    permissions:Permission
}