import {Table, Model, Column, PrimaryKey, ForeignKey, Default, DataType,} from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';
import { Movie } from './movies.entity';
import { Category } from './category.entity';
  
  @Table({
    tableName: 'movie_categories',
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['movie_id', 'category_id'],
      },
    ],
  })
  export class Movie_category extends Model {
    @PrimaryKey
    @Default(UUIDV4)
    @Column(DataType.UUID)
    declare id: string;
  
    @ForeignKey(() => Movie)
    @Column(DataType.UUID)
    declare movie_id: string;
  
    @ForeignKey(() => Category)
    @Column(DataType.UUID)
    declare category_id: string;
  }
  