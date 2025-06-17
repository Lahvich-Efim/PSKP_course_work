import { ProductionPlanDetail } from './production-plan-detail.entity';
import { ProductionPlanFilter } from '../production_plan/production-plan.interface';

import { SupplyFilter } from '../supply/supply.interface';

export type CreateProductionPlanDetail = Omit<ProductionPlanDetail, 'id'>;
export type UpdateProductionPlanDetail = Partial<
    Omit<ProductionPlanDetail, 'plan_id'>
> & { id: number };

export const PRODUCTION_PLAN_DETAIL_REPOSITORY =
    'IProductionPlanDetailRepository';

export interface ProductionPlanDetailFilter
    extends Partial<ProductionPlanDetail> {
    OR?: ProductionPlanDetailFilter[];
    plan?: ProductionPlanFilter;
    supply?: SupplyFilter;
}

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

    create(product: CreateProductionPlanDetail): Promise<ProductionPlanDetail>;

    update(product: UpdateProductionPlanDetail): Promise<ProductionPlanDetail>;

    delete(productId: number): Promise<ProductionPlanDetail>;

    count(where?: ProductionPlanDetailFilter): Promise<number>;
}
