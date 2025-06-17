import { ApiClient } from '@/api/ApiClient.ts';
import type { Supply, createSupply, updateSupply } from '@/models/supply.ts';
import type { Paginated } from '@/hooks/query/usePaginatedQuery.ts';

export class SupplyService extends ApiClient {
    async getAllActualitySupplies(params: {
        limit?: number;
        offset?: number;
    }): Promise<Paginated<Supply>> {
        return this.get<Paginated<Supply>>('/supplies', params);
    }

    async getActualitySupply(id: number): Promise<Supply> {
        return this.get<Supply>(`/supplies/${id}`);
    }

    async createSupply(dto: createSupply): Promise<Supply> {
        return this.post<Supply>('/supplies', dto);
    }

    async updateSupply(id: number, dto: updateSupply): Promise<Supply> {
        return this.patch<Supply>(`/supplies/${id}`, dto);
    }

    async deleteSupply(id: number): Promise<Supply> {
        return this.delete<Supply>(`/supplies/${id}`);
    }
}
