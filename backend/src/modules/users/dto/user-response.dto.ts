import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty({
        description: 'User`s email address',
        example: 'user@example.com',
    })
    @Expose()
    email: string;

    @ApiProperty({ description: 'User`s username', example: 'username123' })
    @Expose()
    username: string;
}
