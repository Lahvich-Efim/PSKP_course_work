import { IsOptional, Min } from 'class-validator';
import { ClassConstructor, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
    @ApiProperty({
        description: 'Offset for pagination',
        example: 0,
        required: false,
    })
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number;

    @ApiProperty({
        description: 'Limit for pagination',
        example: 10,
        required: false,
    })
    @IsOptional()
    @Min(1)
    @Type(() => Number)
    limit?: number;
}

export function PaginatedResponseDto<T>(itemDto: ClassConstructor<T>) {
    const dtoName = `${itemDto.name}PaginatedDto`;

    class PaginatedDto {
        @ApiProperty({ description: 'Total count of items', example: 100 })
        @Expose()
        count!: number;

        @ApiProperty({ description: 'Array of items', type: () => [itemDto] })
        @Expose()
        @Type(() => itemDto)
        items!: T[];
    }
    Object.defineProperty(PaginatedDto, 'name', { value: dtoName });
    return PaginatedDto;
}
