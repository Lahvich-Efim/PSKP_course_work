import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import BcryptService from '../core/utils/bcrypt-wrapper';
import { CreateUserDto, UserDto } from './dto/user.dto';
import { User, UserData } from '../core/entities/user.entity';
import {
    IUserRepository,
    UserFilter,
    UserWithOptionalPassword,
} from '../core/interfaces/user.interface';
import { USER_REPOSITORY } from '../core/interfaces/tokens';

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_REPOSITORY) private readonly repository: IUserRepository,
    ) {}

    async getUser<IncludePassword extends boolean>(
        where: UserFilter,
        withPassword?: IncludePassword,
    ): Promise<UserWithOptionalPassword<IncludePassword>> {
        const user: User | null = await this.repository.findOne(where);

        if (!user) throw new NotFoundException(`User not found!`);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return withPassword ? user : UserDto.fromEntity(user);
    }

    async getUserById<IncludePassword extends boolean>(
        userId: number,
        withPassword?: IncludePassword,
    ): Promise<UserWithOptionalPassword<IncludePassword>> {
        const user = await this.repository.findOneById(userId);

        if (!user)
            throw new NotFoundException(
                `User not found with this id ${userId}`,
            );

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return withPassword ? user : UserDto.fromEntity(user);
    }

    async userExists(where: UserFilter, userId?: number): Promise<boolean> {
        return this.repository.isExists(where, userId);
    }

    async getUsers(
        where: UserFilter,
        offset?: number,
        limit?: number,
    ): Promise<UserData[]> {
        const users: User[] = await this.repository.findMany(
            where,
            offset,
            limit,
        );
        return users.map((user: User) => UserDto.fromEntity(user));
    }

    async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
        const { password, ...userData } = createUserDto;
        const hasPassword = await BcryptService.hash(
            password,
            BcryptService.genSaltSync(10),
        );
        const user = await this.repository.create({
            ...userData,
            password: hasPassword,
        });
        return UserDto.fromEntity(user);
    }
}
