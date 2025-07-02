import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
import { Op } from 'sequelize';
import { User_subscriptions } from 'src/core/entities/User_subscriptions';

@Injectable()
export class MoviesService {
    constructor(
        @InjectModel(Movie)
        private readonly moviesModel: typeof Movie,
        @InjectModel(MovieFile)
        private readonly movieFileModel: typeof MovieFile,
         @InjectModel(User_subscriptions)
        private readonly user_subscriptionsModel: typeof User_subscriptions
    ){}

    async getAll(user_id:string, query: {page?: number;limit?: number;category?: string;search?: string;subscription_type?: string;}) {
        const {
            page = 1,
            limit = 10,
            category,
            search,
            subscription_type,
        } = query;

        const offset = (page - 1) * limit;
        const where: any = {};

        if (search) {
            where.title = { [Op.iLike]: `%${search}%` };
        }

        if (subscription_type) {
            where.subscription_type = subscription_type;
        }

        const include: any = [
            {
                model: Category,
                attributes: ['name'],
                through: { attributes: [] },
                ...(category && {
                    where: { name: { [Op.iLike]: `%${category}%` } }
            }),
            },
            {
                model: this.movieFileModel,
                attributes: ['quality', 'language'],
            },
        ];

        const { count, rows } = await this.moviesModel.findAndCountAll({
            where,
            include,
            limit: Number(limit),
            offset: Number(offset),
            distinct: true,
        });

        const userSubscription = await this.user_subscriptionsModel.findOne({
            where: {
            user_id,
            status: 'active',
            },
        });

        const movies = rows.map(movie => {
            const hasAccess =
            movie.subscription_type === 'free' || !!userSubscription;

            return {
                id: movie.id,
                title: movie.title,
                slug: movie.slug,
                poster_url: movie.poster_url,
                release_year: movie.release_year,
                rating: movie.rating,
                subscription_type: movie.subscription_type,
                categories: movie.categories.map(cat => cat.name),
                files: hasAccess ? movie.movie_files : [],
            };
        });

        const pagination = {
            total: count,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(count / limit),
        };

        return responseMessage(undefined, { movies, pagination });
    }


    async getSingle(user_id:string, slug:string){
        const movie = await this.moviesModel.findOne({where:{slug},
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

        if (movie.subscription_type !== 'free') {
            const userSubscription = await this.user_subscriptionsModel.findOne({
            where: {
                user_id,
                status: 'active',
            },
            });

            if (userSubscription) {
                result.files = movie.movie_files
            }
        } else {
                result.files = movie.movie_files
        }


        if(result.files) {
                await this.getMovieFile(movie.id, movie.view_count)
        }
        return responseMessage(undefined,result)
    }

    async getMovieFile(movie_id:string,view_count:number){
        const movieFile = await this.movieFileModel.findOne({where:{movie_id}})
        if(movieFile){
            view_count+=1
            await this.moviesModel.update({view_count}, {where:{id:movie_id}})
        }
        return movieFile
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
