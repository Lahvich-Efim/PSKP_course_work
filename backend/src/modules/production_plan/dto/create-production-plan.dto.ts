import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductionPlanDto {
    @ApiProperty({
        description:
            'Period of the production plan (e.g., first day of the month)',
        example: '2023-01-01T00:00:00.000Z',
    })
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    period_start: Date;

    @ApiProperty({
        description:
            'Period of the production plan (e.g., first day of the month)',
        example: '2023-01-01T00:00:00.000Z',
    })
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    period_end: Date;
}
