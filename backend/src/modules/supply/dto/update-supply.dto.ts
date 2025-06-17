import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdateSupplyDto {
    @IsPositive()
    @IsOptional()
    cost_factor?: number;

    @IsNumber()
    @IsOptional()
    supplier_catalog_id?: number;

    @IsNumber()
    @IsOptional()
    consumer_catalog_id?: number;
}
