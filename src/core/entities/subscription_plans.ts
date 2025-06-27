import { UUIDV4 } from "sequelize";
import { Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User_subscriptions } from "./User_subscriptions";

@Table({
    tableName: 'subscription_plans',
    underscored: true,
  })
  export class Subscription_plan extends Model {
    @PrimaryKey
    @Default(UUIDV4)
    @Column(DataType.UUID)
    subscription_plan_id: string;
  
    @Column
    name: string;
  
    @Column({
      type: DataType.DECIMAL(10, 2),
    })
    price: number;
  
    @Column
    duration_days: number;
  
    @Column(DataType.JSON)
    features: object;
  
    @Default(true)
    @Column(DataType.BOOLEAN)
    is_active: boolean;
  
    @HasMany(() => User_subscriptions)
    user_subscriptions: User_subscriptions[];
  }