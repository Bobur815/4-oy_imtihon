import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteDto } from './dto/dto';
import { RequestWithUser } from '../profiles/profiles.controller';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('favorite')
export class FavoriteController {
    constructor(private readonly favoriteService:FavoriteService){}

    @Get()
    getAll(){
        return this.favoriteService.getAll()
    }

    @Get(":user_id")
    getByUserId(@Param("user_id") user_id:string){
        return this.favoriteService.getByUserId(user_id)
    }

    @Get(":movie_id")
    getByMovieId(@Param("movie_id") movie_id:string){
        return this.favoriteService.getByMovieId(movie_id)
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    create(@Request() req:RequestWithUser, @Body() payload: FavoriteDto){
        return this.favoriteService.create(req.user.id, payload)
    }

    @Delete(':favorite_id')
    delete(@Param('favorite_id') favorite_id:string){
        return this.favoriteService.delete(favorite_id)
    }


}
