import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsInt, Min, Max, IsUrl, IsEnum, IsOptional,} from 'class-validator';
import { SubscriptionType } from 'src/core/types/subscription.types';

export class MovieDto {
  @ApiProperty({ example: 'Titanic' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    example:
      'romantic adventure and drama, catastrophe'})
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ example: 1996 })
  @IsNotEmpty()
  @IsInt()
  @Min(1950)
  @Max(new Date().getFullYear() + 1)
  release_year: number;

  @ApiProperty({ example: 148, description: 'Duration in minutes' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(600)
  duration_minutes: number;

  @ApiProperty({ example: 'titanic.jpg' })
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(255)
  poster_url: string;

  @ApiPropertyOptional({
    enum: SubscriptionType,
    example: SubscriptionType.FREE,
  })
  @IsOptional()
  @IsEnum(SubscriptionType)
  subscription_type?: string;
}


export class UpdateMovieDto extends PartialType(MovieDto) {}

