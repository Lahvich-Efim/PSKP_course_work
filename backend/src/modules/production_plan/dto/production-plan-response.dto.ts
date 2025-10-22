import { Type, Expose } from 'class-transformer';
import { ProductResponseDto } from '../../product/dto/product-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PeerCatalogShortDto {
    @ApiProperty({
        description: 'Unique identifier of the consumer catalog',
        example: 1,
    })
    @Expose()
    id: number;

    @ApiProperty({
        description: 'Product details',
        type: () => ProductResponseDto,
    })
    @Expose()
    @Type(() => ProductResponseDto)
    product: ProductResponseDto;
}

export class SupplyInPlanDto {
    @ApiProperty({ description: 'Unique identifier of the supply', example: 1 })
    @Expose()
    id: number;

    @ApiProperty({ description: 'Cost factor of the supply', example: 0.5 })
    @Expose()
    cost_factor: number;

    @ApiProperty({
        description: 'Direction of supply relative to this catalog',
        example: 'outgoing',
        enum: ['outgoing', 'incoming'],
    })
    @Expose()
    direction: 'outgoing' | 'incoming';

    @ApiProperty({
        description: 'Consumer catalog details',
        type: () => PeerCatalogShortDto,
    })
    @Expose()
    @Type(() => PeerCatalogShortDto)
    peer_catalog: PeerCatalogShortDto;

    @ApiProperty({
        description: 'Final amount of the supply, optional',
        example: 100,
        nullable: true,
        required: false,
    })
    @Expose()
    final_amount?: number;
}

export class CatalogInPlanDto {
    @ApiProperty({
        description: 'Unique identifier of the catalog in the plan',
        example: 1,
    })
    @Expose()
    id: number;

    @ApiProperty({
        description: 'Product details',
        type: () => ProductResponseDto,
    })
    @Expose()
    @Type(() => ProductResponseDto)
    product: ProductResponseDto;

    @ApiProperty({
        description: 'Desired volume of the product in the catalog',
        example: 200,
    })
    @Expose()
    desired_volume: number;

    @ApiProperty({
        description: 'List of supplies related to this catalog',
        type: () => [SupplyInPlanDto],
    })
    @Expose()
    @Type(() => SupplyInPlanDto)
    supplies: SupplyInPlanDto[];
}

export class ProductionPlanResponseDto {
    @ApiProperty({
        description: 'Unique identifier of the production plan',
        example: 1,
    })
    @Expose()
    id: number;

    @ApiProperty({
        description: 'Period of the production plan',
        example: '2023-01-01T00:00:00.000Z',
    })
    @Expose()
    period: Date;

    @ApiProperty({
        description: 'Status of the production plan',
        example: 'OPEN',
        enum: ['OPEN', 'FINALIZED', 'ARCHIVED'],
    })
    @Expose()
    status: string;

    @ApiProperty({
        description: 'List of catalogs included in the production plan',
        type: () => [CatalogInPlanDto],
        required: false,
    })
    @Expose()
    @Type(() => CatalogInPlanDto)
    catalogs?: CatalogInPlanDto[];
}
