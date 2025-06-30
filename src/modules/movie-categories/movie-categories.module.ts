import { Module } from '@nestjs/common';
import { MovieCategoriesController } from './movie-categories.controller';
import { MovieCategoriesService } from './movie-categories.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Movie_category } from 'src/core/entities/movie.categories';
import { Movie } from 'src/core/entities/movies.entity';
import { Category } from 'src/core/entities/category.entity';

@Module({
  imports: [SequelizeModule.forFeature([Movie_category,Movie,Category])],
  controllers: [MovieCategoriesController],
  providers: [MovieCategoriesService]
})
export class MovieCategoriesModule {}
