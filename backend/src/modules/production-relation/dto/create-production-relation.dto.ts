import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductionRelationDto {
    @ApiProperty({
        description: 'ID производства, которое требует зависимость',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    production_id: number;

    @ApiProperty({
        description: 'ID требуемого производства (зависимость)',
        example: 2,
    })
    @IsNumber()
    @IsNotEmpty()
    required_production_id: number;
}
