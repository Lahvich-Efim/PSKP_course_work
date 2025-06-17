import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCatalogDto {
    @IsNumber()
    @IsNotEmpty()
    product_id: number;

    @IsNumber()
    @IsNotEmpty()
    desired_volume: number;
}
