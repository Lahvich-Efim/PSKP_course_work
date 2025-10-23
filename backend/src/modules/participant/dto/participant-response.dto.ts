import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ParticipantResponseDto {
    @ApiProperty({
        description: 'Unique identifier of the participant',
        example: 1,
    })
    @Expose()
    id: number;

    @ApiProperty({
        description: 'Name of the participant',
        example: 'ООО Завод',
    })
    @Expose()
    name: string;

    @ApiProperty({
        description: 'Description of the participant',
        example: 'Производитель подшипников',
        nullable: true,
        required: false,
    })
    @Expose()
    description?: string | null;

    @ApiProperty({
        description: 'User details associated with the participant',
        type: () => UserResponseDto,
    })
    @Expose()
    @Type(() => UserResponseDto)
    user: UserResponseDto;
}
