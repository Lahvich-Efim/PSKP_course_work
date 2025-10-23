import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { SharedModule } from '../shared/services/shared.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
    imports: [InfrastructureModule, SharedModule],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
