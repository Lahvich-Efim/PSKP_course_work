import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';

export const JWT_ACCESS_SERVICE = 'JWT_ACCESS_SERVICE';
export const JWT_REFRESH_SERVICE = 'JWT_REFRESH_SERVICE';

export const JwtAccessProvider = {
    provide: JWT_ACCESS_SERVICE,
    inject: [ConfigService],
    useFactory: (config: ConfigService) =>
        new JwtService({
            secret: config.get<string>('JWT_ACCESS_SECRET'),
            signOptions: {
                expiresIn: config.get<StringValue>('JWT_ACCESS_EXPIRE', '15m'),
            },
        }),
};

export const JwtRefreshProvider = {
    provide: JWT_REFRESH_SERVICE,
    inject: [ConfigService],
    useFactory: (config: ConfigService) =>
        new JwtService({
            secret: config.get<string>('JWT_REFRESH_SECRET'),
            signOptions: {
                expiresIn: config.get<StringValue>('JWT_REFRESH_EXPIRE', '60d'),
            },
        }),
};
