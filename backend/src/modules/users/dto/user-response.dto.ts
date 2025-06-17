import { Expose } from 'class-transformer';

export class UserResponseDto {
    @Expose()
    email: string;

    @Expose()
    username: string;
}
