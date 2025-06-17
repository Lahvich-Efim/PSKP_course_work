import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateSupplyDto {
    @IsNotEmpty()
    @IsNumber()
    supplier_catalog_id: number;

    @IsNotEmpty()
    @IsNumber()
    consumer_catalog_id: number;

    @IsNotEmpty()
    @IsPositive()
    cost_factor: number;
} 