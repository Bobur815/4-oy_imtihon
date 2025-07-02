import { Module } from '@nestjs/common';
import { UserSubscriptionController } from './user_subscription.controller';
import { UserSubscriptionService } from './user_subscription.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/core/entities/users.entity';
import { Subscription_plan } from 'src/core/entities/subscription_plans';
import { User_subscriptions } from 'src/core/entities/User_subscriptions';
import { Payment } from 'src/core/entities/payment.entity';

@Module({
  imports: [SequelizeModule.forFeature([User,Subscription_plan,User_subscriptions,Payment])],
  controllers: [UserSubscriptionController],
  providers: [UserSubscriptionService]
})
export class UserSubscriptionModule {}
