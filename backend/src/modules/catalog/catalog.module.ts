import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { CommonModule } from '../../common/common.module';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';

@Module({
    imports: [InfrastructureModule, CommonModule],
    controllers: [CatalogController],
    providers: [CatalogService],
    exports: [CatalogService],
})
export class CatalogModule {}
