import { usePaginatedQuery } from '@/hooks/query/usePaginatedQuery.ts';
import type { Product } from '@/models/product.ts';
import { ProductService } from '@/service/ProductService.ts';

export function useProducts(
    page?: number,
    limit?: number,
    enabled: boolean = true,
) {
    return usePaginatedQuery<{ offset?: number; limit?: number }, Product>({
        queryKey: ['products', page, limit],
        fetchFn: ({ offset, limit }) =>
            new ProductService().getAllProducts({ offset, limit }),
        params: { offset: page, limit },
        enabled,
    });
}
