import { Type, Expose } from 'class-transformer';
import { ProductResponseDto } from '../../product/dto/product-response.dto';

export class ConsumerCatalogShortDto {
    @Expose()
    id: number;

    @Expose()
    @Type(() => ProductResponseDto)
    product: ProductResponseDto;

    @Expose()
    participant: string;
}

export class SupplyInPlanDto {
    @Expose()
    id: number;

    @Expose()
    cost_factor: number;

    @Expose()
    @Type(() => ConsumerCatalogShortDto)
    consumer_catalog: ConsumerCatalogShortDto;

    @Expose()
    final_amount?: number;
}

export class CatalogInPlanDto {
    @Expose()
    id: number;

    @Expose()
    @Type(() => ProductResponseDto)
    product: ProductResponseDto;

    @Expose()
    desired_volume: number;

    @Expose()
    participant: string;

    @Expose()
    @Type(() => SupplyInPlanDto)
    supplies: SupplyInPlanDto[];
}

export class ProductionPlanResponseDto {
    @Expose()
    id: number;

    @Expose()
    period: string;

    @Expose()
    status: string;

    @Expose()
    @Type(() => CatalogInPlanDto)
    catalogs?: CatalogInPlanDto[];
}
