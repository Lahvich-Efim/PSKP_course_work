import {
    useQuery,
    type QueryKey,
    keepPreviousData,
} from '@tanstack/react-query';

export interface Paginated<T> {
    count: number;
    items: T[];
}

export interface PaginationParams {
    offset?: number;
    limit?: number;
}

interface UsePaginatedQueryOptions<TParams, T> {
    queryKey: QueryKey;
    fetchFn: (params: TParams) => Promise<Paginated<T>>;
    params: TParams;
    enabled?: boolean;
}

export function usePaginatedQuery<TParams extends PaginationParams, T>({
    queryKey,
    fetchFn,
    params,
    enabled = true,
}: UsePaginatedQueryOptions<TParams, T>) {
    if (typeof params.offset === 'number' && typeof params.limit === 'number') {
        params.offset = params.offset * params.limit;
    }

    const { data, isLoading, isError, isSuccess, refetch } = useQuery({
        queryKey,
        queryFn: () => fetchFn(params),
        placeholderData: keepPreviousData,
        enabled,
    });

    return {
        data,
        items: data?.items ?? [],
        count: data?.count ?? 0,
        isLoading,
        isError,
        isSuccess,
        refetch,
    };
}
