import type { Catalog } from '@/models/catalog.ts';
import {
    type PaginationParams,
    usePaginatedQuery,
} from '@/hooks/query/usePaginatedQuery.ts';
import { CatalogService } from '@/service/CatalogService.ts';

const service = new CatalogService();

export function useCatalogs(page?: number, limit?: number, enabled = true) {
    return usePaginatedQuery<PaginationParams, Catalog>({
        queryKey: ['catalogs', page, limit],
        fetchFn: (p) => service.getAllActualityCatalogs(p),
        params: {
            offset: page,
            limit,
        },
        enabled,
    });
}
