import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt.guard';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import {
    JwtAccessProvider,
    JwtRefreshProvider,
} from './config/jwt_module_async_options';

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
        JwtAccessProvider,
        JwtRefreshProvider,
    ],
    exports: [AuthService],
})
export class AuthModule {}
