import { ConflictException, Get, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Movie_category } from 'src/core/entities/movie.categories';
import { MovieCategoryDto } from './dto/dto';
import { Movie } from 'src/core/entities/movies.entity';
import { Category } from 'src/core/entities/category.entity';
import { responseMessage } from 'src/common/utils/response-message';

@Injectable()
export class MovieCategoriesService {
    constructor(
        @InjectModel(Movie_category)
        private readonly movieCategoryModel: typeof Movie_category,
        @InjectModel(Movie)
        private readonly movieModel: typeof Movie,
        @InjectModel(Category)
        private readonly categoryModel: typeof Category
    ){}

    async getAll(){
        const data = await this.movieCategoryModel.findAll()
        return responseMessage(undefined,data)
    }

    async create(payload:MovieCategoryDto){
        const {movie_id, category_id} = payload
        const movie = await this.movieModel.findByPk(movie_id)
        if(!movie) throw new NotFoundException("Movie not found")
        
        const category = await this.categoryModel.findByPk(category_id)
        if(!category) throw new NotFoundException("Category not found")

        const exists = await this.movieCategoryModel.findOne({
            where: { movie_id, category_id },
        });

        if (exists) {
            throw new ConflictException('This category is already linked to this movie');
        }

        
        const data = await this.movieCategoryModel.create({movie_id,category_id})
        return responseMessage("Category successfully added to movie",data)
    }

    async update(id:string, payload:MovieCategoryDto){
        const movie_category = await this.movieCategoryModel.findByPk(id)
        if(!movie_category) throw new NotFoundException()

        await this.movieCategoryModel.update(payload,{where: {id}})
        return responseMessage("Successfully updated")
    }

    async delete(id:string){
        const movie_category = await this.movieCategoryModel.findByPk(id)
        if(!movie_category) throw new NotFoundException()

        await movie_category.destroy()
        return responseMessage("Successfully deleted")
    }
}
