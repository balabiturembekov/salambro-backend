import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('Категории жалоб')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список жалоб' })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  @ApiOperation({summary: 'Создать категорию'})
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto)
  }
}
