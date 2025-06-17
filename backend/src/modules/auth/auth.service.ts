import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import BcryptService from '../../shared/utils/bcrypt-wrapper';
import { UserService } from '../users/user.service';
import { LoginDto, RegisterUserDto } from './auth.dto';
import { JwtPayload, Tokens } from './auth.entity';
import {
    JWT_ACCESS_SERVICE,
    JWT_REFRESH_SERVICE,
} from './config/jwt_module_async_options';
import { User } from '../users/user.entity';
import {
    AuthException,
    UnauthorizedError,
} from '../../shared/exceptions/exceptions';

@Injectable()
export class AuthService {
    constructor(
        @Inject(JWT_REFRESH_SERVICE) private jwtRefreshService: JwtService,
        @Inject(JWT_ACCESS_SERVICE) private jwtAccessService: JwtService,
        private userService: UserService,
    ) {}

    private async generateTokens(user: User): Promise<Tokens> {
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        } as JwtPayload;

        const accessToken = await this.jwtAccessService.signAsync(payload);
        const refreshToken = await this.jwtRefreshService.signAsync(payload);
        return { accessToken, refreshToken };
    }

    async refreshTokens(refreshToken: string): Promise<Tokens> {
        let payload: JwtPayload;

        try {
            payload = this.jwtRefreshService.verify<JwtPayload>(refreshToken);
        } catch (error) {
            throw new UnauthorizedError(
                'Время сессии истек, авторизуйтесь заново',
            );
        }

        const user = await this.userService.getUserById(payload.id, true);
        if (!user) {
            throw new UnauthorizedException(
                'Пользователь не найден! Переавторизуйтесь!',
            );
        }
        return await this.generateTokens(user);
    }

    async login(dto: LoginDto): Promise<Tokens> {
        const user = await this.userService.getUser(
            { username: dto.username },
            true,
        );
        if (!user) {
            throw new AuthException('Не найден пользователя с таким логином!');
        }
        if (!(await BcryptService.compare(dto.password, user.password))) {
            throw new AuthException('Неверно введен пароль');
        }

        return this.generateTokens(user);
    }

    async register(dto: RegisterUserDto) {
        return await this.userService.createUser({
            ...dto,
        });
    }
}
