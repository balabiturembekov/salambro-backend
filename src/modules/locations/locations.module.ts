import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Module({
  controllers: [LocationsController],
  providers: [LocationsService, PrismaService],
})
export class LocationsModule {}
