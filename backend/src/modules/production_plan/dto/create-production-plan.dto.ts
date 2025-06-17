import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductionPlanDto {
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    period: Date;
}
