
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { SubscriptionStatus } from 'src/core/types/status.type';

export class CreateUserSubscriptionDto {

  @ApiProperty({
    example: SubscriptionStatus.PENDING_PAYMENT,
    enum: SubscriptionStatus,
    description: 'Subscription status',
  })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @ApiProperty({
    example: 'a6db999e-1234-4b6b-8cce-6c5f3f5e9876',
    description: 'ID of the subscription plan',
  })
  @IsUUID()
  plan_id: string;
}
