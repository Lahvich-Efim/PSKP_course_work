import { Module } from '@nestjs/common';
import { PlanContextService } from '../infrastructure/plan-context.service';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
    imports: [InfrastructureModule],
    providers: [PlanContextService],
    exports: [PlanContextService],
})
export class CommonModule {}
