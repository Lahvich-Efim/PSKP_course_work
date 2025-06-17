import { IsNumber, IsOptional } from 'class-validator';

export class UpdateCatalogDto {
    @IsNumber()
    @IsOptional()
    product_id?: number;

    @IsNumber()
    @IsOptional()
    desired_volume?: number;
}
