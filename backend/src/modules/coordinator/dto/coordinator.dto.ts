import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { CoordinatorData } from '../coordinator.entity';

export class CreateCoordinatorDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class CoordinatorDto implements CoordinatorData {
    @Expose()
    name: string;
}
