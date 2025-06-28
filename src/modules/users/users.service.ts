import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/core/entities/users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User
        ){}

    async getAllUsers(){
        return await this.userModel.findAll({
            attributes: {exclude: ['password']}
        })
    }

    async getSingleUser(id:string){
        return await this.userModel.findByPk(id)
    }

    
    async deleteById(id:string){
        let user = await this.userModel.findByPk(id)
        if(!user){
            throw new NotFoundException("User not found")
        }

        await user.destroy()
        return 'User successfully deleted'
    }
}
