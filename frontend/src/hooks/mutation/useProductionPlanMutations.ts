import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { createProductionPlan } from '@/models/production_plan.ts';
import { ProductionPlanService } from '@/service/ProductionPlanService.ts';

export function useCreateProductionPlan() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (dto: createProductionPlan) =>
            new ProductionPlanService().createProductionPlan(dto),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['production-plan-meta'] });
            qc.invalidateQueries({ queryKey: ['production-plan-catalogs'] });
        },
    });
}

export function useCalculateProductionPlan() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => new ProductionPlanService().calculateProductionPlan(),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['production-plan-meta'] });
            qc.invalidateQueries({ queryKey: ['production-plan-catalogs'] });
        },
    });
}
