import { Module } from '@nestjs/common';
import { ProductionPlanController } from './production-plan.controller';
import { ProductionPlanService } from './production-plan.service';
import { ProductionPlanRepository } from './production-plan.repository';
import { PRODUCTION_PLAN_REPOSITORY } from './production-plan.interface';
import { PrismaModule } from '../prisma/prisma.module';
import { CatalogModule } from '../catalog/catalog.module';
import { ProductModule } from '../product/product.module';
import { SupplyModule } from '../supply/supply.module';
import { ProductionPlanDetailModule } from '../production_plan_detail/production_plan_detail.module';
import { ParticipantModule } from '../participant/participant.module';

@Module({
    imports: [
        PrismaModule,
        CatalogModule,
        ProductModule,
        SupplyModule,
        ProductionPlanDetailModule,
        ParticipantModule,
    ],
    controllers: [ProductionPlanController],
    providers: [
        ProductionPlanService,
        {
            provide: PRODUCTION_PLAN_REPOSITORY,
            useClass: ProductionPlanRepository,
        },
    ],
})
export class ProductionPlanModule {}
