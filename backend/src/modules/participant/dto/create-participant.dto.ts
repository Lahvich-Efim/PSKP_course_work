import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParticipantDto {
    @ApiProperty({
        description: 'Name of the participant',
        example: 'ООО Завод',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @MinLength(2)
    name: string;

    @ApiProperty({
        description: 'Description of the participant',
        example: 'Производитель подшипников',
        nullable: true,
        required: false,
    })
    @IsString()
    @IsOptional()
    description: string | null;
}
