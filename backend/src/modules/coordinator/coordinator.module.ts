import { Module } from '@nestjs/common';
import { CoordinatorService } from './coordinator.service';
import { CoordinatorController } from './coordinator.controller';
import { CoordinatorRepository } from './coordinator.repository';
import { COORDINATOR_REPOSITORY } from './coordinator.interface';
import { PrismaModule } from '../prisma/prisma.module';

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
