import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService} from "@nestjs-modules/mailer"
import { UserDto } from 'src/modules/users/dto/user.dto';
import { AuthDto } from 'src/modules/auth/dto/register.dto';

@Injectable()
export class AppMailerService {
    constructor(private readonly mailerService: NestMailerService){}

    async sendVerificationCode(to: string, user: AuthDto, code: number) {
        return this.mailerService.sendMail({
          to,
          subject: 'Verify your email',
          template: 'index',
          context: { 
            username: user.username,
            code,
            expiresIn: 15,
            year: new Date().getFullYear(),
            },
        });
    }

    async sendPasswordResetCode(email: string, code: number) {
        return this.mailerService.sendMail({
          to: email,
          subject: 'Your Password Reset Code',
          template: 'reset-password', 
          context: {
            code,
            expiresIn: 15,             
            year: new Date().getFullYear()
          },
        });
      }
}
