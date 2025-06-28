import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/core/entities/users.entity';
import { Profile } from 'src/core/entities/profiles.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports:[
    SequelizeModule.forFeature([User,Profile]),
    MulterModule.register({
      dest:'./common/uploads/avatars'
    })
  ],
  controllers:[ProfilesController],
  providers: [ProfilesService]
})
export class ProfilesModule {}
