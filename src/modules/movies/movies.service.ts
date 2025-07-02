import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { responseMessage } from 'src/common/utils/response-message';
import { Movie } from 'src/core/entities/movies.entity';
import { MovieDto, UpdateMovieDto } from './dto/dto';
import path from 'path';
import fs from 'fs'
import { Category } from 'src/core/entities/category.entity';
import { CreateMovieFileDto, UpdateMovieFileDto } from './dto/movie.file.dto';
import { MovieFile } from 'src/core/entities/movie.files';
import { slugGenerator } from 'src/common/utils/slug.generator';

@Injectable()
export class MoviesService {
    constructor(
        @InjectModel(Movie)
        private readonly moviesModel: typeof Movie,
        @InjectModel(MovieFile)
        private readonly movieFileModel: typeof MovieFile
    ){}

    async getAll(){
        const movies = await this.moviesModel.findAll({
            include: [
                {
                    model: Category,
                    attributes: ['name'],
                    through: { attributes: [] },
                },
            ],
        });
        const result = movies.map(movie => ({
            ...movie.get(),
            categories: movie.categories.map(cat => cat.name),
        }));
        return responseMessage(undefined,result)
    }

    async getSingle(id:string){
        const movie = await this.moviesModel.findByPk(id, {
            include: [
                {
                    model: Category,
                    attributes: ['name'],
                    through: { attributes: [] },
                },
            ],
        });
        if (!movie) throw new NotFoundException('Movie not found');

        const result = {
            ...movie.get(),
            categories: movie.categories.map(cat => cat.name),
        };
        return responseMessage(undefined,result)
    }

    async createMovie(id:string, payload:MovieDto, filename:string){
        const slug = slugGenerator(payload.title)
        const slugExist = await this.moviesModel.findOne({where: {slug}})
        if(slugExist){
            throw new ConflictException("Movie with this slug name already exists")
        }

        const moviePayload = {
            ...payload,
            slug,
            created_by:id,
            poster_url:filename,
        }
        const newMovie = await this.moviesModel.create(moviePayload)
        
        return responseMessage("New movie successfully created",newMovie)
    }

    async uploadMovieFile(movie_id:string, payload:CreateMovieFileDto,movie_file:string){
        const currentMovie = await this.moviesModel.findByPk(movie_id)
        if(!currentMovie){
            throw new NotFoundException("Movie not found")
        }

        const movieFileExist = await this.movieFileModel.findOne({where: {movie_id}})
        if(movieFileExist && movieFileExist.file_url){
            throw new ConflictException("Movie file already exists")
        }

        if(movie_file){
            payload.file_url=movie_file
        }

        const newMovieFile = await this.movieFileModel.create({
            ...payload,
            movie_id
        })
        return responseMessage("New movie file successfully added", newMovieFile)
    }

    async updateMovieFile(movie_id:string, payload:UpdateMovieFileDto, movie_file:string,){
        const currentMovie = await this.movieFileModel.findByPk(movie_id)
        if(!currentMovie){
            throw new NotFoundException("Movie not found")
        }

        if(movie_file){
            const oldFile = currentMovie.file_url
            if(oldFile){
                const fullPath = path.resolve('src', 'common', 'uploads', 'movieFiles', oldFile);
                if(fs.existsSync(fullPath)){
                    try {
                        fs.unlinkSync(fullPath)
                    } catch (error) {
                        console.log('Failed to delete:', error.message);
                    }
                }
            }

            payload.file_url=movie_file
        }

        const updateMovieFile = await this.movieFileModel.update(payload,{where: {movie_id},returning:true})
        return responseMessage("Movie file updated successfully",updateMovieFile)

    }

    async updateMovie(movie_id:string, payload:UpdateMovieDto, filename:string){
        const updatingMovie = await this.moviesModel.findByPk(movie_id)
        if(!updatingMovie){
            throw new NotFoundException("Movie not found")
        }
        
        if(payload && payload.title){
            const slug = slugGenerator(payload.title)
            const slugExist = await this.moviesModel.findOne({where: {slug}})
            if(slugExist){
                throw new ConflictException("Movie with this slug name already exists")
            }
        }
        
        if(filename){
            // Eski poster fileni topib o'chirib yuborish:
            const oldFile = updatingMovie.poster_url;
            if (oldFile) {
                const fullPath = path.resolve('src', 'common', 'uploads', 'posters', oldFile);

                if(fs.existsSync(fullPath)){
                    try {
                        fs.unlinkSync(fullPath);
                    } catch (error) {
                        console.log('Failed to delete:', error.message);
                    }
                }
            }
            // Yangi poster fayl nomini payload ga qo'shish:
            payload['poster_url']=filename
        }
        
        const updatedMovie = await this.moviesModel.update(payload,{where:{id:movie_id},returning:true})

        return responseMessage("Movie successfully updated",updatedMovie)
    }

    async deleteMovie(id:string){
        const movie = await this.moviesModel.findOne({
            where: {id}
        })
        if(!movie) throw new NotFoundException('Movie not found')
        
        await movie.destroy()
        return responseMessage("Movie successfully deleted")
    }
}
