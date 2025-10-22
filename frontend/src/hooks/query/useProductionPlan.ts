import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ProductionPlanService } from '@/service/ProductionPlanService';

export function useProductionPlanMeta() {
    return useQuery({
        queryKey: ['production-plan'],
        queryFn: async () => {
            const data =
                await new ProductionPlanService().getActualityProductionPlan();
            if (!data) return null;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { catalogs, ...meta } = data;
            return meta;
        },
    });
}

export function useProductionPlan(page: number, limit: number) {
    return useQuery({
        queryKey: ['production-plan', page, limit],
        queryFn: async () => {
            const data =
                await new ProductionPlanService().getActualityProductionPlan({
                    offset: page * limit,
                    limit,
                });
            if (!data) return null;
            const { catalogs, ...meta } = data;
            return {
                ...meta,
                items: catalogs,
            };
        },
    });
}
