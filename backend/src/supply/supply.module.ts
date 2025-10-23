import { Module } from '@nestjs/common';
import { SupplyController } from './supply.controller';
import { SupplyService } from './supply.service';
import { SharedModule } from '../shared/services/shared.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { CatalogModule } from '../catalog/catalog.module';

@Module({
    imports: [InfrastructureModule, SharedModule, CatalogModule],
    controllers: [SupplyController],
    providers: [SupplyService],
})
export class SupplyModule {}
