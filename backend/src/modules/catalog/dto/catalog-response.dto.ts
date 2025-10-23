import { Expose, Type } from 'class-transformer';
import { ProductResponseDto } from '../../product/dto/product-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CatalogResponseDto {
    @ApiProperty({ description: 'Unique identifier of the catalog' })
    @Expose()
    id: number;

    @ApiProperty({
        description: 'Desired volume for the product in the catalog',
    })
    @Expose()
    desired_volume: number;

    @ApiProperty({
        description: 'Product details',
        type: () => ProductResponseDto,
    })
    @Expose()
    @Type(() => ProductResponseDto)
    product?: ProductResponseDto;
}
