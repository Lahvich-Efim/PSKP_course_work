import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class ProductFilterDto {
    @ApiPropertyOptional({ example: 'Steel Rod' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 42 })
    @IsOptional()
    @IsNumber()
    participant_id?: number;

    @ApiPropertyOptional({ example: 5 })
    @IsOptional()
    @IsNumber()
    production_id?: number;
}
