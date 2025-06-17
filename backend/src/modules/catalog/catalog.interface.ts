import { Catalog } from './catalog.entity';

import { ProductFilter } from '../product/product.interface';

export type CreateCatalog = Omit<Catalog, 'id'>;
export type UpdateCatalog = Partial<CreateCatalog> & {
    id: number;
};

export const CATALOG_REPOSITORY = 'ICatalogRepository';

export interface CatalogFilter extends Partial<Catalog> {
    OR?: CatalogFilter[];
    product?: ProductFilter;
}

export interface ICatalogRepository {
    findOneById(
        catalogId: number,
        where?: CatalogFilter,
    ): Promise<Catalog | null>;

    findOne(where: CatalogFilter): Promise<Catalog | null>;

    findMany(
        where?: CatalogFilter,
        offset?: number,
        limit?: number,
    ): Promise<Catalog[]>;

    create(catalog: CreateCatalog): Promise<Catalog>;

    createMany(catalogs: CreateCatalog[]): Promise<number>;

    update(catalog: UpdateCatalog): Promise<Catalog>;

    delete(catalogId: number): Promise<Catalog>;

    count(where?: CatalogFilter): Promise<number>;
}
