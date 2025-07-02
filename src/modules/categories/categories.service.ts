import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from 'src/core/entities/category.entity';
import { CategoryDto } from './dto/categorydto';
import { responseMessage } from 'src/common/utils/response-message';
@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category) private readonly categoryModel: typeof Category){}

    async getAll(){
        const categories = await this.categoryModel.findAll()
        return responseMessage("Categories",categories)
    }

    async getSingle(id:string){
        const category = await this.categoryModel.findByPk(id)
        if(!category) throw new NotFoundException("Category not found")
        return responseMessage("Category",category)
    }

    async createCategory(payload:CategoryDto){
        const slugExist = await this.categoryModel.findOne({ where: {slug:payload.slug}})
        if(slugExist) throw new ConflictException("Slug name already exists")
            
            const newCategory = await this.categoryModel.create({
                name:payload.name,
                slug:payload.slug,
                description: payload.description
            })

        return responseMessage('New category successfully added',newCategory)
    }

    async updateCategory(id:string,payload:CategoryDto){
        
        const [affected] = await this.categoryModel.update(payload, {
            where: { id },
          });

        if (!affected) throw new NotFoundException('Category not found');

        const updatedCategory = await this.categoryModel.findOne({
            where: { id },
        });

        return responseMessage("Profile updated successfully",updatedCategory)
    }

    async deleteCategory(id:string){
        const category = await this.categoryModel.findByPk(id)
        if(!category) throw new NotFoundException("Category not found")
        category.destroy()

        return responseMessage("Category successfull deleted")
    }
}

