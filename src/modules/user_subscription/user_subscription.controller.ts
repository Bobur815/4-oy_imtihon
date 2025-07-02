import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { UserSubscriptionService } from './user_subscription.service';
import { RequestWithUser } from '../profiles/profiles.controller';
import { CreateUserSubscriptionDto } from './dto/dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payments.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('User Subscription and Payments')
@Controller('user-subscription')
export class UserSubscriptionController {
    constructor(private readonly userSubscriptionService:UserSubscriptionService){}

    @Get()
    getAll(){
        return this.userSubscriptionService.getAll()
    }

    @Get('user')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    getByUser(@Request() req:RequestWithUser){
        return this.userSubscriptionService.getByUser(req.user.id)
    }

    @Get('plan/:plan_id')
    getByplan(@Param('plan_id') plan_id:string){
        return this.userSubscriptionService.getByPlan(plan_id)
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    createSubscription(@Request() req:RequestWithUser,@Body() payload:CreateUserSubscriptionDto){
        return this.userSubscriptionService.createSubscription(req.user.id,payload)
    }

    @Post('payment')
    createPayment(@Body() payload:CreatePaymentDto){
            return this.userSubscriptionService.createPayment(payload)
    }

    @Put(':subscription_id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    updateSubscription(@Param('subscription_id') subscription_id:string, @Body() payload:CreateUserSubscriptionDto){
        return this.userSubscriptionService.updateSubscription(subscription_id,payload)
    }

    @Put('payment/:payment_id')
    updatePayment(@Param('payment_id') payment_id: string, @Body() payload: UpdatePaymentDto){
        return this.userSubscriptionService.updatePayment(payment_id,payload)
    }

    @Delete('payment/:payment_id')
    deletePayment(@Param('payment_id') payment_id:string){
        return this.userSubscriptionService.deletePayment(payment_id)
    }

    @Delete(':subscription_id')
    deleteSubscription(@Param('subscription_id') subscription_id: string){
        return this.userSubscriptionService.deleteSubscription(subscription_id)
    }
}
