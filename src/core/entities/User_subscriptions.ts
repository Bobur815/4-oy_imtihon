import { BelongsTo, Column, DataType, Default, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./users.entity";
import { Subscription_plan } from "./subscription_plans";
import { SubscriptionStatus } from "../types/status.type";
import { Payment } from "./payment.entity";

@Table({
    tableName:'user_subscriptions',
    underscored:true
})
export class User_subscriptions extends Model{
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type:DataType.UUID
    })
    user_subscriptions_id:string

    @Default(DataType.NOW)
    @Column({
        type:DataType.DATE
    })
    start_date: string

    @Column({
        type:DataType.DATE
    })
    end_date: string

    @Default(SubscriptionStatus.PENDING_PAYMENT)
    @Column({
        type:DataType.ENUM(...Object.values(SubscriptionStatus))
    })
    status:string

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    user_id:string

    @BelongsTo(()=> User)
    user: User

    @ForeignKey(()=> Subscription_plan)
    @Column(DataType.UUID)
    plan_id:string

    @BelongsTo(()=> Subscription_plan)
    subscription_plan:Subscription_plan

    @HasMany(()=> Payment)
    payments: Payment
}