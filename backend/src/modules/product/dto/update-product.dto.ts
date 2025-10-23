import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
    @ApiProperty({
        description: 'Optional new name for the product',
        example: 'Металл',
        required: false,
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'Optional new unit of measurement for the product',
        example: 'шт',
        required: false,
    })
    @IsString()
    @IsOptional()
    unit?: string;
}
