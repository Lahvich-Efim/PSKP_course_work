import { Injectable } from '@nestjs/common';
import { Participant } from '../../../domain/entities/participant.entity';
import {
    IParticipantRepository,
    ParticipantFilter,
    CreateParticipant,
    UpdateParticipant,
} from '../../../domain/repositories/participant.interface';
import { BaseRepository } from './base.repository';

@Injectable()
export class ParticipantRepository
    extends BaseRepository
    implements IParticipantRepository
{
    create(participant: CreateParticipant): Promise<Participant> {
        return this.prisma.participant.create({
            data: participant,
        });
    }

    delete(participantId: number): Promise<Participant> {
        return this.prisma.participant.delete({
            where: { id: participantId },
        });
    }

    findMany(
        where?: ParticipantFilter,
        offset?: number,
        limit?: number,
    ): Promise<Participant[]> {
        return this.prisma.participant.findMany({
            where: where,
            skip: offset,
            take: limit,
        });
    }

    findOneById(participantId: number): Promise<Participant | null> {
        return this.prisma.participant.findUnique({
            where: { id: participantId },
        });
    }

    update(participant: UpdateParticipant): Promise<Participant> {
        const { id, ...participantData } = participant;
        return this.prisma.participant.update({
            where: { id },
            data: participantData,
        });
    }

    count(where?: ParticipantFilter): Promise<number> {
        return this.prisma.participant.count({ where });
    }
}
