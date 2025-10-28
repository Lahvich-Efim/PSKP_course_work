import { Injectable } from '@nestjs/common';
import {
    IProductionRelationRepository,
    CreateProductionRelation,
    ProductionRelationFilter,
} from '../../../domain/repositories/production-relation.interface';
import { ProductionRelation } from '../../../domain/entities/production-relation.entity';
import { PrismaService } from '../prisma.service';
import { BaseRepository } from './base.repository';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class ProductionRelationRepository
    extends BaseRepository
    implements IProductionRelationRepository
{
    constructor(protected readonly prisma: PrismaService) {
        super(prisma);
    }
    findOneById(
        production_relation_id: number,
    ): Promise<ProductionRelation | null> {
        return this.prisma.productionRelation.findUnique({
            where: {
                id: production_relation_id,
            },
        });
    }

    static withTransaction(tx: PrismaClient | Prisma.TransactionClient) {
        return new ProductionRelationRepository(tx as unknown as PrismaService);
    }

    async existsLink(
        required_production_id: number,
        production_id: number,
    ): Promise<boolean> {
        const link = await this.prisma.productionRelation.findFirst({
            where: { required_production_id, production_id },
            select: { id: true },
        });
        return !!link;
    }

    async findMany(
        where?: ProductionRelationFilter,
        offset?: number,
        limit?: number,
    ): Promise<ProductionRelation[]> {
        return this.prisma.productionRelation.findMany({
            where,
            skip: offset,
            take: limit,
        });
    }

    async findOne(
        where?: ProductionRelationFilter,
    ): Promise<ProductionRelation | null> {
        return this.prisma.productionRelation.findFirst({
            where,
        });
    }

    async create(data: CreateProductionRelation): Promise<ProductionRelation> {
        return this.prisma.productionRelation.create({ data });
    }

    async delete(id: number): Promise<ProductionRelation> {
        return this.prisma.productionRelation.delete({ where: { id } });
    }

    async count(where?: ProductionRelationFilter): Promise<number> {
        return this.prisma.productionRelation.count({ where });
    }
}
