import { Module } from '@nestjs/common';
import { CoordinatorService } from './coordinator.service';
import { CoordinatorController } from './coordinator.controller';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';

@Module({
    imports: [InfrastructureModule],
    controllers: [CoordinatorController],
    providers: [CoordinatorService],
})
export class CoordinatorModule {}
