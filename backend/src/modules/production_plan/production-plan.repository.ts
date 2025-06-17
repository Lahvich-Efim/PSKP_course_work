import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    CreateProductionPlan,
    IProductionPlanRepository,
    ProductionPlanFilter,
    UpdateProductionPlan,
} from './production-plan.interface';
import { ProductionPlan, StatusPlan } from './production-plan.entity';

@Injectable()
export class ProductionPlanRepository implements IProductionPlanRepository {
    constructor(private readonly prisma: PrismaService) {}

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
