    import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
    import { User } from 'src/core/entities/users.entity';
    import { AuthDto } from './dto/register.dto';
    import { Op } from 'sequelize';
    import { InjectModel } from '@nestjs/sequelize';
    import { AppMailerService } from 'src/common/mailer/mailer.service';
    import * as bcrypt from "bcrypt"
    import { JwtService } from '@nestjs/jwt';
    import { JwtAccessToken, JwtRefreshToken } from 'src/common/utils/jwt.sign';
    import { RedisService } from 'src/common/redis/redis.service';
    import { RequestNewPassword, ResetPasswordDto, VerificationDto } from './dto/verification.dto';
    import { LoginDto } from './dto/login.dto';

    interface JwtPayload {
        id:number,
        role:string
    }

    @Injectable()
    export class AuthService {
        constructor(
            @InjectModel(User) 
            private readonly userModel: typeof User,
            private readonly mailService: AppMailerService,
            private readonly jwtService: JwtService,
            private readonly redisService: RedisService
        ){}

        private async generateToken(payload: JwtPayload, accessTokenOnly=false){
            
            const accessToken = await this.jwtService.signAsync({id: payload.id, role: payload.role},JwtAccessToken)
            
            if(accessTokenOnly){
                return {
                    accessToken
                }
            }
            const refreshToken = await this.jwtService.signAsync({id: payload.id, role: payload.role},JwtRefreshToken)
            return {
                accessToken,
                refreshToken
            }

        }
        async register(payload: AuthDto){
            
            let existing = await this.userModel.findOne({
                where: {
                    [Op.or]:[{username: payload.username}]
                    // ,{email: payload.email} <- oxirida qo'shib qo'y
            }}
            )
            if(existing){
                throw new ConflictException("Username or email already exists")
            } 

            const verificationCode = Math.floor(100000 + Math.random() * 900000)

            await this.mailService.sendVerificationCode(payload.email,payload,verificationCode)

            await this.redisService.set(`register:${payload.email}`, JSON.stringify({...payload,verificationCode}), 900)

            return {
                message:`Verification code sent to ${payload.email}`
            }
        }

        async verify(payload: VerificationDto){
            let stored = await this.redisService.get(`register:${payload.email}`)
        
            if(!stored){
                throw new BadRequestException('Verification code expired or not found')
            }
            let userData = JSON.parse(stored)
            
            
            if(userData.verificationCode !== payload.code){
                throw new BadRequestException("Verification code invalid")
            }

            await this.redisService.del(`register:${payload.email}`)
            delete userData.verificationCode

            const password_hash = await bcrypt.hash(userData.password,10)
            let newUser = await this.userModel.create({...userData,password:password_hash})

            let tokens = await this.generateToken({id:newUser.dataValues.id, role:newUser.dataValues.role})
            return {
                success: true,
                message: 'Registiration successfull ',
                tokens
            }
        }

        async login(payload: LoginDto){
            let existingUser = await this.userModel.findOne({
                where: {username: payload.username}
            })
            
            if (!existingUser) {
                throw new UnauthorizedException('Username invalid');
            }

            const isMatch = await bcrypt.compare(
                payload.password,             
                existingUser?.dataValues.password           
            );

            if (!isMatch) {
                throw new UnauthorizedException('Password invalid');
            }

            return  await this.generateToken({id:existingUser.dataValues.id, role:existingUser.dataValues.role})
        }

        async refreshToken({token}: {token:string}){
            try {
                let payload = await this.jwtService.verifyAsync(token)
                if(!payload?.id){
                    throw new UnauthorizedException()
                }
                return this.generateToken({id:payload.id,role:payload.role})
            } catch (error) {
                throw new UnauthorizedException('Refresh token invalid or expired');
            }
        }

        async requestNewPassword(payload: RequestNewPassword){
            const user = await this.userModel.findOne({where: {email:payload.email}})
            
            if(!user){
                throw new NotFoundException("No user found")
            }
            
            const verificationCode = Math.floor(100000 + Math.random() * 900000)
            
            
            await this.redisService.set(`reset:${payload.email}`,verificationCode.toString(), 900)
            
            await this.mailService.sendPasswordResetCode(payload.email,verificationCode)
            
            return { message: `Reset code sent to ${payload.email}` };
        }

        async resetPassword(payload: ResetPasswordDto){
            const storedCode = await this.redisService.get(`reset:${payload.email}`);
            if (!storedCode) {
                throw new BadRequestException('Reset code expired or not found');
            }
            console.log(storedCode, payload.code);
            
            if (storedCode != payload.code) {
                throw new BadRequestException('Invalid reset code');
            }

            await this.redisService.del(`reset:${payload.email}`)

            const password_hash = await bcrypt.hash(payload.newPassword,10)
            await this.userModel.update({password:password_hash},{where: {email:payload.email}})

            return { message: 'Password has been reset successfully' };
        }
    }
