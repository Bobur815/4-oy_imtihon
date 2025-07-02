import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class FavoriteDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    movie_id:string
}
