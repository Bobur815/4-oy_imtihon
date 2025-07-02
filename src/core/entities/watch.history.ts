import {Table,Model,Column,PrimaryKey,Default,ForeignKey,DataType,BelongsTo,} from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';
import { User } from './users.entity';
import { Movie } from './movies.entity';
  
  @Table({
    tableName: 'watch_history',
    underscored: true,
  })
  export class WatchHistory extends Model {
    @PrimaryKey
    @Default(UUIDV4)
    @Column(DataType.UUID)
    declare id: string;
  
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    declare user_id: string;
  
    @BelongsTo(() => User)
    user: User;
  
    @ForeignKey(() => Movie)
    @Column(DataType.UUID)
    declare movie_id: string;
  
    @BelongsTo(() => Movie)
    movie: Movie;
  
    @Column(DataType.INTEGER)
    declare watched_duration: number;
  
    @Column(DataType.DECIMAL(5, 2))
    declare watched_percentage: number;
  
    @Default(DataType.NOW)
    @Column({ field: 'last_watched', type: DataType.DATE })
    declare last_watched: Date;
  }
  