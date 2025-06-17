import { Participant } from './participant.entity';

import { UserFilter } from '../users/user.interface';

export type CreateParticipant = Participant;
export type UpdateParticipant = Partial<Participant> & { id: number };

export const PARTICIPANT_REPOSITORY = 'IParticipantRepository';

export interface ParticipantFilter extends Partial<Participant> {
    OR?: ParticipantFilter[];
    user?: UserFilter;
}

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
