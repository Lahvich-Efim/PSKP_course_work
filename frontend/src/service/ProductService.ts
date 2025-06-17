import { ApiClient } from '@/api/ApiClient.ts';
import type {
    Product,
    createProduct,
    updateProduct,
} from '@/models/product.ts';
import type { Paginated } from '@/hooks/query/usePaginatedQuery.ts';

export class ProductService extends ApiClient {
    async getAllProducts(params: {
        offset?: number;
        limit?: number;
    }): Promise<Paginated<Product>> {
        return this.get<Paginated<Product>>('/products', params);
    }

    async getProduct(id: number): Promise<Product> {
        return this.get<Product>(`/products/${id}`);
    }

    async createProduct(dto: createProduct): Promise<Product> {
        return this.post<Product>('/products', dto);
    }

    async updateProduct(id: number, dto: updateProduct): Promise<Product> {
        return this.patch<Product>(`/products/${id}`, dto);
    }

    async deleteProduct(id: number): Promise<Product> {
        return this.delete<Product>(`/products/${id}`);
    }
}
