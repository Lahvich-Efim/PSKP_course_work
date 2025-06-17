import type {
    createProductionPlan,
    ProductionPlan,
} from '@/models/production_plan';
import { ApiClient } from '@/api/ApiClient.ts';

export class ProductionPlanService extends ApiClient {
    async getActualityProductionPlan(params?: {
        offset?: number;
        limit?: number;
    }) {
        return this.get<ProductionPlan>('/production-plans', params);
    }

    async createProductionPlan(
        dto: createProductionPlan,
    ): Promise<ProductionPlan> {
        return this.post<ProductionPlan>('/production-plans', dto);
    }

    async calculateProductionPlan(): Promise<ProductionPlan> {
        return this.get<ProductionPlan>('/production-plans/calculate');
    }
}
