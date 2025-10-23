import { Prisma, PrismaClient } from '@prisma/client';

export abstract class BaseRepository {
    constructor(
        protected readonly prisma: PrismaClient | Prisma.TransactionClient,
    ) {}
}
