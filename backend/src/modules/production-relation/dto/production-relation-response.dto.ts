import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProductionResponseDto } from '../../production/dto/production-response.dto';

export class ProductionRelationResponseDto {
    @ApiProperty({
        description: 'Уникальный идентификатор связи',
        example: 1,
    })
    @Expose()
    id: number;

    @ApiProperty({
        description: 'Производство, которое требует зависимость',
        type: () => ProductionResponseDto,
    })
    @Expose()
    @Type(() => ProductionResponseDto)
    production: ProductionResponseDto;

    @ApiProperty({
        description: 'Требуемое производство (зависимость)',
        type: () => ProductionResponseDto,
    })
    @Expose()
    @Type(() => ProductionResponseDto)
    required_production: ProductionResponseDto;
}
