import { User, UserData } from '../entities/user.entity';
import { EntityFilter } from '../../application/interfaces/filter.interface';

export type CreateUser = Omit<User, 'id'>;
export type UpdateUser = Partial<User> & { id: number };
export type UserWithOptionalPassword<IncludePassword extends boolean> =
    IncludePassword extends true ? User : UserData;

export type UserFilter = EntityFilter<User>;

export interface IUserRepository {
    findOneById(userId: number): Promise<User | null>;

    findOne(where: UserFilter): Promise<User | null>;

    findMany(
        where: UserFilter,
        offset?: number,
        limit?: number,
    ): Promise<User[]>;

    isExists(where: UserFilter, userId?: number): Promise<boolean>;

    create(user: CreateUser): Promise<User>;

    delete(userId: number): Promise<void>;
}
