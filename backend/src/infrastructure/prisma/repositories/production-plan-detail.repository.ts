import { Injectable } from '@nestjs/common';
import {
    CreateProductionPlanDetail,
    IProductionPlanDetailRepository,
    ProductionPlanDetailFilter,
    UpdateProductionPlanDetail,
} from '../../../core/interfaces/production-plan-detail.interface';
import { ProductionPlanDetail } from '../../../core/entities/production-plan-detail.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class ProductionPlanDetailRepository
    extends BaseRepository
    implements IProductionPlanDetailRepository
{
    async findOneById(
        productionPlanDetailId: number,
        where?: ProductionPlanDetailFilter,
    ): Promise<ProductionPlanDetail | null> {
        return this.prisma.productionPlanDetail.findFirst({
            where: {
                id: productionPlanDetailId,
                ...where,
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
