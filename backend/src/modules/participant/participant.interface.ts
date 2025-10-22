import { Participant } from './participant.entity';

import { User } from '../users/user.entity';
import { EntityFilter } from '../../shared/interfaces/filter.interface';

export type CreateParticipant = Participant;
export type UpdateParticipant = Partial<Participant> & { id: number };

export const PARTICIPANT_REPOSITORY = 'IParticipantRepository';

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
