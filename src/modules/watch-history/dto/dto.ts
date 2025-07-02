import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min, Max } from 'class-validator';

export class CreateWatchHistoryDto {
  @ApiProperty({
    example: '99887766-5544-3322-1100-aabbccddeeff',
    description: 'Movie ID that was watched',
  })
  @IsUUID()
  movie_id: string;

  @ApiProperty({
    example: 120,
    description: 'Number of minutes watched',
  })
  @IsNumber()
  @Min(0)
  watched_duration: number;

  @ApiProperty({
    example: 75.5,
    description: 'Percentage of movie watched',
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  watched_percentage: number;
}

export class UpdateWatchHistoryDto extends PartialType(CreateWatchHistoryDto){}
