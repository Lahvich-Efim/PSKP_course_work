import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateProductionDto {
    @ApiProperty({ description: 'Name of the production', example: 'Металл' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Unit of measurement for the product',
        example: 'кг',
    })
    @Expose()
    unit: string;

    @ApiProperty({
        description: 'Description of the production',
        example: 'Твердое вещество',
        required: false,
    })
    @IsString()
    @IsOptional()
    description: string | null;
}
