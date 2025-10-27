import { ICatalogRepository } from '../../domain/repositories/catalog.interface';
import { ISupplyRepository } from '../../domain/repositories/supply.interface';
import { IProductionPlanRepository } from '../../domain/repositories/production-plan.interface';
import { IParticipantRepository } from '../../domain/repositories/participant.interface';
import { ICoordinatorRepository } from '../../domain/repositories/coordinator.interface';
import { IProductRepository } from '../../domain/repositories/product.interface';
import { IUserRepository } from '../../domain/repositories/user.interface';
import { IProductionPlanDetailRepository } from '../../domain/repositories/production-plan-detail.interface';
import { IProductionRepository } from '../../domain/repositories/production.interface';
import { IAgreementRepository } from '../../domain/repositories/agreement.interface';
import { IProductionRelationRepository } from '../../domain/repositories/production-relation.interface';

export interface IUnitOfWork {
    runInTransaction<T>(
        fn: (tx: ITransactionalRepositories) => Promise<T>,
    ): Promise<T>;
}

export interface ITransactionalRepositories {
    catalogRepository: ICatalogRepository;
    supplyRepository: ISupplyRepository;
    productionPlanRepository: IProductionPlanRepository;
    productionPlanDetailRepository: IProductionPlanDetailRepository;
    participantRepository: IParticipantRepository;
    coordinatorRepository: ICoordinatorRepository;
    productRepository: IProductRepository;
    userRepository: IUserRepository;
    productionRepository: IProductionRepository;
    agreementRepository: IAgreementRepository;
    productionRelationRepository: IProductionRelationRepository;
}
