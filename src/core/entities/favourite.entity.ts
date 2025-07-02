import {Table,Model,Column,PrimaryKey,Default,ForeignKey,DataType,BelongsTo,CreatedAt,} from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';
import { User } from './users.entity';
import { Movie } from './movies.entity';
  
  @Table({
    tableName: 'favorites',
    underscored: true,
  })
  export class Favorite extends Model {
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
  
    @CreatedAt
    @Column({ field: 'created_at' })
    declare created_at: Date;
  }
  