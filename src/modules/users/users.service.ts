import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/core/entities/users.entity';
import { UserDto } from './dto/user.dto';

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
}
