import { Body, Controller, Get, Param, Patch, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfileDto } from './dto/profiledto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AvatarUpload } from 'src/common/utils/avatar.upload';
import { Request as ExpRequest } from 'express';

export interface RequestWithUser extends ExpRequest {
    user: { id: string; username: string; role: string };
}

@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
    constructor(private readonly profileService: ProfilesService){}

    @Get('all')
    getAllProfiles(){
        return this.profileService.getAll()
    }

    @Post('create')
    @UseInterceptors(AvatarUpload())
    createProfile(@Request() req: RequestWithUser, @Body() payload:ProfileDto, @UploadedFile() file: Express.Multer.File){
        return this.profileService.create(req.user.id,payload,file.filename)
    }

    @Patch('update')
    @UseInterceptors(AvatarUpload())
    updateProfile(@Request() req: RequestWithUser, @Body() payload: ProfileDto, @UploadedFile() file: Express.Multer.File){
        return this.profileService.update(req.user.id,payload,file.filename)
    }

}
