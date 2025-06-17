import { Module } from '@nestjs/common';
import { PlanContextService } from './plan-context.service';
import { PRODUCTION_PLAN_REPOSITORY } from '../../modules/production_plan/production-plan.interface';
import { ProductionPlanRepository } from '../../modules/production_plan/production-plan.repository';

@Module({
    providers: [
        PlanContextService,
        {
            provide: PRODUCTION_PLAN_REPOSITORY,
            useClass: ProductionPlanRepository,
        },
    ],
    exports: [PlanContextService],
})
export class SharedModule {}
