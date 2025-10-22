import { Module } from '@nestjs/common';
import { ProductionPlanDetailService } from './production-plan-detail.service';
import { ProductionPlanDetailRepository } from './production-plan-detail.repository';
import { PRODUCTION_PLAN_DETAIL_REPOSITORY } from './production-plan-detail.interface';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [
        ProductionPlanDetailService,
        {
            provide: PRODUCTION_PLAN_DETAIL_REPOSITORY,
            useClass: ProductionPlanDetailRepository,
        },
    ],
    exports: [PRODUCTION_PLAN_DETAIL_REPOSITORY],
})
export class ProductionPlanDetailModule {}
