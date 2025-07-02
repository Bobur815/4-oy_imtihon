import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { RedisModule } from './common/redis/redis.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { MoviesModule } from './modules/movies/movies.module';
import { MovieCategoriesModule } from './modules/movie-categories/movie-categories.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { ReviewModule } from './modules/review/review.module';
import { SubscriptionPlansModule } from './modules/subscription_plans/subscription_plans.module';
import { UserSubscriptionModule } from './modules/user_subscription/user_subscription.module';
import { UserPermissionModule } from './modules/user_permission/user_permission.module';
import { WatchHistoryModule } from './modules/watch-history/watch-history.module';
import { SuperAdminSeeder } from './common/utils/seedor';
import { databaseConfig } from './common/config/database';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    SequelizeModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:databaseConfig
    }),
    AuthModule,
    UsersModule,
    RedisModule,
    ProfilesModule,
    CategoriesModule,
    MoviesModule,
    MovieCategoriesModule,
    FavoriteModule,
    ReviewModule,
    SubscriptionPlansModule,
    UserSubscriptionModule,
    UserPermissionModule,
    WatchHistoryModule
  ],
  providers: [SuperAdminSeeder],
})
export class AppModule {}

