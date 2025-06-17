import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUser, IUserRepository, UserFilter } from './user.interface';
import { User } from './user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(private prisma: PrismaService) {}

    async findOneById(userId: number): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
    }

    async findMany(
        where: UserFilter,
        offset?: number,
        limit?: number,
    ): Promise<User[]> {
        return this.prisma.user.findMany({
            where,
            skip: offset,
            take: limit,
        });
    }

    async findOne(where: UserFilter): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where,
        });
    }

    async isExists(where: UserFilter, userId?: number): Promise<boolean> {
        return !!(await this.prisma.user.findFirst({
            where: {
                id: userId,
                ...where,
            },
        }));
    }

    async create(user: CreateUser): Promise<User> {
        return this.prisma.user.create({
            data: user,
        });
    }

    async delete(userId: number): Promise<void> {
        await this.prisma.user.delete({
            where: {
                id: userId,
            },
        });
    }
}
