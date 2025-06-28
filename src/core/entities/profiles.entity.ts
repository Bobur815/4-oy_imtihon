import { UUIDV4, Sequelize } from "sequelize";
import { Column, DataType, Default, ForeignKey, BelongsTo, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./users.entity";

@Table({
  tableName: 'profiles',
  underscored: true,
  timestamps: true
})
export class Profile extends Model {
  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare user_id: string;

  @BelongsTo(() => User)
  user: User;

  @Column({ allowNull: true })
  declare avatar_url: string;

  @Column({ allowNull: true })
  declare fullname: string;

  @Column({ allowNull: true })
  declare phone: string;

  @Column({ allowNull: true })
  declare country: string;
}
