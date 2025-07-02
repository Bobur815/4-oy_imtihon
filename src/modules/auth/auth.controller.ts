import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { RequestNewPassword, ResetPasswordDto, VerificationDto } from './dto/verification.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  register(@Body() payload: AuthDto) {
    return this.authService.register(payload);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify user with OTP code' })
  @ApiBody({ type: VerificationDto })
  @ApiResponse({ status: 200, description: 'User verified' })
  verify(@Body() payload: VerificationDto) {
    return this.authService.verify(payload);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and return access/refresh tokens' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Access token refreshed' })
  refreshToken(@Body() token: RefreshTokenDto) {
    return this.authService.refreshToken(token);
  }

  @Post('new-password')
  @ApiOperation({ summary: 'Request password reset (sends code to email)' })
  @ApiBody({ type: RequestNewPassword })
  @ApiResponse({ status: 200, description: 'Password reset code sent' })
  requestNewPassword(@Body() payload: RequestNewPassword) {
    return this.authService.requestNewPassword(payload);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using verification code' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  resetPassword(@Body() payload: ResetPasswordDto) {
    return this.authService.resetPassword(payload);
  }
}
