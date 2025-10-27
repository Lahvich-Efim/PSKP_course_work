import { Injectable } from '@nestjs/common';
import {
    CreateProductionPlanDetail,
    IProductionPlanDetailRepository,
    ProductionPlanDetailFilter,
    UpdateProductionPlanDetail,
} from '../../../domain/repositories/production-plan-detail.interface';
import { ProductionPlanDetail } from '../../../domain/entities/production-plan-detail.entity';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma.service';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class ProductionPlanDetailRepository
    extends BaseRepository
    implements IProductionPlanDetailRepository
{
    constructor(protected readonly prisma: PrismaService) {
        super(prisma);
    }

    static withTransaction(tx: PrismaClient | Prisma.TransactionClient) {
        return new ProductionPlanDetailRepository(
            tx as unknown as PrismaService,
        );
    }

    async findOneById(
        productionPlanDetailId: number,
    ): Promise<ProductionPlanDetail | null> {
        return this.prisma.productionPlanDetail.findUnique({
            where: {
                id: productionPlanDetailId,
            },
        });
    }

    async findOne(
        where: ProductionPlanDetailFilter,
    ): Promise<ProductionPlanDetail | null> {
        return this.prisma.productionPlanDetail.findFirst({
            where,
        });
    }

    async findMany(
        where?: ProductionPlanDetailFilter,
        offset?: number,
        limit?: number,
    ): Promise<ProductionPlanDetail[]> {
        return this.prisma.productionPlanDetail.findMany({
            where,
            skip: offset,
            take: limit,
        });
    }

    async create(
        productionPlanDetail: CreateProductionPlanDetail,
    ): Promise<ProductionPlanDetail> {
        return this.prisma.productionPlanDetail.create({
            data: productionPlanDetail,
        });
    }

    async update(
        productionPlanDetail: UpdateProductionPlanDetail,
    ): Promise<ProductionPlanDetail> {
        const { id, ...data } = productionPlanDetail;
        return this.prisma.productionPlanDetail.update({
            where: { id },
            data,
        });
    }

    async delete(
        productionPlanDetailId: number,
    ): Promise<ProductionPlanDetail> {
        return this.prisma.productionPlanDetail.delete({
            where: { id: productionPlanDetailId },
        });
    }

    async count(where?: ProductionPlanDetailFilter): Promise<number> {
        return this.prisma.productionPlanDetail.count({
            where,
        });
    }

    async deleteMany(where?: ProductionPlanDetailFilter): Promise<number> {
        const result = await this.prisma.productionPlanDetail.deleteMany({
            where,
        });
        return result.count;
    }
}
