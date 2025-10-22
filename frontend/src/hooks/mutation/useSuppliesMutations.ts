import { useInvalidateMutation } from './useInvalidateMutation';
import type { createSupply, Supply, updateSupply } from '@/models/supply.ts';
import { SupplyService } from '@/service/SupplyService.ts';
import type { updateProduct } from '@/models/product.ts';

const service = new SupplyService();

export function useCreateSupply(onDone?: () => void) {
    return useInvalidateMutation<createSupply, Supply>({
        mutationFn: (dto) => service.createSupply(dto),
        invalidateKeys: [['supplies']],
        onSuccessCallback: onDone,
    });
}

export function useDeleteSupply(onDone?: () => void) {
    return useInvalidateMutation<number, Supply>({
        mutationFn: (id) => service.deleteSupply(id),
        invalidateKeys: [['supplies']],
        onSuccessCallback: onDone,
    });
}

export function useUpdateSupply(onDone?: () => void) {
    return useInvalidateMutation<{ id: number; dto: updateSupply }, Supply>({
        mutationFn: ({ id, dto }) => service.updateSupply(id, dto),
        invalidateKeys: [['supplies']],
        onSuccessCallback: onDone,
    });
}
