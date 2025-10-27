import { Injectable } from '@nestjs/common';
import {
    CreateUser,
    IUserRepository,
    UserFilter,
} from '../../../domain/repositories/user.interface';
import { User } from '../../../domain/entities/user.entity';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma.service';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class UserRepository extends BaseRepository implements IUserRepository {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma);
    }

    static withTransaction(tx: PrismaClient | Prisma.TransactionClient) {
        return new UserRepository(tx as unknown as PrismaService);
    }

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
