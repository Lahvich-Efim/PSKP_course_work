import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CommonModule } from '../../common/common.module';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';

@Module({
    imports: [InfrastructureModule, CommonModule],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
