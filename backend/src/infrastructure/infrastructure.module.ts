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
    UNIT_OF_WORK,
    USER_REPOSITORY,
} from '../core/interfaces/tokens';
import { ProductRepository } from './prisma/repositories/product.repository';
import { CatalogRepository } from './prisma/repositories/catalog.repository';
import { SupplyRepository } from './prisma/repositories/supply.repository';
import { UserRepository } from './prisma/repositories/user.repository';
import { ParticipantRepository } from './prisma/repositories/participant.repository';
import { CoordinatorRepository } from './prisma/repositories/coordinator.repository';
import { ProductionPlanRepository } from './prisma/repositories/production-plan.repository';
import { ProductionPlanDetailRepository } from './prisma/repositories/production-plan-detail.repository';
import { PrismaUnitOfWork } from './prisma/unit-of-work.service';

@Module({
    imports: [PrismaModule],
    providers: [
        InfrastructureService,
        {
            provide: UNIT_OF_WORK,
            useClass: PrismaUnitOfWork,
        },
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
        UNIT_OF_WORK,
    ],
})
export class InfrastructureModule {}
