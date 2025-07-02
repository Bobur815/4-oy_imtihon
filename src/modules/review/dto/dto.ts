// src/modules/reviews/dto/create-review.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, Max, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 'b7d2e123-a3f4-456c-92c2-6c26e1c8fe45', description: 'Movie ID' })
  @IsUUID()
  movie_id: string;

  @ApiProperty({ example: 5, description: 'Rating value from 1 to 10' })
  @IsInt()
  @Min(1)
  @Max(10)
  rating: number;

  @ApiProperty({ description: 'Optional review comment' })
  @IsOptional()
  @IsString()
  comment?: string;
}
