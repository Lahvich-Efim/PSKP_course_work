import { Module } from '@nestjs/common';
import { CoordinatorService } from './coordinator.service';
import { CoordinatorController } from './coordinator.controller';
import { CoordinatorRepository } from '../../infrastructure/prisma/repositories/coordinator.repository';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { COORDINATOR_REPOSITORY } from '../../domain/tokens';

@Module({
    imports: [PrismaModule],
    controllers: [CoordinatorController],
    providers: [
        CoordinatorService,
        {
            provide: COORDINATOR_REPOSITORY,
            useClass: CoordinatorRepository,
        },
    ],
    exports: [COORDINATOR_REPOSITORY],
})
export class CoordinatorModule {}
