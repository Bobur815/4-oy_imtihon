import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './core/entities/users.entity';
import { Movie } from './core/entities/movies.entity';
import { User_subscriptions } from './core/entities/User_subscriptions';
import { Permission } from './core/entities/permissions.entity';
import { MovieFile } from './core/entities/movie.files';
import { WatchHistory } from './core/entities/watch.history';
import { Category } from './core/entities/category.entity';
import { Favorite } from './core/entities/favourite.entity';
import { Movie_category } from './core/entities/movie.categories';
import { Payment } from './core/entities/payment.entity';
import { Review } from './core/entities/review.entity';
import { UserPermission } from './core/entities/userPermission.entity';
import { Subscription_plan } from './core/entities/subscription_plans';
import { RedisModule } from './common/redis/redis.module';
import { Profile } from './core/entities/profiles.entity';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { MoviesService } from './modules/movies/movies.service';
import { MoviesModule } from './modules/movies/movies.module';
import { MovieCategoriesModule } from './modules/movie-categories/movie-categories.module';
import { MovieFilesController } from './modules/movie-files/movie-files.controller';
import { MovieFilesModule } from './modules/movie-files/movie-files.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { PaymentsController } from './modules/payments/payments.controller';
import { PaymentsModule } from './modules/payments/payments.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { ReviewModule } from './modules/review/review.module';
import { SubscriptionPlansModule } from './modules/subscription_plans/subscription_plans.module';
import { UserSubscriptionModule } from './modules/user_subscription/user_subscription.module';
import { UserPermissionModule } from './modules/user_permission/user_permission.module';
import { WatchHistoryModule } from './modules/watch-history/watch-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    SequelizeModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(config:ConfigService)=> ({
        dialect:'postgres',
        host:config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        models:[
          User,
          Profile,
          Category,
          Movie,
          Permission,
          Subscription_plan,
          User_subscriptions,
          WatchHistory,
          Favorite,
          Movie_category,
          MovieFile,
          Payment,
          Review,
          UserPermission
        ],
        autoLoadModels: true,           
        synchronize: true,
        logging: config.get<boolean>('DB_LOGGING') || false,
      })
    }),
    AuthModule,
    UsersModule,
    RedisModule,
    ProfilesModule,
    CategoriesModule,
    MoviesModule,
    MovieCategoriesModule,
    MovieFilesModule,
    FavoriteModule,
    PaymentsModule,
    PermissionsModule,
    ReviewModule,
    SubscriptionPlansModule,
    UserSubscriptionModule,
    UserPermissionModule,
    WatchHistoryModule
  ]
})
export class AppModule {}

