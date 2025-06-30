import { BelongsTo, BelongsToMany, Column, CreatedAt, DataType, Default, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UUIDV4 } from 'sequelize';
import { User } from './users.entity';
import { SubscriptionType } from "../types/subscription.types";
import { Movie_category } from "./movie.categories";
import { MovieFile } from "./movie.files";
import { Favorite } from "./favourite.entity";
import { Review } from "./review.entity";
import { WatchHistory } from "./watch.history";
import { Category } from "./category.entity";


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
    declare title: string;

    @Column({
        type: DataType.STRING(100),
        unique: true
    })
    declare slug: string;

    @Column(DataType.TEXT)
    declare description: string;

    @Column(DataType.INTEGER)
    declare release_year: number;

    @Column(DataType.INTEGER)
    declare duration_minutes: number;

    @Column(DataType.STRING(255))
    declare poster_url: string;

    @Column(DataType.DECIMAL(3, 1))
    declare rating: number;

    @Default(SubscriptionType.FREE)
    @Column({
        type: DataType.ENUM(...Object.values(SubscriptionType)),
    })
    declare subscription_type: SubscriptionType;

    @Default(0)
    @Column(DataType.INTEGER)
    declare view_count: number;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    declare created_by: string;

    @BelongsTo(() => User)
    creator: User;

    @CreatedAt
    @Column({ field: 'created_at' })
    declare created_at: Date;

    @BelongsToMany(() => Category, () => Movie_category)
    declare categories: Category[];

    @HasMany(()=> MovieFile)
    movie_files:MovieFile

    @HasMany(()=> Favorite)
    favorites:Favorite
    
    @HasMany(()=> Review)
    reviews:Review

    @HasMany(()=>WatchHistory)
    watched_history:WatchHistory
}