import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { CoordinatorData } from '../../core/entities/coordinator.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCoordinatorDto {
    @ApiProperty({
        description: 'Name of the coordinator',
        example: 'John Doe',
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class CoordinatorDto implements CoordinatorData {
    @ApiProperty({
        description: 'Name of the coordinator',
        example: 'John Doe',
    })
    @Expose()
    name: string;
}
