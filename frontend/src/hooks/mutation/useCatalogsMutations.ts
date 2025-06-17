import type { Catalog, createCatalog, updateCatalog } from '@/models/catalog';
import { useInvalidateMutation } from './useInvalidateMutation';
import { CatalogService } from '@/service/CatalogService';

const service = new CatalogService();

export function useCreateCatalog(onDone?: () => void) {
    return useInvalidateMutation<createCatalog, Catalog>({
        mutationFn: (data) => service.createCatalog(data),
        invalidateKeys: [['catalogs']],
        onSuccessCallback: onDone,
    });
}

export function useUpdateCatalog(onDone?: () => void) {
    return useInvalidateMutation<{ id: number; data: updateCatalog }, Catalog>({
        mutationFn: ({ id, data }) => service.updateCatalog(id, data),
        invalidateKeys: [['catalogs']],
        onSuccessCallback: onDone,
    });
}

export function useDeleteCatalog(onDone?: () => void) {
    return useInvalidateMutation<number, Catalog>({
        mutationFn: (id) => service.deleteCatalog(id),
        invalidateKeys: [['catalogs']],
        onSuccessCallback: onDone,
    });
}
