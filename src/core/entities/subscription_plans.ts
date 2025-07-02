import { UUIDV4 } from 'sequelize';
import { Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { User_subscriptions } from './User_subscriptions';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionType } from '../types/subscription.types';

@Table({
  tableName: 'subscription_plans',
  underscored: true,
})
export class Subscription_plan extends Model {
  @ApiProperty({ example: 'uuid-value', description: 'Unique ID for the subscription plan' })
  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  declare subscription_plan_id: string;

  @ApiProperty({ example: 'premium', enum: SubscriptionType, description: 'Subscription type' })
  @Column({
    type: DataType.ENUM(...Object.values(SubscriptionType)),
    unique: true,
  })
  declare name: SubscriptionType;

  @ApiProperty({ example: 19.99, description: 'Price of the plan in USD' })
  @Column({ type: DataType.DECIMAL(10, 2) })
  declare price: number;

  @ApiProperty({ example: 30, description: 'Duration of the plan in days' })
  @Column
  declare duration_days: number;

  @ApiProperty({ example: ['HD Streaming', 'No Ads'], description: 'Features included in the plan', type: [String] })
  @Column(DataType.JSON)
  declare features: object;

  @ApiProperty({ example: true, description: 'Whether the plan is currently active' })
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare is_active: boolean;

  @HasMany(() => User_subscriptions)
  user_subscriptions: User_subscriptions[];
}
