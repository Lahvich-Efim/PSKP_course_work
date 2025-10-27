import { Module } from '@nestjs/common';
import { ProductionPlanDetailService } from './production-plan-detail.service';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';

@Module({
    imports: [InfrastructureModule],
    providers: [ProductionPlanDetailService],
})
export class ProductionPlanDetailModule {}
