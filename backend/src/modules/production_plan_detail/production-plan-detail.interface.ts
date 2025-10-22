import { ProductionPlanDetail } from './production-plan-detail.entity';
import { ProductionPlan } from '../production_plan/production-plan.entity';
import { Supply } from '../supply/supply.entity';

import { EntityFilter } from '../../shared/interfaces/filter.interface';

export type CreateProductionPlanDetail = Omit<ProductionPlanDetail, 'id'>;
export type UpdateProductionPlanDetail = Partial<
    Omit<ProductionPlanDetail, 'plan_id'>
> & { id: number };

export const PRODUCTION_PLAN_DETAIL_REPOSITORY =
    'IProductionPlanDetailRepository';

interface ProductionPlanDetailRelations {
    plan: ProductionPlan;
    supply: Supply;
}

export type ProductionPlanDetailFilter = EntityFilter<
    ProductionPlanDetail,
    ProductionPlanDetailRelations
>;

export interface IProductionPlanDetailRepository {
    findOneById(
        productionPlanDetailId: number,
        where?: ProductionPlanDetailFilter,
    ): Promise<ProductionPlanDetail | null>;

    findOne(
        where: ProductionPlanDetailFilter,
    ): Promise<ProductionPlanDetail | null>;

    findMany(
        where?: ProductionPlanDetailFilter,
        offset?: number,
        limit?: number,
    ): Promise<ProductionPlanDetail[]>;

    create(
        productionPlanDetailId: CreateProductionPlanDetail,
    ): Promise<ProductionPlanDetail>;

    deleteMany(where: ProductionPlanDetailFilter): Promise<number>;

    update(
        productionPlanDetailId: UpdateProductionPlanDetail,
    ): Promise<ProductionPlanDetail>;

    delete(productionPlanDetailId: number): Promise<ProductionPlanDetail>;

    count(where?: ProductionPlanDetailFilter): Promise<number>;
}
