import { Module } from '@nestjs/common';
import { SubscriptionPlansController } from './subscription_plans.controller';
import { SubscriptionPlansService } from './subscription_plans.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subscription_plan } from 'src/core/entities/subscription_plans';

@Module({
  imports: [SequelizeModule.forFeature([Subscription_plan])],
  controllers: [SubscriptionPlansController],
  providers: [SubscriptionPlansService]
})
export class SubscriptionPlansModule {}
