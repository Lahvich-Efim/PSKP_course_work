import { ICatalogRepository } from './catalog.interface';
import { ISupplyRepository } from './supply.interface';
import { IProductionPlanRepository } from './production-plan.interface';
import { IParticipantRepository } from './participant.interface';
import { ICoordinatorRepository } from './coordinator.interface';
import { IProductRepository } from './product.interface';
import { IUserRepository } from './user.interface';
import { ProductionPlanDetailRepository } from '../../infrastructure/prisma/repositories/production-plan-detail.repository';

export interface IUnitOfWork {
    runInTransaction<T>(
        fn: (tx: ITransactionalRepositories) => Promise<T>,
    ): Promise<T>;
}

export interface ITransactionalRepositories {
    catalogRepository: ICatalogRepository;
    supplyRepository: ISupplyRepository;
    productionPlanRepository: IProductionPlanRepository;
    productionPlanDetailRepository: ProductionPlanDetailRepository;
    participantRepository: IParticipantRepository;
    coordinatorRepository: ICoordinatorRepository;
    productRepository: IProductRepository;
    userRepository: IUserRepository;
}
