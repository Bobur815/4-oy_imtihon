import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class MovieCategoryDto {
    @ApiProperty({
        description:'movie uuid'
    })
    @IsNotEmpty()
    movie_id:string

    @ApiProperty({
        description:'category uuid'
    })
    @IsNotEmpty()
    category_id:string
}
