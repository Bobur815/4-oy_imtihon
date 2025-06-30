import { UUIDV4 } from "sequelize";
import { BelongsToMany, Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Movie_category } from "./movie.categories";
import { Movie } from "./movies.entity";

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
    declare name: string

    @Column({
        type: DataType.STRING(50),
        unique: true
    })
    declare slug: string;

    @Column(DataType.TEXT)
    declare description: string;

    @BelongsToMany(() => Movie, () => Movie_category)
    declare movies: Movie[];
}