import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgreementDto {
    @ApiProperty({
        description: 'ID каталога поставщика',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    supplier_catalog_id: number;

    @ApiProperty({
        description: 'ID каталога потребителя',
        example: 2,
    })
    @IsNumber()
    @IsNotEmpty()
    consumer_catalog_id: number;

    @ApiProperty({
        description: 'Коэффициент затрат',
        example: 0.75,
    })
    @IsNotEmpty()
    @Min(0, { message: 'Число должно быть неотрицательным' })
    cost_factor: number;
}
