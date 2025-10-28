import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { ProductionPlanModule } from './modules/production-plan/production-plan.module';
import { ProductModule } from './modules/product/product.module';
import { SupplyModule } from './modules/supply/supply.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ProductionPlanDetailModule } from './modules/production-plan-detail/production-plan-detail.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt.guard';
import { ProductionModule } from './modules/production/production.module';
import { ParticipantModule } from './modules/participant/participant.module';
import { CoordinatorModule } from './modules/coordinator/coordinator.module';
import { AgreementModule } from './modules/agreement/agreement.module';
import { ProductionRelationModule } from './modules/production-relation/production-relation.module';

@Module({
    imports: [
        UserModule,
        ProductModule,
        ProductionPlanModule,
        ParticipantModule,
        CoordinatorModule,
        CatalogModule,
        AuthModule,
        SupplyModule,
        ConfigModule.forRoot({ isGlobal: true }),
        ProductionPlanDetailModule,
        ProductionModule,
        AgreementModule,
        ProductionRelationModule,
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
