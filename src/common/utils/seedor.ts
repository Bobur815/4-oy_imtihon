import { Logger, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "src/core/entities/users.entity";
import { UserRole } from "src/core/types/userRole.type";
import * as bcrypt from 'bcryptjs';
import { ConfigService } from "@nestjs/config";

export class SuperAdminSeeder implements OnModuleInit{
    private readonly logger = new Logger(SuperAdminSeeder.name)

    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User,
        private readonly configService:ConfigService
    ){}

    async onModuleInit() {

        const email = this.configService.get<string>('SUPER_ADMIN_EMAIL');
        const username = this.configService.get<string>('SUPER_ADMIN_USERNAME');
        const password = this.configService.get<string>('SUPER_ADMIN_PASSWORD');
        const fullName = this.configService.get<string>('SUPER_ADMIN_FULL_NAME');

        const existingAdmin = await this.userModel.findOne({
            where:{role:UserRole.SUPER_ADMIN}
        })

        if(!existingAdmin){
            const hashedPassword = await bcrypt.hash(password!,10)
            await this.userModel.create({
                username,
                email,
                password:hashedPassword,
                role:UserRole.SUPER_ADMIN,
                full_name:fullName
            })
            this.logger.log('✅ Super Admin created');
        } else {
            this.logger.log('ℹ️ Super Admin already exists');
        }
    }
}