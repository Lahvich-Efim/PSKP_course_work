import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ description: 'Name of the product', example: 'Металл' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Unit of measurement for the product',
        example: 'кг',
    })
    @IsString()
    @IsNotEmpty()
    unit: string;
}
