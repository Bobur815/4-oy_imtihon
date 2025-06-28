import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength} from "class-validator";

export class LoginDto{
    @ApiProperty({ 
        example: 'Bobur93', 
        description: 'Unique username' 
    })
    @IsNotEmpty()
    @IsString()
    username:string

    @ApiProperty({ 
        description: 'Password (min length 6)', 
        minLength: 6 
      })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}