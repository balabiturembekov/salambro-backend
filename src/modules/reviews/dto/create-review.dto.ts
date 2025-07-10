import { IsUUID, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 'uuid', description: 'ID локации (точки)' })
  @IsUUID()
  locationId: string;

  @ApiProperty({ example: 'uuid', description: 'ID категории жалобы' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: 'Очень грубый кассир', required: false })
  @IsOptional()
  @IsString()
  comment?: string;

  @IsString()
  @ApiProperty({ example: '+7 700 123 4455', required: true })
  phone: string;
}
