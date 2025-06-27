import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsNumberString, MinLength } from "class-validator"

export class VerificationDto{
    @ApiProperty({ example: 'bobur@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({ example: '123456', description: '6-digit reset code' })
    @IsNotEmpty()
    @IsNumber()
    code: number
}

export class RequestNewPassword{
    @ApiProperty({ example: 'bobur@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email:string
}

export class ResetPasswordDto {
    @ApiProperty({ example: 'bobur@example.com' })
    @IsEmail()
    readonly email: string;
  
    @ApiProperty({ example: '123456', description: '6-digit reset code' })
    @IsNumberString()
    code: string;
  
    @ApiProperty({ minLength: 6 })
    @MinLength(6)
    newPassword: string;
  }