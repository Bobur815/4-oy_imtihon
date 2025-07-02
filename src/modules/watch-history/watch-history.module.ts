import { Module } from '@nestjs/common';
import { WatchHistoryController } from './watch-history.controller';
import { WatchHistoryService } from './watch-history.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { WatchHistory } from 'src/core/entities/watch.history';
import { Movie } from 'src/core/entities/movies.entity';

@Module({
  imports:[SequelizeModule.forFeature([WatchHistory,Movie])],
  controllers: [WatchHistoryController],
  providers: [WatchHistoryService]
})
export class WatchHistoryModule {}
