import { CatalogData } from '../catalog/catalog.entity';

export type Supply = {
    id: number;
    supplier_catalog_id: number;
    consumer_catalog_id: number;
    cost_factor: number;
};

export type SupplyData = Omit<
    Supply,
    'supplier_catalog_id' | 'consumer_catalog_id'
> & { supplier_catalog: CatalogData; consumer_catalog: CatalogData };
