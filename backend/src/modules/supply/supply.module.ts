import { Module } from '@nestjs/common';
import { SupplyController } from './supply.controller';
import { SupplyService } from './supply.service';
import { CommonModule } from '../../common/common.module';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { CatalogModule } from '../catalog/catalog.module';

@Module({
    imports: [InfrastructureModule, CommonModule, CatalogModule],
    controllers: [SupplyController],
    providers: [SupplyService],
})
export class SupplyModule {}
