import { IsNumber, IsOptional, IsString } from 'class-validator';
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
        description: 'ID of the production',
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    production_id?: number;
}
