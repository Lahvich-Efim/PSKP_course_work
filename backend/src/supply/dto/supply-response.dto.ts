import { Expose, Type } from 'class-transformer';
import { CatalogResponseDto } from '../../catalog/dto/catalog-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SupplyResponseDto {
    @ApiProperty({ description: 'Unique identifier of the supply', example: 1 })
    @Expose()
    id: number;

    @ApiProperty({ description: 'Cost factor of the supply', example: 0.75 })
    @Expose()
    cost_factor: number;

    @ApiProperty({
        description: 'Supplier catalog details',
        type: () => CatalogResponseDto,
    })
    @Expose()
    @Type(() => CatalogResponseDto)
    supplier_catalog: CatalogResponseDto;

    @ApiProperty({
        description: 'Consumer catalog details',
        type: () => CatalogResponseDto,
    })
    @Expose()
    @Type(() => CatalogResponseDto)
    consumer_catalog: CatalogResponseDto;
}
