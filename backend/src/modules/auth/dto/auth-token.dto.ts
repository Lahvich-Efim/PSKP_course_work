import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AuthTokensDto {
    @ApiProperty({ description: 'JWT Access Token' })
    @Expose()
    access_token: string;

    @ApiProperty({ description: 'JWT Refresh Token', required: false })
    @Expose()
    refresh_token?: string;
}
