import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    IParticipantRepository,
    ParticipantFilter,
} from './participant.interface';
import { Participant } from './participant.entity';
import { CreateParticipant, UpdateParticipant } from './participant.interface';

@Injectable()
export class ParticipantRepository implements IParticipantRepository {
    constructor(private readonly prisma: PrismaService) {}

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
