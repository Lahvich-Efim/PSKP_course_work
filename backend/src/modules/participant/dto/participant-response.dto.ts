import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class ParticipantResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    description?: string | null;

    @Expose()
    @Type(() => UserResponseDto)
    user: UserResponseDto;
}
