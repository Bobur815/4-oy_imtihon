import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieDto, UpdateMovieDto } from './dto/dto';
import { RequestWithUser } from '../profiles/profiles.controller';
import { MovieFileUpload, PosterUpload } from 'src/common/utils/filename.upload';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/core/types/userRole.type';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CreateMovieFileDto, UpdateMovieFileDto } from './dto/movie.file.dto';

@ApiBearerAuth()
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

    
    @Post()
    @ApiOperation({
        summary:`${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`
    })
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN,UserRole.SUPER_ADMIN)
    @UseInterceptors(PosterUpload())
    createMovie(
        @Request() req: RequestWithUser, 
        @Body() body:any, 
        @UploadedFile() file: Express.Multer.File
    ){
        const payload:MovieDto = {
            ...body,
            release_year: parseInt(body.release_year),
            duration_minutes: parseInt(body.duration_minutes),
        }
        
        return this.moviesService.createMovie(req.user.id, payload, file.filename)
    }

    @Post('movie-file/:movie_id')
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @UseInterceptors(MovieFileUpload())
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN} can upload a video file for a movie`,
    })
    @ApiParam({ name: 'movie_id', type: 'string', description: 'UUID of the movie' })
    @ApiBody({
        description: 'Movie file upload data',
        type: CreateMovieFileDto,
    })
    uploadMovieFile(
        @Param('movie_id') movie_id: string,
        @Body() payload: CreateMovieFileDto,
        @UploadedFile() movie_file: Express.Multer.File,
    ) {
        return this.moviesService.uploadMovieFile(movie_id, payload, movie_file?.filename,);
    }

    @Put('movie-file/:movie_id')
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @UseInterceptors(MovieFileUpload())
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN} can update a video file for a movie`,
    })
    @ApiParam({ name: 'movie_id', type: 'string', description: 'UUID of the movie' })
    @ApiBody({
        description: 'Movie file update data',
        type: UpdateMovieFileDto,
    })
    updateMovieFile(
        @Param('movie_id') movie_id: string,
        @Body() payload: UpdateMovieFileDto,
        @UploadedFile() movie_file: Express.Multer.File,
    ) {
        return this.moviesService.updateMovieFile(movie_id, payload, movie_file?.filename,);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @UseInterceptors(PosterUpload())
    @ApiOperation({ summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}` })
    updateMovie(
        @Param('id') id: string,
        @Body() payload: UpdateMovieDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.moviesService.updateMovie(id, payload, file?.filename);
    }

    @ApiOperation({ summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}` })
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Delete(':id')
    deleteMovie(@Param('id') id:string){
        return this.moviesService.deleteMovie(id)
    }
}
