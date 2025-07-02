import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from 'src/core/entities/review.entity';
import { Movie } from 'src/core/entities/movies.entity';
import { User } from 'src/core/entities/users.entity';

@Module({
  imports:[SequelizeModule.forFeature([Review,Movie,User])],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {}
