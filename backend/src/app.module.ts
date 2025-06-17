import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { ProductionPlanModule } from './modules/production_plan/production_plan.module';
import { ProductModule } from './modules/product/product.module';
import { AuthModule } from './modules/auth/auth.module';
import { SupplyModule } from './modules/supply/supply.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/quards/jwt.guard';
import { ProductionPlanDetailModule } from './modules/production_plan_detail/production_plan_detail.module';

@Module({
    imports: [
        PrismaModule,
        UserModule,
        ProductModule,
        ProductionPlanModule,
        CatalogModule,
        AuthModule,
        SupplyModule,
        ConfigModule.forRoot({ isGlobal: true }),
        ProductionPlanDetailModule,
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
