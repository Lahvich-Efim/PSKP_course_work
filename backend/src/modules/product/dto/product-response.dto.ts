import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
    @ApiProperty({
        description: 'Unique identifier of the product',
        example: 1,
    })
    @Expose()
    id: number;

    @ApiProperty({ description: 'Name of the product', example: 'Металл' })
    @Expose()
    name: string;

    @ApiProperty({
        description: 'Participant name',
        example: 'ООО Компания',
    })
    @Expose()
    participant_name: string;

    @ApiProperty({
        description: 'ID of the production',
        example: 12,
    })
    @Expose()
    production_id: number;
}
