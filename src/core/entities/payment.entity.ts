import { UUIDV4 } from "sequelize";
import { BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User_subscriptions } from "./User_subscriptions";
import { PaymentMethod } from "../types/payment.types";
import { PaymentStatus } from "../types/status.type";

@Table({
    tableName: 'payments',
    underscored: true,
  })
  export class Payment extends Model {
    @PrimaryKey
    @Default(UUIDV4)
    @Column(DataType.UUID)
    declare id: string;
  
    @ForeignKey(() => User_subscriptions)
    @Column(DataType.UUID)
    declare user_subscription_id: string;
  
    @BelongsTo(() => User_subscriptions)
    user_subscription: User_subscriptions;
  
    @Column(DataType.DECIMAL(10, 2))
    declare amount: number;
  
    @Column({
      type: DataType.ENUM(...Object.values(PaymentMethod)),
    })
    declare payment_method: PaymentMethod;
  
    @Column(DataType.JSON)
    declare payment_details: object;
  
    @Column({
      type: DataType.ENUM(...Object.values(PaymentStatus)),
    })
    declare status: PaymentStatus;
  
    @Column(DataType.STRING(100))
    declare external_transaction_id: string;
  
    @CreatedAt
    @Column({ field: 'created_at' })
    declare created_at: Date;
  }