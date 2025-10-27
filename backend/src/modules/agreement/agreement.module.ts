import { Module } from '@nestjs/common';
import { AgreementService } from './agreement.service';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { AgreementController } from './agreement.controller';

@Module({
    imports: [InfrastructureModule],
    providers: [AgreementService],
    controllers: [AgreementController],
})
export class AgreementModule {}
