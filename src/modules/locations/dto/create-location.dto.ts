import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateLocationDto {
    @IsString()
    @MinLength(5)
    @ApiProperty({ example: 'Mega Center', description: 'Название точки' })
    name: string;

    @IsString()
    @ApiProperty({ example: 'ул. Розыбакиева', description: 'адрес точки' })
    address: string;

    @IsString()
    @ApiProperty({ example: 'mega-center', description: 'Slug' })
    slug: string;
}