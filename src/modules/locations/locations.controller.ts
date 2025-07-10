import { Controller, Get, Post, Body } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLocationDto } from './dto/create-location.dto';

@ApiTags('Локации')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список активных точек' })
  async findAll() {
    return this.locationsService.findAll();
  }

  @Post()
  @ApiOperation({summary: 'Создать точку'})
  async create(@Body() dto: CreateLocationDto) {
    return this.locationsService.create(dto)
  }
}
