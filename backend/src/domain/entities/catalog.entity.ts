import { ProductData } from './product.entity';

export type Catalog = {
    id: number;
    product_id: number;
    plan_id: number;
    desired_volume: number;
};

export type CatalogData = Omit<Catalog, 'plan_id' | 'product_id'> & {
    product: ProductData;
};
