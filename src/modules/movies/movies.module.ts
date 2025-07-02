import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Movie } from 'src/core/entities/movies.entity';
import { MovieFile } from 'src/core/entities/movie.files';

@Module({
  imports: [SequelizeModule.forFeature([Movie,MovieFile])],
  controllers: [MoviesController],
  providers:[MoviesService]
})
export class MoviesModule {}
