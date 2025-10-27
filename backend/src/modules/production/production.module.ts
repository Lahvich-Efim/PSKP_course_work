import { Module } from '@nestjs/common';
import { ProductionController } from './production.controller';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { ProductionService } from './production.service';

@Module({
    imports: [InfrastructureModule],
    controllers: [ProductionController],
    providers: [ProductionService],
})
export class ProductionModule {}
