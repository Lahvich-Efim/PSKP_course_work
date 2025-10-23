import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCatalogDto {
    @ApiProperty({ description: 'ID of the product', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    product_id: number;

    @ApiProperty({ description: 'Desired volume of the product', example: 100 })
    @Min(0, { message: 'Число должно быть неотрицательным' })
    @IsNotEmpty()
    desired_volume: number;
}
