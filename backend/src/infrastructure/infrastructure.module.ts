import { Module } from '@nestjs/common';
import { InfrastructureService } from './infrastructure.service';
import { PrismaModule } from '../prisma/prisma.module';
import {
    CATALOG_REPOSITORY,
    COORDINATOR_REPOSITORY,
    PARTICIPANT_REPOSITORY,
    PRODUCT_REPOSITORY,
    PRODUCTION_PLAN_DETAIL_REPOSITORY,
    PRODUCTION_PLAN_REPOSITORY,
    SUPPLY_REPOSITORY,
    USER_REPOSITORY,
} from '../core/interfaces/tokens';
import { ProductRepository } from './repositories/product.repository';
import { CatalogRepository } from './repositories/catalog.repository';
import { SupplyRepository } from './repositories/supply.repository';
import { UserRepository } from './repositories/user.repository';
import { ParticipantRepository } from './repositories/participant.repository';
import { CoordinatorRepository } from './repositories/coordinator.repository';
import { ProductionPlanRepository } from './repositories/production-plan.repository';
import { ProductionPlanDetailRepository } from './repositories/production-plan-detail.repository';

@Module({
    imports: [PrismaModule],
    providers: [
        InfrastructureService,
        {
            provide: USER_REPOSITORY,
            useClass: UserRepository,
        },
        {
            provide: PARTICIPANT_REPOSITORY,
            useClass: ParticipantRepository,
        },
        {
            provide: COORDINATOR_REPOSITORY,
            useClass: CoordinatorRepository,
        },
        {
            provide: PRODUCT_REPOSITORY,
            useClass: ProductRepository,
        },
        {
            provide: CATALOG_REPOSITORY,
            useClass: CatalogRepository,
        },
        {
            provide: SUPPLY_REPOSITORY,
            useClass: SupplyRepository,
        },
        {
            provide: PRODUCTION_PLAN_REPOSITORY,
            useClass: ProductionPlanRepository,
        },
        {
            provide: PRODUCTION_PLAN_DETAIL_REPOSITORY,
            useClass: ProductionPlanDetailRepository,
        },
    ],
    exports: [
        InfrastructureService,
        USER_REPOSITORY,
        PARTICIPANT_REPOSITORY,
        COORDINATOR_REPOSITORY,
        PRODUCT_REPOSITORY,
        CATALOG_REPOSITORY,
        SUPPLY_REPOSITORY,
        PRODUCTION_PLAN_REPOSITORY,
        PRODUCTION_PLAN_DETAIL_REPOSITORY,
    ],
})
export class InfrastructureModule {}
