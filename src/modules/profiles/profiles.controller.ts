import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfileDto } from './dto/profiledto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AvatarUpload } from 'src/common/utils/filename.upload';
import { Request as ExpRequest } from 'express';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/core/types/userRole.type';
import { Roles } from 'src/core/decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

export interface RequestWithUser extends ExpRequest {
    user: { id: string; username: string; role: string };
}

@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
    constructor(private readonly profileService: ProfilesService){}

    @ApiBearerAuth()
    @ApiOperation({
        summary:`${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`
    })
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(UserRole.ADMIN,UserRole.SUPER_ADMIN)
    @Get('all')
    getAllProfiles(){
        return this.profileService.getAll()
    }

    @Get('single')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    getSingle(@Request() req: RequestWithUser){
        return this.profileService.getSingle(req.user.id)
    }

    @Post('create')
    @UseInterceptors(AvatarUpload())
    createProfile(@Request() req: RequestWithUser, @Body() payload:ProfileDto, @UploadedFile() file: Express.Multer.File){
        return this.profileService.create(req.user.id,payload,file.filename)
    }

    @Patch('update')
    @UseInterceptors(AvatarUpload())
    updateProfile(
        @Request() req: RequestWithUser, 
        @Body() payload: ProfileDto, 
        @UploadedFile() file: Express.Multer.File
    ){
        return this.profileService.update(req.user.id,payload,file.filename)
    }

    @Delete()
    @ApiBearerAuth()
    @ApiOperation({
        summary:`${UserRole.USER},${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`
    })
    @UseGuards(JwtAuthGuard)
    deleteProfile(@Request() req: RequestWithUser){
        return this.profileService.deleteProfile(req.user.id)
    }

}
