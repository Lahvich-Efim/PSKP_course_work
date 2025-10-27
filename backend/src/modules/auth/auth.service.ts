import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { LoginDto, RegisterUserDto } from './dto/auth.dto';
import { JwtPayload, Tokens } from '../../domain/entities/auth.entity';
import {
    JWT_ACCESS_SERVICE,
    JWT_REFRESH_SERVICE,
} from './config/jwt_module_async_options';
import { User } from '../../domain/entities/user.entity';
import { Participant } from '../../domain/entities/participant.entity';
import { Coordinator } from '../../domain/entities/coordinator.entity';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import {
    AuthException,
    EntityAlreadyExistError,
    UnauthorizedError,
} from '../../common/exceptions/exceptions';
import BcryptService from '../../common/utils/bcrypt-wrapper';
import { IUserRepository } from '../../domain/repositories/user.interface';
import { ICoordinatorRepository } from '../../domain/repositories/coordinator.interface';
import { IParticipantRepository } from '../../domain/repositories/participant.interface';
import {
    COORDINATOR_REPOSITORY,
    PARTICIPANT_REPOSITORY,
    USER_REPOSITORY,
} from '../../domain/tokens';

@Injectable()
export class AuthService {
    constructor(
        @Inject(JWT_REFRESH_SERVICE)
        private readonly jwtRefreshService: JwtService,
        @Inject(JWT_ACCESS_SERVICE)
        private readonly jwtAccessService: JwtService,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(COORDINATOR_REPOSITORY)
        private readonly coordinatorRepository: ICoordinatorRepository,
        @Inject(PARTICIPANT_REPOSITORY)
        private readonly participantRepository: IParticipantRepository,
        private readonly userService: UserService,
        private readonly prisma: PrismaService,
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
            throw new UnauthorizedException('Пользователь не найден!');
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
        const existingUser = await this.userRepository.findOne({
            OR: [{ username: dto.username }, { email: dto.email }],
        });

        if (existingUser) {
            if (existingUser.email === dto.email) {
                throw new EntityAlreadyExistError(
                    'Пользователь с данной почтой уже существует',
                );
            }
            if (existingUser.username === dto.username) {
                throw new EntityAlreadyExistError(
                    'Пользователь с данным логином уже существует',
                );
            }
            throw new EntityAlreadyExistError('Пользователь уже существует');
        }

        return await this.prisma.$transaction(async (tx) => {
            const hasPassword = await BcryptService.hash(
                dto.password,
                BcryptService.genSaltSync(10),
            );
            const user = await tx.user.create({
                data: {
                    username: dto.username,
                    email: dto.email,
                    password: hasPassword,
                    role: dto.role,
                },
                omit: {
                    password: true,
                },
            });

            if (dto.role === 'COORDINATOR') {
                const profile: Coordinator = (await tx.coordinator.create({
                    data: {
                        id: user.id,
                        name: dto.name,
                    },
                })) as Coordinator;
                return {
                    user,
                    profile,
                };
            } else if (dto.role === 'PARTICIPANT') {
                const profile: Participant = (await tx.participant.create({
                    data: {
                        id: user.id,
                        name: dto.name,
                        description: dto.description || null,
                    },
                })) as Participant;
                return {
                    user,
                    profile,
                };
            }
        });
    }
}
