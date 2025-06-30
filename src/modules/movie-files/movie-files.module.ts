import { Module } from '@nestjs/common';
import { MovieFilesService } from './movie-files.service';

@Module({
  providers: [MovieFilesService]
})
export class MovieFilesModule {}
