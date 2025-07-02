import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { responseMessage } from 'src/common/utils/response-message';
import { User_subscriptions } from 'src/core/entities/User_subscriptions';
import { User } from 'src/core/entities/users.entity';
import { CreateUserSubscriptionDto } from './dto/dto';
import { Subscription_plan } from 'src/core/entities/subscription_plans';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payments.dto';
import { Payment } from 'src/core/entities/payment.entity';

@Injectable()
export class UserSubscriptionService {
    constructor(
        @InjectModel(User_subscriptions)
        private readonly userSubscriptionModel: typeof User_subscriptions,
        @InjectModel(Subscription_plan)
        private readonly subscription_planModel: typeof Subscription_plan,
        @InjectModel(User)
        private readonly userModel: typeof User,
        @InjectModel(Payment)
        private readonly paymentModel: typeof Payment,
    ){}

    async getAll(){
        const subscriptions = await this.userSubscriptionModel.findAll({
            include:[Payment]
        })
        return responseMessage(undefined,subscriptions)
    }

    async getByUser(user_id:string){
        const subscriptions = await this.userSubscriptionModel.findAll({where:{user_id},include:[Payment]})
        return responseMessage(undefined,subscriptions)
    }

    async getByPlan(plan_id:string){
        const subscriptions = await this.userSubscriptionModel.findAll({where:{plan_id},include:[Payment]})
        if(!subscriptions.length) throw new NotFoundException("Subscriptions by plan_id not found")
        return responseMessage(undefined,subscriptions)
    }

    async createSubscription(user_id:string,payload:CreateUserSubscriptionDto){
        let user = await this.userModel.findByPk(user_id)
        if(!user){
            throw new NotFoundException("User not found")
        }

        const plan = await this.subscription_planModel.findByPk(payload.plan_id)
        if(!plan){
            throw new NotFoundException("Plan not found")
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + plan.duration_days);

        const newSub = await this.userSubscriptionModel.create({
            ...payload,
            user_id,
            start_date: startDate,
            end_date: endDate,
        });

        return responseMessage('Subscription successfully created', newSub);
    }

    async createPayment(payload:CreatePaymentDto){
        const user_subscription = await this.userSubscriptionModel.findByPk(payload.user_subscription_id)
        if(!user_subscription) throw new NotFoundException("User subscription not found")
        
        const plan = await this.subscription_planModel.findOne({where:{subscription_plan_id:user_subscription.dataValues.plan_id}})
        if(!plan) throw new NotFoundException("Subscription plan not found")
        
        if(plan.dataValues.price > payload.amount){
            throw new BadRequestException(`Insufficient amount: expected at least ${plan.dataValues.price}`);
        }

        const newPayment = await this.paymentModel.create({
            ...payload
        })
        return responseMessage("Payment successfully completed", newPayment)
    }

    async updatePayment(payment_id: string, payload: UpdatePaymentDto) {
        const payment = await this.paymentModel.findByPk(payment_id);
        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        await payment.update({ ...payload });

        return responseMessage('Payment successfully updated', payment);
    }

    async updateSubscription(subscription_id:string,payload:CreateUserSubscriptionDto){
        const subscription = await this.userSubscriptionModel.findByPk(subscription_id)
        if(!subscription) throw new NotFoundException("Subscription not found")
        
        const plan = await this.subscription_planModel.findByPk(payload.plan_id)
        if(!plan){
            throw new NotFoundException("Plan not found")
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + plan.duration_days);

        const newSub = await this.userSubscriptionModel.create({
            ...payload,
            start_date: startDate,
            end_date: endDate,
        });

        return responseMessage('Subscription successfully updated', newSub);
    }

    async deletePayment(payment_id:string){
        const payment = await this.paymentModel.findByPk(payment_id);
        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        await payment.destroy()
        return responseMessage("Payment successfully deleted")
    }

    async deleteSubscription(subscription_id:string){
        const subscription = await this.userSubscriptionModel.findByPk(subscription_id)
        if(!subscription) throw new NotFoundException("Subscription not found")
        
        await subscription.destroy()
        return responseMessage("Subscription successfully deleted")
    }
}
