import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UNIT_OF_WORK } from '../domain/tokens';
import { PrismaUnitOfWork } from './prisma/prisma.unit-of-work.service';
import { prismaRepositoryProviders } from './prisma/prisma.providers';

@Module({
    imports: [PrismaModule],
    providers: [
        {
            provide: UNIT_OF_WORK,
            useClass: PrismaUnitOfWork,
        },
        ...prismaRepositoryProviders,
    ],
    exports: [
        ...prismaRepositoryProviders.map((provider) => provider.provide),
        UNIT_OF_WORK,
    ],
})
export class InfrastructureModule {}
