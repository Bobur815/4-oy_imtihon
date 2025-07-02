import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserDto {
  @ApiProperty({ description: 'User UUID' })
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @Exclude()
  password:string

  @ApiPropertyOptional({ description: 'Avatar image URL' })
  avatar_url?: string;

  @ApiPropertyOptional()
  fullname?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiProperty({ example: 'user', description: 'Role of the user' })
  role: string;

  @ApiProperty({ type: 'string'})
  createdAt: Date;
}
