import { Module } from '@nestjs/common';
import { ProductionRelationController } from './production-relation.controller';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { ProductionRelationService } from './production-relation.service';

@Module({
    imports: [InfrastructureModule],
    controllers: [ProductionRelationController],
    providers: [ProductionRelationService],
})
export class ProductionRelationModule {}
