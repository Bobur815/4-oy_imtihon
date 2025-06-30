import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { responseMessage } from 'src/common/utils/response-message';
import { Profile } from 'src/core/entities/profiles.entity';
import { User } from 'src/core/entities/users.entity';
import { UserRole } from 'src/core/types/userRole.type';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User,
        @InjectModel(Profile)
        private readonly profileModel: typeof Profile
        ){}

    async getAllUsers(){
        const users = await this.userModel.findAll({
            attributes: {exclude: ['password']},
            include: [
                {
                    model:Profile,
                    as:'profile'
                }
            ]
        })

        return responseMessage(undefined, users)
    }

    async getSingleUser(id:string){
        return await this.userModel.findByPk(id)
    }

    async changeRole(id:string, data:UserRole){
        let user = await this.userModel.findByPk(id)
        if(!user){
            throw new NotFoundException("User not found")
        }
        
        user['role'] = data['role']
        await user.save()
        
        return {
            success: true,
            message:'Role has been successfully changed',
            data: user
        }
    }

    async deleteById(id:string){
        let user = await this.userModel.findByPk(id)
        if(!user){
            throw new NotFoundException("User not found")
        }

        await user.destroy()
        return {
            success:true,
            message:'User successfully deleted'
        }
    }
}
