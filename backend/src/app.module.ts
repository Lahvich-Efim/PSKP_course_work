import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { ProductionPlanModule } from './modules/production_plan/production_plan.module';
import { ProductModule } from './modules/product/product.module';
import { SupplyModule } from './modules/supply/supply.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ProductionPlanDetailModule } from './modules/production_plan_detail/production_plan_detail.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt.guard';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

@Module({
    imports: [
        UserModule,
        ProductModule,
        ProductionPlanModule,
        CatalogModule,
        AuthModule,
        SupplyModule,
        ConfigModule.forRoot({ isGlobal: true }),
        ProductionPlanDetailModule,
        InfrastructureModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
