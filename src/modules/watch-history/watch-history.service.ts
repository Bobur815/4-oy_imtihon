import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WatchHistory } from 'src/core/entities/watch.history';
import { CreateWatchHistoryDto, UpdateWatchHistoryDto } from './dto/dto';
import { Movie } from 'src/core/entities/movies.entity';
import { responseMessage } from 'src/common/utils/response-message';

@Injectable()
export class WatchHistoryService {
    constructor(
        @InjectModel(WatchHistory)
        private readonly watchHistoryModel: typeof WatchHistory,
        @InjectModel(Movie)
        private readonly movieModel: typeof Movie,
    ){}

    async getAll(){
        const watchHistrories = await this.watchHistoryModel.findAll()
        return responseMessage(undefined,watchHistrories)
    }

    async createWatchHistory(user_id:string, payload:CreateWatchHistoryDto){
        const movie = await this.movieModel.findOne({
            where: {id:payload.movie_id}
        })
        if(!movie) throw new NotFoundException('Movie not found')
        
        if(movie.duration_minutes<payload.watched_duration){
            throw new BadRequestException("Watched minutes longer than movie duration minutes")
        }

        const newWatchHistory = await this.watchHistoryModel.create({
            ...payload,
            user_id
        })
        return responseMessage('Watched history added',newWatchHistory)
    }

    async updateWatchHistory(history_id:string,payload:UpdateWatchHistoryDto){
        const movie = await this.movieModel.findOne({
            where: {id:payload.movie_id}
        })
        if(!movie) throw new NotFoundException('Movie not found')
        
        const watchHistory = await this.watchHistoryModel.findOne({
            where: {id:history_id}
        })
        if(!watchHistory) throw new NotFoundException('Watch history not found')
        
        const updatedHistory = await this.watchHistoryModel.update(payload,{
            where:{id:history_id},returning:true
        })

        return responseMessage("Watch history successfully updated", updatedHistory)
    }

    async deleteHistory(history_id:string){
        const watchHistory = await this.watchHistoryModel.findOne({
            where: {id:history_id}
        })
        if(!watchHistory) throw new NotFoundException('Watch history not found')
        
        await watchHistory.destroy()
        return responseMessage("Watch history successfully deleted")
    }
}
