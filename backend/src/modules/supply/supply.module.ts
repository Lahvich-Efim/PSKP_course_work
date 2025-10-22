import { Module } from '@nestjs/common';
import { SupplyController } from './supply.controller';
import { SupplyService } from './supply.service';
import { SupplyRepository } from './supply.repository';
import { SUPPLY_REPOSITORY } from './supply.interface';
import { PrismaModule } from '../prisma/prisma.module';
import { CatalogModule } from '../catalog/catalog.module';
import { SharedModule } from '../../shared/services/shared.module';

@Module({
    imports: [PrismaModule, CatalogModule, SharedModule],
    controllers: [SupplyController],
    providers: [
        SupplyService,
        {
            provide: SUPPLY_REPOSITORY,
            useClass: SupplyRepository,
        },
    ],
    exports: [SUPPLY_REPOSITORY],
})
export class SupplyModule {}
