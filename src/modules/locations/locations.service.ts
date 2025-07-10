import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.location.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateLocationDto) {
    return this.prisma.location.create({data: dto})
  }
}
