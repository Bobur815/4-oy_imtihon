import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { RequestNewPassword, ResetPasswordDto, VerificationDto } from './dto/verification.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    
    @Post('register')
    register(@Body() payload: AuthDto){
        return this.authService.register(payload) 
    }

    @Post('verify')
    verify(@Body() payload: VerificationDto){
        return this.authService.verify(payload)
    }

    @Post('login')
    login(@Body() payload: LoginDto){
        return this.authService.login(payload)
    }

    @Post('refresh-token')
    refreshToken(@Body() token: RefreshTokenDto){
        return this.authService.refreshToken(token)
    }

    @Post('new-password')
    requestNewPassword(@Body() payload: RequestNewPassword){
        return this.authService.requestNewPassword(payload)
    }

    @Post('reset-password')
    resetPassword(@Body() payload: ResetPasswordDto) {
        return this.authService.resetPassword(payload);
    }
}
