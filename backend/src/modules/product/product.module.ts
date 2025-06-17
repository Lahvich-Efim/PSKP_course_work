import { forwardRef, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { PRODUCT_REPOSITORY } from './product.interface';
import { PrismaModule } from '../prisma/prisma.module';
import { SharedModule } from '../../shared/services/shared.module';
import { CatalogModule } from '../catalog/catalog.module';

@Module({
    imports: [PrismaModule, forwardRef(() => CatalogModule), SharedModule],
    controllers: [ProductController],
    providers: [
        ProductService,
        {
            provide: PRODUCT_REPOSITORY,
            useClass: ProductRepository,
        },
    ],
    exports: [PRODUCT_REPOSITORY],
})
export class ProductModule {}
