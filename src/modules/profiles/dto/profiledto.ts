// src/modules/profiles/dto/profile.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProfileDto {
  @ApiPropertyOptional({ description: 'Avatar image URL' })
  @IsOptional() 
  @IsString()
  avatar_url?: string;

  @ApiPropertyOptional({ example: 'Boburmirzo Ergashev', description: 'Full name' })
  @IsOptional() 
  @IsString()
  fullname?: string;

  @ApiPropertyOptional({ example: '+998901234567', description: 'Phone number' })
  @IsOptional() 
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Uzbekistan', description: 'Country of origin' })
  @IsOptional() 
  @IsString()
  country?: string;
}
