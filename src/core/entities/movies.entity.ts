import { BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UUIDV4 } from 'sequelize';
import { User } from './users.entity';
import { SubscriptionType } from "../types/subscription.types";
import { Movie_category } from "./movie.categories";
import { MovieFile } from "./movie.files";
import { Favorite } from "./favourite.entity";
import { Review } from "./review.entity";
import { WatchHistory } from "./watch.history";


@Table({
    tableName:'movies',
    underscored:true
})

export class Movie extends Model{
    @PrimaryKey
    @Default(UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @Column({
        type: DataType.STRING(100)
    })
    title: string;

    @Column({
        type: DataType.STRING(100),
        unique: true
    })
    slug: string;

    @Column(DataType.TEXT)
    description: string;

    @Column(DataType.INTEGER)
    release_year: number;

    @Column(DataType.INTEGER)
    duration_minutes: number;

    @Column(DataType.STRING(255))
    poster_url: string;

    @Column(DataType.DECIMAL(3, 1))
    rating: number;

    @Default(SubscriptionType.FREE)
    @Column({
        type: DataType.ENUM(...Object.values(SubscriptionType)),
    })
    subscription_type: SubscriptionType;

    @Default(0)
    @Column(DataType.INTEGER)
    view_count: number;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    created_by: string;

    @BelongsTo(() => User)
    creator: User;

    @CreatedAt
    @Column({ field: 'created_at' })
    created_at: Date;

    @HasMany(() => Movie_category)
    categories: Movie_category

    @HasMany(()=> MovieFile)
    movie_files:MovieFile

    @HasMany(()=> Favorite)
    favorites:Favorite
    
    @HasMany(()=> Review)
    reviews:Review

    @HasMany(()=>WatchHistory)
    watched_history:WatchHistory
}