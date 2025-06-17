import { ProductionPlan, StatusPlan } from './production-plan.entity';

export type CreateProductionPlan = Omit<ProductionPlan, 'id'>;
export type UpdateProductionPlan = Partial<ProductionPlan> & { id: number };

export const PRODUCTION_PLAN_REPOSITORY = 'IProductionPlanRepository';

export interface ProductionPlanFilter extends Partial<ProductionPlan> {
    OR?: ProductionPlanFilter[];
}

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
