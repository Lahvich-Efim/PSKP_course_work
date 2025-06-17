import type { Product } from '@/models/product.ts';

export interface Catalog {
    id: number;
    product: Product;
    desired_volume: number;
    participant: string;
}

export interface createCatalog {
    product_id: number;
    desired_volume: number;
}

export interface updateCatalog {
    product_id?: number;
    desired_volume?: number;
}
