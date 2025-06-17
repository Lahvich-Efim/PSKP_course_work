import { Expose, Type } from 'class-transformer';
import { CatalogResponseDto } from '../../catalog/dto/catalog-response.dto';

export class SupplyResponseDto {
    @Expose()
    id: number;

    @Expose()
    cost_factor: number;

    @Expose()
    @Type(() => CatalogResponseDto)
    supplier_catalog: CatalogResponseDto;

    @Expose()
    @Type(() => CatalogResponseDto)
    consumer_catalog: CatalogResponseDto;
}
