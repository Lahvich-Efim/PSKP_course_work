import { ApiClient } from '@/api/ApiClient.ts';
import type {
    Participant,
    createParticipant,
    updateParticipant,
} from '@/models/participant.ts';
import type { Paginated } from '@/hooks/query/usePaginatedQuery.ts';

export class ParticipantService extends ApiClient {
    async createParticipant(dto: createParticipant): Promise<Participant> {
        return this.post<Participant>('/participants', dto);
    }

    async getParticipants(params: {
        limit?: number;
        offset?: number;
    }): Promise<Paginated<Participant>> {
        return this.get<Paginated<Participant>>('/participants', params);
    }

    async getParticipant(id: number): Promise<Participant> {
        return this.get<Participant>(`/participants/${id}`);
    }

    async deleteParticipant(id: number): Promise<Participant> {
        return this.delete<Participant>(`/participants/${id}`);
    }

    async updateParticipant(
        id: number,
        data: updateParticipant,
    ): Promise<Participant> {
        return this.patch<Participant>(`/participants/${id}`, data);
    }
}
