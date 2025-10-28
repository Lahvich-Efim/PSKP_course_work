import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CatalogResponseDto } from '../../catalog/dto/catalog-response.dto';

export class AgreementResponseDto {
    @ApiProperty({
        description: 'Уникальный идентификатор соглашения',
        example: 1,
    })
    @Expose()
    id: number;

    @ApiProperty({
        description: 'Коэффициент затрат',
        example: 0.75,
    })
    @Expose()
    cost_factor: number;

    @ApiProperty({
        description: 'ID связанной поставки (если активирована)',
        example: 5,
        nullable: true,
    })
    @Expose()
    linked_supply_id: number | null;

    @ApiProperty({
        description: 'Статус соглашения',
        enum: ['PENDING', 'ACTIVE', 'CANCELLED', 'COMPLETED'],
        example: 'PENDING',
    })
    @Expose()
    status: string;

    @ApiProperty({
        description: 'Статус поставщика',
        enum: ['PENDING', 'ACCEPTED', 'CANCELLED'],
        example: 'ACCEPTED',
    })
    @Expose()
    supplier_status: string;

    @ApiProperty({
        description: 'Статус потребителя',
        enum: ['PENDING', 'ACCEPTED', 'CANCELLED'],
        example: 'PENDING',
    })
    @Expose()
    consumer_status: string;

    @ApiProperty({
        description: 'Каталог поставщика',
        type: () => CatalogResponseDto,
    })
    @Expose()
    @Type(() => CatalogResponseDto)
    supplier_catalog: CatalogResponseDto;

    @ApiProperty({
        description: 'Каталог потребителя',
        type: () => CatalogResponseDto,
    })
    @Expose()
    @Type(() => CatalogResponseDto)
    consumer_catalog: CatalogResponseDto;
}
