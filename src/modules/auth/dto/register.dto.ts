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

  @ApiPropertyOptional({ 
    description: 'Avatar image' 
  })
  @IsOptional()
  @IsString()
  readonly avatar_url?: string;

  @ApiPropertyOptional({ 
    example: 'Boburmirzo Ergashev', 
    description: 'Full name' 
  })
  @IsOptional()
  @IsString()
  readonly fullname?: string;

  @ApiPropertyOptional({ 
    example: '+998901234567', 
    description: 'Phone number' 
  })
  @IsOptional()
  @IsString()
  readonly phone?: string;

  @ApiPropertyOptional({ 
    example: 'Uzbekistan', 
    description: 'Country of origin' 
  })
  @IsOptional()
  @IsString()
  readonly country?: string;
}
