import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VideoQuality } from 'src/core/types/video.quality';
import { Language } from 'src/core/types/language.type';

export class CreateMovieFileDto {
  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'UUID of the movie this file belongs to',
  })
  @IsUUID()
  movie_id: string;

  @ApiProperty({
    example: 'abc123-720p.mp4',
    description: 'video file url',
  })
  @IsString()
  file_url: string;

  @ApiProperty({
    example: '720p',
    enum: VideoQuality,
    description: 'Video quality of the file',
  })
  @IsEnum(VideoQuality)
  quality: VideoQuality;

  @ApiProperty({
    example: 'uz',
    enum: Language,
    description: 'Language of the movie file',
    default: 'uz',
  })
  @IsEnum(Language)
  language: Language;
}


export class UpdateMovieFileDto {
  @ApiPropertyOptional({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'UUID of the movie this file belongs to',
  })
  @IsUUID()
  @IsOptional()
  movie_id?: string;

  @ApiPropertyOptional({
    example: 'abc123-720p.mp4',
    description: 'video file url',
  })
  @IsString()
  @IsOptional()
  file_url?: string;

  @ApiPropertyOptional({
    example: '720p',
    enum: VideoQuality,
    description: 'Video quality of the file',
  })
  @IsEnum(VideoQuality)
  @IsOptional()
  quality?: VideoQuality;

  @ApiPropertyOptional({
    example: 'uz',
    enum: Language,
    description: 'Language of the movie file',
    default: 'uz',
  })
  @IsEnum(Language)
  @IsOptional()
  language?: Language;
}

