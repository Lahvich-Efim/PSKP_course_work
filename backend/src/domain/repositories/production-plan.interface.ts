import { ProductionPlan, StatusPlan } from '../entities/production-plan.entity';
import { EntityFilter } from '../../application/interfaces/filter.interface';

export type CreateProductionPlan = Omit<ProductionPlan, 'id'>;
export type UpdateProductionPlan = Partial<ProductionPlan> & { id: number };

export type ProductionPlanFilter = EntityFilter<ProductionPlan>;

export interface IProductionPlanRepository {
    findOneById(planProductionId: number): Promise<ProductionPlan | null>;

    findOne(where: ProductionPlanFilter): Promise<ProductionPlan | null>;

    getLastProductionPlan(): Promise<ProductionPlan | null>;

    getLastPlanByStatus(status: StatusPlan): Promise<ProductionPlan | null>;

    findMany(
        where: ProductionPlanFilter,
        offset?: number,
        limit?: number,
    ): Promise<ProductionPlan[]>;

    create(productionPlan: CreateProductionPlan): Promise<ProductionPlan>;

    update(productionPlan: UpdateProductionPlan): Promise<ProductionPlan>;

    count(where?: ProductionPlanFilter): Promise<number>;
}
