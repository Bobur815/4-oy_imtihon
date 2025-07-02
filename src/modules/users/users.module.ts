import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/core/entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Profile } from 'src/core/entities/profiles.entity';

@Module({
    imports:[
        SequelizeModule.forFeature([User,Profile])
    ],
    controllers:[UsersController],
    providers:[UsersService],
    exports:[UsersService,SequelizeModule]
})
export class UsersModule {}
