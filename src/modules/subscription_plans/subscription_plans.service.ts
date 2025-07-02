import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { responseMessage } from 'src/common/utils/response-message';
import { Subscription_plan } from 'src/core/entities/subscription_plans';
import { CreateSubscriptionPlanDto, UpdateSubscriptionPlanDto } from './dto/dto';

@Injectable()
export class SubscriptionPlansService {
    constructor(
        @InjectModel(Subscription_plan)
        private readonly subscription_planModel:typeof Subscription_plan
    ){}

    async getAll(){
        const plans = await this.subscription_planModel.findAll()
        return responseMessage(undefined,plans)
    }

    async createPlan(payloads: CreateSubscriptionPlanDto[]) {
    const existingPlans = await this.subscription_planModel.findAll({
        where: {
            name: payloads.map(p => p.name),
        },
        attributes: ['name'],
        raw: true,
    });

    const existingNames = new Set(existingPlans.map(p => p.name));

    // Duplikatlar bor-yo'qligini tekshirish:
    const duplicates = payloads.filter(p => existingNames.has(p.name));
    if (duplicates.length > 0) {
        const names = duplicates.map(d => d.name).join(', ');
        throw new ConflictException(`Plans with the following names already exist: ${names}`);
    }

    const newPlans = await this.subscription_planModel.bulkCreate(payloads as Partial<Subscription_plan>[]);

    return responseMessage('Subscription plans successfully created', newPlans);
    }


    async updatePlan(subscription_plan_id:string, payload:UpdateSubscriptionPlanDto){
        const isExists = await this.subscription_planModel.findByPk(subscription_plan_id)
        if(!isExists) throw new NotFoundException("Plan not found")

        const updatedPlan = await this.subscription_planModel.update(payload,{where:{subscription_plan_id},returning:true})
        return responseMessage("subscription_plan successfully updated",updatedPlan)
    }

    async deletePlan(subscription_plan_id:string){
        const subscription_plan = await this.subscription_planModel.findByPk(subscription_plan_id)
        if(!subscription_plan) throw new NotFoundException("Plan not found")

        await subscription_plan.destroy()
        return responseMessage('subscription_plan successfully deleted')
    }
}
