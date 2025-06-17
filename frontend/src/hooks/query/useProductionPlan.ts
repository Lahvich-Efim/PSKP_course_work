import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ProductionPlanService } from '@/service/ProductionPlanService';

export function useProductionPlanMeta() {
    return useQuery({
        queryKey: ['production-plan-meta'],
        queryFn: async () => {
            const data =
                await new ProductionPlanService().getActualityProductionPlan();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { catalogs, ...meta } = data;
            return meta;
        },
    });
}

export function useProductionPlanCatalogs(page: number, limit: number) {
    return useQuery({
        queryKey: ['production-plan-catalogs', page, limit],
        queryFn: async () => {
            const data =
                await new ProductionPlanService().getActualityProductionPlan({
                    offset: page * limit,
                    limit,
                });
            return {
                items: data.catalogs,
                count: data.count,
            };
        },
        placeholderData: keepPreviousData,
    });
}
