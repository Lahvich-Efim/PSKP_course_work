import { Module } from '@nestjs/common';
import { CoordinatorService } from './coordinator.service';
import { CoordinatorController } from './coordinator.controller';
import { CoordinatorRepository } from '../infrastructure/repositories/coordinator.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { COORDINATOR_REPOSITORY } from '../core/interfaces/tokens';

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
