import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryDto} from './dto/categorydto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/roles.decorator';
import { UserRole } from 'src/core/types/userRole.type';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoryService:CategoriesService){}

    @Get()
    getAll(){
        return this.categoryService.getAll()
    }

    @Get(':id')
    getSingle(@Param('id') id:string){
        return this.categoryService.getSingle(id)
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary:`${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`
    })
    @UseGuards(JwtAuthGuard)
    @Post()
    createCategory(@Body() payload:CategoryDto){
        return this.categoryService.createCategory(payload)
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary:`${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`
    })
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN,UserRole.SUPER_ADMIN)
    @Put(':id')
    updateCategory(@Param('id') id: string, @Body() payload:CategoryDto){
        return this.categoryService.updateCategory(id,payload)
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary:`${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`
    })
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN,UserRole.SUPER_ADMIN)
    @Delete(':id')
    deleteCategory(@Param('id') id:string){
        return this.categoryService.deleteCategory(id)
    }

}
