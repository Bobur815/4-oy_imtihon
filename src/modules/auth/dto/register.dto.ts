import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsOptional,} from 'class-validator';

export class AuthDto {
  @ApiProperty({ 
    example: 'Bobur93', 
    description: 'Unique username' 
  })
  @IsString()
  readonly username: string;

  @ApiProperty({ 
    example: 'bobur@gmail.com', 
    description: 'Valid email address' 
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ 
    description: 'Password (min length 6)', 
    minLength: 6 
  })
  @IsString()
  @MinLength(6)
  readonly password: string;

}
