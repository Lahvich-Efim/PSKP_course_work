import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './quards/jwt.guard';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

export const JWT_ACCESS_SERVICE = 'JWT_ACCESS_SERVICE';
export const JWT_REFRESH_SERVICE = 'JWT_REFRESH_SERVICE';

@Module({
    imports: [
        InfrastructureModule,
        UserModule,
        PassportModule,
        ConfigModule,
        JwtModule.register({}),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        JwtAuthGuard,
        {
            provide: JWT_ACCESS_SERVICE,
            useFactory: (configService: ConfigService) => {
                return new JwtService({
                    secret: configService.get('JWT_ACCESS_SECRET'),
                    signOptions: {
                        expiresIn: configService.get(
                            'JWT_ACCESS_EXPIRE',
                            '15m',
                        ),
                    },
                });
            },
            inject: [ConfigService],
        },
        {
            provide: JWT_REFRESH_SERVICE,
            useFactory: (configService: ConfigService) => {
                return new JwtService({
                    secret: configService.get('JWT_REFRESH_SECRET'),
                    signOptions: {
                        expiresIn: configService.get(
                            'JWT_REFRESH_EXPIRE',
                            '60d',
                        ),
                    },
                });
            },
            inject: [ConfigService],
        },
    ],
    exports: [AuthService],
})
export class AuthModule {}
