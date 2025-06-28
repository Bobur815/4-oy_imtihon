import { UUIDV4 } from "sequelize";
import { Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UserRole } from "../types/userRole.type";
import { User_subscriptions } from "./User_subscriptions";
import { Movie } from "./movies.entity";
import { Favorite } from "./favourite.entity";
import { Review } from "./review.entity";
import { WatchHistory } from "./watch.history";
import { UserPermission } from "./userPermission.entity";

@Table({
  tableName: 'users',
  underscored: true,
})
export class User extends Model{
  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ allowNull: false, unique: true })
  declare username: string;

  @Column({ allowNull: false, type: DataType.STRING })
  declare email: string;

  @Column({ allowNull: false })
  declare password: string;

  @Default(UserRole.USER)
  @Column({ type: DataType.ENUM(...Object.values(UserRole)) })
  declare role: UserRole;

  
  @HasMany(() => User_subscriptions)
  subscriptions: User_subscriptions[];

  @HasMany(() => Movie)
  movies: Movie[];

  @HasMany(() => Favorite)
  favorites: Favorite[];

  @HasMany(() => Review)
  reviews: Review[];

  @HasMany(() => WatchHistory)
  watched_history: WatchHistory[];

  @HasMany(() => UserPermission)
  permissions: UserPermission[];
}