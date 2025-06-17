import { Expose, Type } from 'class-transformer';
import { ProductResponseDto } from '../../product/dto/product-response.dto';

export class CatalogResponseDto {
    @Expose()
    id: number;

    @Expose()
    desired_volume: number;

    @Expose()
    @Type(() => ProductResponseDto)
    product?: ProductResponseDto;

    @Expose()
    participant: string;
}
