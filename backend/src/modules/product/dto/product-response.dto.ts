import { Expose } from 'class-transformer';

export class ProductResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    unit: string;
}
