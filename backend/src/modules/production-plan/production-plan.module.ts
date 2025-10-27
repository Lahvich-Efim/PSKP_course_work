import { Module } from '@nestjs/common';
import { ProductionPlanController } from './production-plan.controller';
import { ProductionPlanService } from './production-plan.service';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';

@Module({
    imports: [InfrastructureModule],
    controllers: [ProductionPlanController],
    providers: [ProductionPlanService],
})
export class ProductionPlanModule {}
