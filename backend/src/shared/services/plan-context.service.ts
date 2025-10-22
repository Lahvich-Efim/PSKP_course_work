import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import {
    IProductionPlanRepository,
    PRODUCTION_PLAN_REPOSITORY,
} from '../../modules/production_plan/production-plan.interface';
import { ProductionPlan } from '../../modules/production_plan/production-plan.entity';
import { ProductionPlanException } from '../exceptions/exceptions';

@Injectable()
export class PlanContextService {
    constructor(
        @Inject(PRODUCTION_PLAN_REPOSITORY)
        private readonly planRepo: IProductionPlanRepository,
    ) {}

    async getCurrentPlan(): Promise<ProductionPlan> {
        const plan = await this.planRepo.getLastProductionPlan();
        if (!plan)
            throw new ProductionPlanException(
                'План производства ещё не создан',
            );
        return plan;
    }

    async ensurePlanIsOpen(): Promise<ProductionPlan> {
        const plan = await this.getCurrentPlan();
        if (plan.status !== 'OPEN') {
            throw new ProductionPlanException('План закрыт для изменений');
        }
        return plan;
    }

    async getArchivedPlanIds(): Promise<number[]> {
        const archivedPlans = await this.planRepo.findMany({
            status: 'ARCHIVED',
        });
        return archivedPlans.map((p) => p.id);
    }
}
