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

@Injectable()
export class PrismaUnitOfWork implements IUnitOfWork {
    constructor(private readonly prisma: PrismaService) {}

    async runInTransaction<T>(
        fn: (tx: ITransactionalRepositories) => Promise<T>,
    ): Promise<T> {
        return this.prisma.$transaction(
            async (prismaTx: Prisma.TransactionClient) => {
                return fn({
                    catalogRepository: new CatalogRepository(prismaTx),
                    userRepository: new UserRepository(prismaTx),
                    supplyRepository: new SupplyRepository(prismaTx),
                    participantRepository: new ParticipantRepository(prismaTx),
                    coordinatorRepository: new CoordinatorRepository(prismaTx),
                    productRepository: new ProductRepository(prismaTx),
                    productionPlanRepository: new ProductionPlanRepository(
                        prismaTx,
                    ),
                    productionPlanDetailRepository:
                        new ProductionPlanDetailRepository(prismaTx),
                });
            },
        );
    }
}
