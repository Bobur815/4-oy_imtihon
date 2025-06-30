import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/core/entities/users.entity';
import { ProfileDto } from './dto/profiledto';
import { Profile } from 'src/core/entities/profiles.entity';
import * as fs from 'fs';
import * as path from 'path';
import { responseMessage } from 'src/common/utils/response-message';

@Injectable()
export class ProfilesService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User,

        @InjectModel(Profile)
        private readonly profileModel: typeof Profile
    ){}

    async getAll(){
        const profiles = await this.profileModel.findAll()
        return responseMessage(undefined,profiles)
    }

    async getSingle(id:string){
        const profile = await this.profileModel.findByPk(id)
        if(!profile) throw new NotFoundException("Profile not found")
        return responseMessage(undefined, profile)
    }

    async create(userId:string, payload: ProfileDto, filename:string){
        const user = await this.userModel.findByPk(userId);
        if (!user) throw new NotFoundException('User not found');

        if(filename){
            payload['avatar_url']=filename
        }
        const exists = await this.profileModel.findOne({ where: { user_id: userId }});
        if (exists) {
            return await this.update(userId,payload,filename)
        };

        const newProfile = await this.profileModel.create({
            user_id: userId,
            ...payload,
          });

        return {
            success:true,
            message:'Profile created successfully',
            newProfile
        }
    }

    async update(userId:string,payload:ProfileDto,filename:string){
        // Agar avatar ham o'zgartirilayotgan bo'lsa:
        if(filename){

            // Eski avatar fileni topib o'chirib yuborish:
            let updatingProfile = await this.profileModel.findOne({
                where: {user_id: userId}
            })

            if (!updatingProfile) {
                throw new NotFoundException('Profile not found');
            }

            const oldFile = updatingProfile.avatar_url;

            if (oldFile) {
                const fullPath = path.resolve('src', 'common', 'uploads', 'avatars', oldFile);

                if (fs.existsSync(fullPath)) {
                    try {
                        fs.unlinkSync(fullPath);
                    } catch (error) {
                        console.log('Failed to delete:', error.message);
                    }

                } else {
                    console.log('File does not exist at:', fullPath);
                }
            }

            // Yangi avatar fayl nomini payload ga qo'shish:
            payload['avatar_url']=filename
        }
        
        const [affected] = await this.profileModel.update(payload, {
            where: { user_id: userId },
          });

        if (!affected) throw new NotFoundException('Profile not found');

        const updatedProfile = await this.profileModel.findOne({
            where: { user_id: userId },
        });

        return {
            success:true,
            message:"Profile updated successfully",
            data:updatedProfile
        }
    }

    async deleteProfile(user_id:string){
        const profile = await this.profileModel.findOne({
            where: {user_id}
        })
        if(!profile) throw new NotFoundException('Profile not found')
        
        await profile.destroy()

        return responseMessage('Profile successfully deleted')
        
        
    }
}
