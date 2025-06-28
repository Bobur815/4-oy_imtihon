// src/modules/auth/auth.module.ts
import { Module }          from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PassportModule }  from '@nestjs/passport';
import { JwtModule }       from '@nestjs/jwt';

import { AuthController }  from './auth.controller';
import { AuthService }     from './auth.service';
import { User }            from 'src/core/entities/users.entity';
import { JwtAccessToken }  from 'src/common/utils/jwt.sign';
import { MailerModule }    from 'src/common/mailer/mailer.module';
import { RedisModule }     from 'src/common/redis/redis.module';
import { UsersModule }     from '../users/users.module';
import { JwtStrategy }     from 'src/common/utils/jwt.strategy';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    MailerModule,
    RedisModule,
    UsersModule,

    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(JwtAccessToken),  
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,  
  ],
  exports: [
    AuthService,
    PassportModule, 
  ],
})
export class AuthModule {}
