import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { ParticipantRepository } from './participant.repository';
import { PARTICIPANT_REPOSITORY } from './participant.interface';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../users/user.module';

@Module({
    imports: [PrismaModule, UserModule],
    controllers: [ParticipantController],
    providers: [
        ParticipantService,
        {
            provide: PARTICIPANT_REPOSITORY,
            useClass: ParticipantRepository,
        },
    ],
    exports: [PARTICIPANT_REPOSITORY],
})
export class ParticipantModule {}
