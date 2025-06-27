import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/core/entities/users.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessToken } from 'src/common/utils/jwt.sign';
import { MailerModule } from 'src/common/mailer/mailer.module';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports:[
    SequelizeModule.forFeature([User]),
    MailerModule,
    JwtModule.register(JwtAccessToken),
    RedisModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
