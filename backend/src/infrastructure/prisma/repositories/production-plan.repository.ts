import { Injectable } from '@nestjs/common';
import {
    CreateProductionPlan,
    IProductionPlanRepository,
    ProductionPlanFilter,
    UpdateProductionPlan,
} from '../../../domain/repositories/production-plan.interface';
import {
    ProductionPlan,
    StatusPlan,
} from '../../../domain/entities/production-plan.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class ProductionPlanRepository
    extends BaseRepository
    implements IProductionPlanRepository
{
    create(productionPlan: CreateProductionPlan): Promise<ProductionPlan> {
        return this.prisma.productionPlan.create({
            data: productionPlan,
        });
    }

    findMany(
        where: ProductionPlanFilter,
        offset?: number,
        limit?: number,
    ): Promise<ProductionPlan[]> {
        return this.prisma.productionPlan.findMany({
            where,
            skip: offset,
            take: limit,
        });
    }

    findOne(where: ProductionPlanFilter): Promise<ProductionPlan | null> {
        return this.prisma.productionPlan.findFirst({
            where,
        });
    }

    getLastProductionPlan(): Promise<ProductionPlan | null> {
        return this.prisma.productionPlan.findFirst({
            orderBy: { id: 'desc' },
        });
    }

    getLastPlanByStatus(status: StatusPlan): Promise<ProductionPlan | null> {
        return this.prisma.productionPlan.findFirst({
            where: { status },
            orderBy: { id: 'desc' },
        });
    }

    update(productionPlan: UpdateProductionPlan): Promise<ProductionPlan> {
        const { id, ...productionPlanData } = productionPlan;
        return this.prisma.productionPlan.update({
            where: {
                id,
            },
            data: {
                ...productionPlanData,
            },
        });
    }

    findOneById(planProductionId: number): Promise<ProductionPlan | null> {
        return this.prisma.productionPlan.findFirst({
            where: {
                id: planProductionId,
            },
        });
    }

    count(where?: ProductionPlanFilter): Promise<number> {
        return this.prisma.productionPlan.count({ where });
    }
}
