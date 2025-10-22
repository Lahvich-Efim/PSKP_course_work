import type { Catalog } from './catalog.ts';

export interface Supply {
    id: number;
    supplier_catalog: Catalog;
    consumer_catalog: Catalog;
    cost_factor: number;
}

export interface createSupply {
    supplier_catalog_id: number;
    consumer_catalog_id: number;
    cost_factor: number;
}

export interface updateSupply {
    cost_factor?: number;
    supplier_catalog_id?: number;
    consumer_catalog_id?: number;
}
