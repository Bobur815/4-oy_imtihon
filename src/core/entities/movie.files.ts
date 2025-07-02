import {Table,Model,Column,PrimaryKey,ForeignKey,Default,DataType,BelongsTo,} from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';
import { Movie } from './movies.entity';
import { VideoQuality } from '../types/video.quality';
import { Language } from '../types/language.type';
  
  @Table({
    tableName: 'movie_files',
    underscored: true,
  })
  export class MovieFile extends Model {
    @PrimaryKey
    @Default(UUIDV4)
    @Column(DataType.UUID)
    declare id: string;
  
    @ForeignKey(() => Movie)
    @Column(DataType.UUID)
    declare movie_id: string;
  
    @BelongsTo(() => Movie)
    movie: Movie;
  
    @Column({
      type: DataType.STRING(255),
      allowNull: false,
    })
    declare file_url: string;
  
    @Column({
      type: DataType.ENUM(...Object.values(VideoQuality)),
      allowNull: false,
    })
    declare quality: VideoQuality;
  
    @Default('uz')
    @Column(DataType.ENUM(...Object.values(Language)))
    declare language: Language;
  }
  