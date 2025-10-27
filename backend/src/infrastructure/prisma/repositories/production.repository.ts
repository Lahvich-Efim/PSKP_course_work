import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import {
    CreateProduction,
    IProductionRepository,
    ProductionFilter,
    UpdateProduction,
} from '../../../domain/repositories/production.interface';
import { Production } from 'src/domain/entities/production.entity';
import { PrismaService } from '../prisma.service';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class ProductionRepository
    extends BaseRepository
    implements IProductionRepository
{
    constructor(protected readonly prisma: PrismaService) {
        super(prisma);
    }

    static withTransaction(tx: PrismaClient | Prisma.TransactionClient) {
        return new ProductionRepository(tx as unknown as PrismaService);
    }

    async findOneById(productionId: number): Promise<Production | null> {
        return this.prisma.production.findUnique({
            where: { id: productionId },
        });
    }
    async findOne(where: ProductionFilter): Promise<Production | null> {
        return this.prisma.production.findFirst({
            where,
        });
    }

    async findMany(
        where: ProductionFilter,
        offset?: number,
        limit?: number,
    ): Promise<Production[]> {
        return this.prisma.production.findMany({
            where,
            skip: offset,
            take: limit,
        });
    }

    async isExists(
        where: ProductionFilter,
        productionId?: number,
    ): Promise<boolean> {
        return !!(await this.prisma.production.findFirst({
            where: {
                id: productionId,
                ...where,
            },
        }));
    }

    async create(production: CreateProduction): Promise<Production> {
        return this.prisma.production.create({
            data: production,
        });
    }

    async update(production: UpdateProduction): Promise<Production> {
        const { id, ...data } = production;
        return this.prisma.production.update({
            where: { id },
            data,
        });
    }

    async delete(productionId: number): Promise<Production> {
        return this.prisma.production.delete({
            where: { id: productionId },
        });
    }

    count(where?: ProductionFilter): Promise<number> {
        return this.prisma.production.count({ where });
    }
}
