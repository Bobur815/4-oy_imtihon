import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { responseMessage } from 'src/common/utils/response-message';
import { Favorite } from 'src/core/entities/favourite.entity';
import { FavoriteDto } from './dto/dto';
import { Movie } from 'src/core/entities/movies.entity';
import { User } from 'src/core/entities/users.entity';

@Injectable()
export class FavoriteService {
    constructor(
        @InjectModel(Favorite)
        private readonly favoriteModel:typeof Favorite,
        @InjectModel(Movie)
        private readonly movieModel:typeof Movie,
        @InjectModel(User)
        private readonly userModel:typeof User
    ){}

    async getAll(){
        const favorites = await this.favoriteModel.findAll()
        return responseMessage(undefined,favorites)
    }

    async getByUserId(user_id:string){
        const usersFavorites = await this.favoriteModel.findAll({where:{user_id}})
        return responseMessage(undefined,usersFavorites)
    }

    async getByMovieId(movie_id:string){
        const favoritesMovies = await this.favoriteModel.findAll({where:{movie_id}})
        return responseMessage(undefined,favoritesMovies)
    }

    async create(user_id:string,payload:FavoriteDto){
        const movie = await this.movieModel.findByPk(payload.movie_id)
        if(!movie){
            throw new NotFoundException("Movie not found")
        }

        let user = await this.userModel.findByPk(user_id)
        if(!user){
            throw new NotFoundException("User not found")
        }

        const newFavorite = await this.favoriteModel.create({user_id,movie_id:payload.movie_id})
        return responseMessage("Favorite successfully added",newFavorite)
    }

    async delete(favorite_id:string){
        const favorite = await this.favoriteModel.findByPk(favorite_id)
        if(!favorite) throw new NotFoundException('Favorite not found')

        await favorite.destroy()
        return responseMessage('Favorite successfully deleted')
    }
}
