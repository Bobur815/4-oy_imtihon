import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MaxLength } from "class-validator"

export class CategoryDto {
    @ApiProperty({
        example:'action,comedy'
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name:string

    @ApiProperty({
        example:'action-comedy',
        description:"must be unique"
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    slug:string

    @ApiProperty({
        example:'combat, explosions, comedic moments, humor'
    })
    @IsNotEmpty()
    @IsString()
    description: string
}
