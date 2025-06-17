import { JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const JWT_ACCESS_SERVICE = 'JWT_ACCESS_SERVICE';
export const JWT_REFRESH_SERVICE = 'JWT_REFRESH_SERVICE';

export const JwtAccessOptions = (config: ConfigService): JwtModuleOptions => {
    return {
        secret: config.get('JWT_ACCESS_SECRET'),
        signOptions: {
            expiresIn: config.get('JWT_ACCESS_EXPIRE', '15m'),
        },
    };
};

export const JwtRefreshOptions = (config: ConfigService): JwtModuleOptions => {
    return {
        secret: config.get('JWT_REFRESH_SECRET'),
        signOptions: {
            expiresIn: config.get('JWT_REFRESH_EXPIRE', '60d'),
        },
    };
};

export const JwtAccessProvider = {
    provide: JWT_ACCESS_SERVICE,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) =>
        new JwtService(JwtAccessOptions(config)),
};

export const JwtRefreshProvider = {
    provide: JWT_REFRESH_SERVICE,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) =>
        new JwtService(JwtRefreshOptions(config)),
};
