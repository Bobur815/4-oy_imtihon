import { ConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize';
import { Category } from 'src/core/entities/category.entity';
import { Favorite } from 'src/core/entities/favourite.entity';
import { Movie_category } from 'src/core/entities/movie.categories';
import { MovieFile } from 'src/core/entities/movie.files';
import { Movie } from 'src/core/entities/movies.entity';
import { Payment } from 'src/core/entities/payment.entity';
import { Permission } from 'src/core/entities/permissions.entity';
import { Profile } from 'src/core/entities/profiles.entity';
import { Review } from 'src/core/entities/review.entity';
import { Subscription_plan } from 'src/core/entities/subscription_plans';
import { User_subscriptions } from 'src/core/entities/User_subscriptions';
import { UserPermission } from 'src/core/entities/userPermission.entity';
import { User } from 'src/core/entities/users.entity';
import { WatchHistory } from 'src/core/entities/watch.history';

export const databaseConfig = (config: ConfigService) => ({
  dialect: config.get<string>('DB_DIALECT') as Dialect || 'postgres',
  host: config.get<string>('DB_HOST'),
  port: config.get<number>('DB_PORT'),
  username: config.get<string>('DB_USERNAME'),
  password: config.get<string>('DB_PASSWORD'),
  database: config.get<string>('DB_NAME'),
  models: [
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
    UserPermission,
  ],
  autoLoadModels: true,
  synchronize: true,
  logging: config.get<boolean>('DB_LOGGING') || false,
});
