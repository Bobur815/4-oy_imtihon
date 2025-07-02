import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { responseMessage } from 'src/common/utils/response-message';
import { Review } from 'src/core/entities/review.entity';
import { CreateReviewDto } from './dto/dto';
import { Movie } from 'src/core/entities/movies.entity';
import { User } from 'src/core/entities/users.entity';

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(Review)
        private readonly reviewModel:typeof Review,
        @InjectModel(Movie)
        private readonly movieModel:typeof Movie,
        @InjectModel(User)
        private readonly userModel:typeof User,
    ){}

    async updateMovieRating(movie_id:string):Promise<void>{
        const total = await this.reviewModel.findAll({
            where:{movie_id},
            attributes: ['rating'],
            raw: true,  
        })
        let totalRating = total.reduce((acc,val) => val.rating + acc,0)
        let averageRating = totalRating/total.length;
        
        await this.movieModel.update({rating:averageRating},{
            where:{id:movie_id}
        })
    }

    async getAll(){
        const reviews = await this.reviewModel.findAll()
        return responseMessage(undefined,reviews)
    }

    async getByUser(user_id:string){
        const review = await this.reviewModel.findAll({where: {user_id}})
        return responseMessage(undefined,review)
    }

    async getByMovie(movie_id:string){
        const review = await this.reviewModel.findAll({where: {movie_id}})
        return responseMessage(undefined,review)
    }

    async createReview(user_id:string, payload:CreateReviewDto){
        const movie = await this.movieModel.findOne({
            where: {id:payload.movie_id}
        })
        if(!movie) throw new NotFoundException('Movie not found')

        const newReview = await this.reviewModel.create({
            user_id,
            ...payload
        })
        this.updateMovieRating(payload.movie_id)
        return responseMessage("Review successfully saved",newReview)
    }

    async updateReview(review_id:string, user_id:string, payload:CreateReviewDto){
        const review = await this.reviewModel.findByPk(review_id)
        if(!review) throw new NotFoundException('review not found')
        
        const movie = await this.movieModel.findOne({
            where: {id:payload.movie_id}
        })
        if(!movie) throw new NotFoundException('Movie not found')

        const updatedReview = await this.reviewModel.update({
            user_id,
            ...payload
        }, {where:{id:review_id}, returning:true})

        if(payload.rating) this.updateMovieRating(payload.movie_id)
        return responseMessage("Review successfully updated", updatedReview)
    }

    async deleteReview(review_id:string){
        const review = await this.reviewModel.findByPk(review_id)
        if(!review) throw new NotFoundException('review not found')
        
        await review.destroy()
        this.updateMovieRating(review.movie_id)
        return responseMessage("Review successfully deleted")
    }
}
