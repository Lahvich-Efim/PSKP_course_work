import { CatalogRepository } from './repositories/catalog.repository';
import { SupplyRepository } from './repositories/supply.repository';
import {
    ITransactionalRepositories,
    IUnitOfWork,
} from '../../application/interfaces/unit-of-work.interface';
import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { ProductRepository } from './repositories/product.repository';
import { ProductionPlanRepository } from './repositories/production-plan.repository';
import { ProductionPlanDetailRepository } from './repositories/production-plan-detail.repository';
import { CoordinatorRepository } from './repositories/coordinator.repository';
import { ParticipantRepository } from './repositories/participant.repository';
import { Prisma } from '@prisma/client';
import { ProductionRepository } from './repositories/production.repository';
import { AgreementRepository } from './repositories/agreement.repository';

@Injectable()
export class PrismaUnitOfWork implements IUnitOfWork {
    constructor(private readonly prisma: PrismaService) {}

    async runInTransaction<T>(
        fn: (tx: ITransactionalRepositories) => Promise<T>,
    ): Promise<T> {
        return this.prisma.$transaction(
            async (prismaTx: Prisma.TransactionClient) => {
                return fn({
                    catalogRepository:
                        CatalogRepository.withTransaction(prismaTx),
                    userRepository: UserRepository.withTransaction(prismaTx),
                    supplyRepository:
                        SupplyRepository.withTransaction(prismaTx),
                    participantRepository:
                        ParticipantRepository.withTransaction(prismaTx),
                    coordinatorRepository:
                        CoordinatorRepository.withTransaction(prismaTx),
                    productRepository:
                        ProductRepository.withTransaction(prismaTx),
                    productionPlanRepository:
                        ProductionPlanRepository.withTransaction(prismaTx),
                    productionPlanDetailRepository:
                        ProductionPlanDetailRepository.withTransaction(
                            prismaTx,
                        ),
                    productionRepository:
                        ProductionRepository.withTransaction(prismaTx),
                    agreementRepository:
                        AgreementRepository.withTransaction(prismaTx),
                });
            },
        );
    }
}
