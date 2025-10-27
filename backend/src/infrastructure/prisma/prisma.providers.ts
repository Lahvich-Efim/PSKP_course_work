import { ProductRepository } from './repositories/product.repository';
import { CatalogRepository } from './repositories/catalog.repository';
import { SupplyRepository } from './repositories/supply.repository';
import { UserRepository } from './repositories/user.repository';
import { ParticipantRepository } from './repositories/participant.repository';
import { CoordinatorRepository } from './repositories/coordinator.repository';
import { ProductionPlanRepository } from './repositories/production-plan.repository';
import { ProductionPlanDetailRepository } from './repositories/production-plan-detail.repository';
import { ProductionRepository } from './repositories/production.repository';
import {
    AGREEMENT_REPOSITORY,
    CATALOG_REPOSITORY,
    COORDINATOR_REPOSITORY,
    PARTICIPANT_REPOSITORY,
    PRODUCT_REPOSITORY,
    PRODUCTION_PLAN_DETAIL_REPOSITORY,
    PRODUCTION_PLAN_REPOSITORY,
    PRODUCTION_REPOSITORY,
    SUPPLY_REPOSITORY,
    USER_REPOSITORY,
} from '../../domain/tokens';
import { AgreementRepository } from './repositories/agreement.repository';

export const prismaRepositoryProviders = [
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
    {
        provide: PRODUCTION_REPOSITORY,
        useClass: ProductionRepository,
    },
    {
        provide: AGREEMENT_REPOSITORY,
        useClass: AgreementRepository,
    },
];
