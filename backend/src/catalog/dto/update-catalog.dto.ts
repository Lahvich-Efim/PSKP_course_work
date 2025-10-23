import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCatalogDto {
    @ApiProperty({
        description: 'Optional ID of the product to update',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    product_id?: number;

    @ApiProperty({
        description: 'Optional desired volume to update',
        example: 150,
        required: false,
    })
    @Min(0, { message: 'Число должно быть неотрицательным' })
    @IsOptional()
    desired_volume?: number;
}
