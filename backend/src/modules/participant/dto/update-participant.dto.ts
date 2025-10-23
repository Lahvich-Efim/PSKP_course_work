import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateParticipantDto {
    @ApiProperty({
        description: 'Optional new name for the participant',
        example: 'ООО Новый Завод',
        required: false,
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'Optional new description for the participant',
        example: 'Обновленное описание',
        nullable: true,
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string | null;
}
