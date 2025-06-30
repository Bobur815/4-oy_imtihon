import { Module } from '@nestjs/common';
import { UserSubscriptionController } from './user_subscription.controller';
import { UserSubscriptionService } from './user_subscription.service';

@Module({
  controllers: [UserSubscriptionController],
  providers: [UserSubscriptionService]
})
export class UserSubscriptionModule {}
