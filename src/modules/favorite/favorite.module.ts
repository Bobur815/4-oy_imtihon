import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Favorite } from 'src/core/entities/favourite.entity';
import { Movie } from 'src/core/entities/movies.entity';
import { User } from 'src/core/entities/users.entity';

@Module({
  imports: [SequelizeModule.forFeature([Favorite,Movie,User])],
  controllers: [FavoriteController],
  providers: [FavoriteService]
})
export class FavoriteModule {}
