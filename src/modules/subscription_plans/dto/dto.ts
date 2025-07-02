// src/modules/subscriptions/dto/create-subscription-plan.dto.ts

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsArray, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { SubscriptionType } from 'src/core/types/subscription.types';

export class CreateSubscriptionPlanDto {
  @ApiProperty({ example: 'premium', enum: SubscriptionType, description: 'Subscription type' })
  @IsEnum(SubscriptionType)
  name: SubscriptionType;

  @ApiProperty({ example: 19.99, description: 'Price in USD' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 30, description: 'Number of days the plan lasts' })
  @IsNumber()
  @Min(1)
  duration_days: number;

  @ApiProperty({
    example: ['HD Streaming', 'No Ads'],
    description: 'Array of features available in the plan',
    type: [String],
  })
  @IsArray()
  features: string[];

  @ApiProperty({ example: true, description: 'Is the plan active?', required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}


export class UpdateSubscriptionPlanDto extends PartialType(CreateSubscriptionPlanDto) {}

