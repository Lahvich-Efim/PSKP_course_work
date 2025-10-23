import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';

@Module({
    controllers: [ParticipantController],
    imports: [InfrastructureModule],
    providers: [ParticipantService],
})
export class ParticipantModule {}
