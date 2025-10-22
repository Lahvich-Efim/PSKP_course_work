import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { CatalogRepository } from './catalog.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { ParticipantModule } from '../participant/participant.module';
import { ProductModule } from '../product/product.module';
import { CATALOG_REPOSITORY } from './catalog.interface';
import { SharedModule } from '../../shared/services/shared.module';

@Module({
    imports: [PrismaModule, ParticipantModule, ProductModule, SharedModule],
    controllers: [CatalogController],
    providers: [
        CatalogService,
        {
            provide: CATALOG_REPOSITORY,
            useClass: CatalogRepository,
        },
    ],
    exports: [CATALOG_REPOSITORY, CatalogService],
})
export class CatalogModule {}
