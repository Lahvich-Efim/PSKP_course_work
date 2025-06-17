import {
    type PaginationParams,
    usePaginatedQuery,
} from '@/hooks/query/usePaginatedQuery.ts';
import { SupplyService } from '@/service/SupplyService.ts';
import type { Supply } from '@/models/supply.ts';

const service = new SupplyService();

export function useSupplies(page?: number, limit?: number, enabled = true) {
    return usePaginatedQuery<PaginationParams, Supply>({
        queryKey: ['supplies', page, limit],
        fetchFn: (p) => service.getAllActualitySupplies(p),
        params: {
            offset: page,
            limit,
        },
        enabled,
    });
}
