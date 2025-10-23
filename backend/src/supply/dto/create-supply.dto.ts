import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplyDto {
    @ApiProperty({ description: 'ID of the supplier catalog', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    supplier_catalog_id: number;

    @ApiProperty({ description: 'ID of the consumer catalog', example: 2 })
    @IsNotEmpty()
    @IsNumber()
    consumer_catalog_id: number;

    @ApiProperty({ description: 'Cost factor of the supply', example: 0.75 })
    @IsNotEmpty()
    @Min(0, { message: 'Число должно быть неотрицательным' })
    cost_factor: number;
}
