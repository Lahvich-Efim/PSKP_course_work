import { ProductService } from '@/service/ProductService.ts';
import type { createProduct, updateProduct } from '@/models/product.ts';
import type { Product } from '@/models/product.ts';
import { useInvalidateMutation } from '@/hooks/mutation/useInvalidateMutation.ts';

export function useCreateProduct(onDone?: () => void) {
    return useInvalidateMutation<createProduct, Product>({
        mutationFn: (dto) => new ProductService().createProduct(dto),
        invalidateKeys: [['products']],
        onSuccessCallback: onDone,
    });
}

export function useUpdateProduct(onDone?: () => void) {
    return useInvalidateMutation<{ id: number; dto: updateProduct }, Product>({
        mutationFn: ({ id, dto }) =>
            new ProductService().updateProduct(id, dto),
        invalidateKeys: [['products']],
        onSuccessCallback: onDone,
    });
}

export function useDeleteProduct(onDone?: () => void) {
    return useInvalidateMutation<number, Product>({
        mutationFn: (id) => new ProductService().deleteProduct(id),
        invalidateKeys: [['products']],
        onSuccessCallback: onDone,
    });
}
