import { Participant } from '../entities/participant.entity';

import { User } from '../entities/user.entity';
import { EntityFilter } from '../../application/interfaces/filter.interface';

export type CreateParticipant = Participant;
export type UpdateParticipant = Partial<Participant> & { id: number };

interface ParticipantRelations {
    user: User;
}

export type ParticipantFilter = EntityFilter<Participant, ParticipantRelations>;

export interface IParticipantRepository {
    findOneById(participantId: number): Promise<Participant | null>;

    findMany(
        where?: ParticipantFilter,
        offset?: number,
        limit?: number,
    ): Promise<Participant[]>;

    create(participant: CreateParticipant): Promise<Participant>;

    update(participant: UpdateParticipant): Promise<Participant>;

    delete(participantId: number): Promise<Participant>;

    count(where?: ParticipantFilter): Promise<number>;
}
