import { UUIDV4 } from "sequelize";
import { Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Movie_category } from "./movie.categories";

@Table({
    tableName:'category',
    underscored:true
})

export class Category extends Model{
    @PrimaryKey
    @Default(UUIDV4)
    @Column(DataType.UUID)
    declare id: string

    @Column(DataType.STRING(50))
    name: string

    @Column({
        type: DataType.STRING(50),
        unique: true
    })
    slug: string;

    @Column(DataType.TEXT)
    description: string;

    @HasMany(() => Movie_category)
    movies: Movie_category
}