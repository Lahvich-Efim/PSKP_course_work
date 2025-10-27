import { Prisma, PrismaClient } from '@prisma/client';

export abstract class BaseRepository {
    protected prisma: PrismaClient | Prisma.TransactionClient;

    constructor(prisma: PrismaClient | Prisma.TransactionClient) {
        this.prisma = prisma;
    }
}
