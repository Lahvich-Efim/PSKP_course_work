import { IsOptional, Min } from 'class-validator';
import { ClassConstructor, Expose, Type } from 'class-transformer';

export class PaginationDto {
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number;

    @IsOptional()
    @Min(1)
    @Type(() => Number)
    limit?: number;
}

export function PaginatedResponseDto<T>(itemDto: ClassConstructor<T>) {
    class PaginatedDto {
        @Expose()
        count!: number;

        @Expose()
        @Type(() => itemDto)
        items!: T[];
    }
    return PaginatedDto;
}
