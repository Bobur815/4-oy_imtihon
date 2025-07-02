import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MovieCategoriesService } from './movie-categories.service';
import { MovieCategoryDto } from './dto/dto';

@Controller('movie-categories')
export class MovieCategoriesController {
    constructor(private readonly moviesCategoryService: MovieCategoriesService){}

    @Get()
    getAll(){
        return this.moviesCategoryService.getAll()   
    }

    @Post()
    create(@Body() payload:MovieCategoryDto){
        return this.moviesCategoryService.create(payload)
    }

    @Put(':id')
    update(@Param('id') id:string, @Body() payload: MovieCategoryDto){
        return this.moviesCategoryService.update(id,payload)
    }

    @Delete(':id')
    delete(@Param('id') id:string){
        return this.moviesCategoryService.delete(id)
    }
}
