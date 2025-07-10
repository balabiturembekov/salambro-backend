import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @MinLength(4)
    @ApiProperty({ example: 'Отравление', description: 'Название жалобы' })
    name: string;

    @ApiProperty({ example: 'alert-circle', description: 'Иконка для жалобы' })
    @IsString()
    icon: string;
}