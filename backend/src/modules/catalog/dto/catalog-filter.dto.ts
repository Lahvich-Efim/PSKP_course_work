import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductFilterDto } from '../../product/dto/product-filter.dto';

export class CatalogFilterDto {
    @ApiPropertyOptional({ example: 5 })
    @IsOptional()
    @IsNumber()
    product_id?: number;

    @ApiPropertyOptional({ type: ProductFilterDto })
    @IsOptional()
    @Type(() => ProductFilterDto)
    product?: {
        is?: ProductFilterDto;
        isNot?: ProductFilterDto;
    };
}
