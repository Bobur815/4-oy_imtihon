import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/dto';
import { RequestWithUser } from '../profiles/profiles.controller';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService:ReviewService){}

    @Get()
    getAllReview(){
        return this.reviewService.getAll()
    }

    @Get('user-review/:user_id')
    getByUser(@Param('user_id') user_id:string){
        return this.reviewService.getByUser(user_id)
    }

    @Get('movie-review/:movie_id')
    getByMovie(@Param('movie_id') movie_id:string){
        return this.reviewService.getByMovie(movie_id)
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    createReview(@Request() req:RequestWithUser, @Body() payload:CreateReviewDto){
        
        return this.reviewService.createReview(req.user.id, payload)
    }

    @Put(':review_id')
    @UseGuards(JwtAuthGuard)
    updateReview(@Param('review_id') review_id: string, @Request() req:RequestWithUser, @Body() payload:CreateReviewDto){
        return this.reviewService.updateReview(review_id, req.user.id, payload)
    }

    @Delete(':review_id')
    deleteReview(@Param('review_id') review_id:string){
        return this.reviewService.deleteReview(review_id)
    }
}
