import {Table,Model,Column,PrimaryKey,Default,ForeignKey,DataType,BelongsTo,CreatedAt,} from 'sequelize-typescript';
import { User } from './users.entity';
import { UUIDV4 } from 'sequelize';
import { Movie } from './movies.entity';

@Table({
    tableName: 'reviews',
    underscored: true,
  })
  export class Review extends Model {
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
  
    @Column({
      type: DataType.INTEGER
    })
    declare rating: number;
  
    @Column(DataType.TEXT)
    declare comment: string;
  
    @CreatedAt
    @Column({ field: 'created_at' })
    declare created_at: Date;
  }
  