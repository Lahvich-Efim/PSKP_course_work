import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductionResponseDto {
    @ApiProperty({
        description: 'Unique identifier of the production',
        example: 1,
    })
    @Expose()
    id: number;

    @ApiProperty({ description: 'Name of the production', example: 'Металл' })
    @Expose()
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
    })
    @Expose()
    description?: string | null;
}
