import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieDto, UpdateMovieDto } from './dto/dto';
import { RequestWithUser } from '../profiles/profiles.controller';
import { PosterUpload } from 'src/common/utils/filename.upload';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/core/types/userRole.type';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService:MoviesService){}

    @Get()
    getAll(){
        return this.moviesService.getAll()
    }

    @Get(':id')
    getSingle(@Param('id') id:string){
        return this.moviesService.getSingle(id)
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary:`${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`
    })
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN,UserRole.SUPER_ADMIN)
    @Post()
    @UseInterceptors(PosterUpload())
    createMovie(
        @Request() req: RequestWithUser, 
        @Body() payload:MovieDto, 
        @UploadedFile() file: Express.Multer.File
    ){
        return this.moviesService.createMovie(req.user.id, payload, file.filename)
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @UseInterceptors(PosterUpload())
    @ApiBearerAuth()
    @ApiOperation({ summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}` })
    updateMovie(
        @Param('id') id: string,
        @Body() payload: UpdateMovieDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.moviesService.updateMovie(id, payload, file?.filename);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}` })
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Delete(':id')
    deleteMovie(@Param('id') id:string){
        return this.moviesService.deleteMovie(id)
    }
}
