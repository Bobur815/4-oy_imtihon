import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from 'src/core/types/userRole.type';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/core/decorators/roles.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(UserRole.ADMIN,UserRole.SUPER_ADMIN)
    @Get('all')
    getAll(){
        return this.userService.getAllUsers()
    }

    @Get(':id')
    getOne(@Param('id') id:string){
        return this.userService.getSingleUser(id)
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary:UserRole.SUPER_ADMIN
    })
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Put('role/:id')
    changeRole(@Param('id') id:string, @Body() payload:UserRole){
        return this.userService.changeRole(id,payload)
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary:`${UserRole.ADMIN},${UserRole.SUPER_ADMIN}`
    })
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(UserRole.ADMIN,UserRole.SUPER_ADMIN)
    @Delete(':id')
    deleteUser(@Param('id') id: string){
        return this.userService.deleteById(id)
    }
}
