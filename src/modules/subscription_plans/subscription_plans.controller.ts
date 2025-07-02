import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SubscriptionPlansService } from './subscription_plans.service';
import { CreateSubscriptionPlanDto, UpdateSubscriptionPlanDto } from './dto/dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { UserRole } from 'src/core/types/userRole.type';
import { ApiBody } from '@nestjs/swagger';

@Controller('subscription-plans')
export class SubscriptionPlansController {
    constructor(private readonly subscriptionPlanService:SubscriptionPlansService){}

    @Get()
    getAll(){
        return this.subscriptionPlanService.getAll()
    }

    @ApiBody({ isArray: true, type: CreateSubscriptionPlanDto })
    @Post()
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.SUPER_ADMIN)
    createPlan(@Body() payload:CreateSubscriptionPlanDto[]){
        return this.subscriptionPlanService.createPlan(payload)
    }

    @Put(':subscription_plan_id')
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.SUPER_ADMIN)
    updatePlan(@Param('subscription_plan_id') subscription_plan_id:string, @Body() payload:UpdateSubscriptionPlanDto){
        return this.subscriptionPlanService.updatePlan(subscription_plan_id, payload)
    }

    @Delete(':subscription_plan_id')
    deletePlan(@Param('subscription_plan_id') subscription_plan_id:string){
        return this.subscriptionPlanService.deletePlan(subscription_plan_id)
    }
    
}
