import { Product } from './product.entity';

export type CreateProduct = Omit<Product, 'id'>;
export type UpdateProduct = Partial<Product> & { id: number };
export const PRODUCT_REPOSITORY = 'IProductRepository';

export interface ProductFilter extends Partial<Product> {
    OR?: ProductFilter[];
}

export interface IProductRepository {
    findOneById(productId: number): Promise<Product | null>;

    findOne(where: ProductFilter): Promise<Product | null>;

    findMany(
        where: ProductFilter,
        offset?: number,
        limit?: number,
    ): Promise<Product[]>;

    isExists(where: ProductFilter, productId?: number): Promise<boolean>;

    create(product: CreateProduct): Promise<Product>;

    update(product: UpdateProduct): Promise<Product>;

    delete(productId: number): Promise<Product>;

    count(where?: ProductFilter): Promise<number>;
}
