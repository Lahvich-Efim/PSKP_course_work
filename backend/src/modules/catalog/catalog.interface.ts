import { Catalog } from './catalog.entity';

import { EntityFilter } from '../../shared/interfaces/filter.interface';
import { Product } from '../product/product.entity';
import { ProductionPlan } from '../production_plan/production-plan.entity';

export type CreateCatalog = Omit<Catalog, 'id'>;
export type UpdateCatalog = Partial<CreateCatalog> & {
    id: number;
};
export const CATALOG_REPOSITORY = 'ICatalogRepository';

export interface CatalogRelations {
    product: Product;
    plan: ProductionPlan;
}

export type CatalogFilter = EntityFilter<Catalog, CatalogRelations>;

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

    deleteMany(where: CatalogFilter): Promise<number>;

    update(catalog: UpdateCatalog): Promise<Catalog>;

    delete(catalogId: number): Promise<Catalog>;

    count(where?: CatalogFilter): Promise<number>;
}
