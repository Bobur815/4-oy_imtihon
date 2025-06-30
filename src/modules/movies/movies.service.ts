import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { responseMessage } from 'src/common/utils/response-message';
import { Movie } from 'src/core/entities/movies.entity';
import { MovieDto, UpdateMovieDto } from './dto/dto';
import path from 'path';
import fs from 'fs'
import { Category } from 'src/core/entities/category.entity';

@Injectable()
export class MoviesService {
    constructor(
        @InjectModel(Movie)
        private readonly moviesModel: typeof Movie,
    ){}

    async getAll(){
        const movies = await this.moviesModel.findAll({
            include:[Category]
        })
        return responseMessage(undefined,movies)
    }

    async getSingle(id:string){
        const movie = await this.moviesModel.findByPk(id,{
            include:[Category]
        })
        return responseMessage(undefined,movie)
    }

    async createMovie(id:string, payload:MovieDto, filename:string){
        const slugExist = await this.moviesModel.findOne({where: {slug: payload.slug}})
        if(slugExist){
            throw new ConflictException("Movie with this slug name already exists")
        }

        const moviePayload = {
            ...payload,
            created_by:id,
            poster_url:filename,
        }
        const newMovie = await this.moviesModel.create(moviePayload)
        
        return responseMessage("New movie successfully created",newMovie)
    }

    async updateMovie(movie_id:string, payload:UpdateMovieDto, filename:string){
        const updatingMovie = await this.moviesModel.findByPk(movie_id)
        if(!updatingMovie){
            throw new NotFoundException("Movie not found")
        }
        
        if(payload && payload.slug){
            const slugExist = await this.moviesModel.findOne({where: {slug: payload.slug}})
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

        await this.moviesModel.update(payload,{where:{id:movie_id}})
        const updatedMovie = await this.moviesModel.findByPk(movie_id)

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
