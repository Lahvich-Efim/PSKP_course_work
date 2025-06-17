import {
    usePaginatedQuery,
    type PaginationParams,
} from './usePaginatedQuery.ts';
import type { Participant } from '@/models/participant.ts';
import { ParticipantService } from '@/service/PatricipantService.ts';

const service = new ParticipantService();

export function useParticipants(page?: number, limit?: number, enabled = true) {
    return usePaginatedQuery<PaginationParams, Participant>({
        queryKey: ['participants', page, limit],
        fetchFn: (p) => service.getParticipants(p),
        params: {
            offset: page,
            limit,
        },
        enabled,
    });
}
