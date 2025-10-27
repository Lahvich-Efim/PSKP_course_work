import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ description: 'Name of the product', example: 'Металл' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'ID of the production',
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    production_id: number;
}
