import { ApiClient } from '@/api/ApiClient.ts';
import type {
    Catalog,
    createCatalog,
    updateCatalog,
} from '@/models/catalog.ts';
import type { Paginated } from '@/hooks/query/usePaginatedQuery.ts';

export class CatalogService extends ApiClient {
    async getAllActualityCatalogs(params: {
        offset?: number;
        limit?: number;
    }): Promise<Paginated<Catalog>> {
        return this.get<Paginated<Catalog>>('/catalogs', params);
    }

    async getActualityCatalog(id: number): Promise<Catalog> {
        return this.get<Catalog>(`/catalogs/${id}`);
    }

    async createCatalog(data: createCatalog): Promise<Catalog> {
        return this.post<Catalog>('/catalogs', data);
    }

    async updateCatalog(id: number, dto: updateCatalog): Promise<Catalog> {
        return this.patch<Catalog>(`/catalogs/${id}`, dto);
    }

    async deleteCatalog(id: number): Promise<Catalog> {
        return this.delete<Catalog>(`/catalogs/${id}`);
    }
}
