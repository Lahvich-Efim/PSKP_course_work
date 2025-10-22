import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSupplyDto {
    @ApiProperty({
        description: 'Optional new cost factor for the supply',
        example: 0.8,
        required: false,
    })
    @Min(0, { message: 'Число должно быть неотрицательным' })
    @IsOptional()
    cost_factor?: number;

    @ApiProperty({
        description: 'Optional new ID of the supplier catalog',
        example: 3,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    supplier_catalog_id?: number;

    @ApiProperty({
        description: 'Optional new ID of the consumer catalog',
        example: 4,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    consumer_catalog_id?: number;
}
