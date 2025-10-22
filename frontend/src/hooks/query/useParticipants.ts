import {
    usePaginatedQuery,
    type PaginationParams,
} from './usePaginatedQuery.ts';
import type { Participant } from '@/models/participant.ts';
import { ParticipantService } from '@/service/PatricipantService.ts';
import { useQuery } from '@tanstack/react-query';

export function useParticipants(page?: number, limit?: number, enabled = true) {
    return usePaginatedQuery<PaginationParams, Participant>({
        queryKey: ['participants', page, limit],
        fetchFn: (p) => new ParticipantService().getParticipants(p),
        params: {
            offset: page,
            limit,
        },
        enabled,
    });
}

export function useParticipant(id: number, enabled = true) {
    const { data, isLoading, isError, isSuccess, refetch } = useQuery({
        queryKey: ['participant'],
        queryFn: () => new ParticipantService().getParticipant(id),
        enabled,
    });

    return {
        data,
        isLoading,
        isError,
        isSuccess,
        refetch,
    };
}
