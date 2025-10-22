import { Product } from './product.entity';
import { EntityFilter } from '../../shared/interfaces/filter.interface';
import { Catalog } from '../catalog/catalog.entity';
import { User } from '../users/user.entity';

export type CreateProduct = Omit<Product, 'id'>;
export type UpdateProduct = Partial<Product> & { id: number };
export const PRODUCT_REPOSITORY = 'IProductRepository';

interface ProductRelations {
    catalogs: Catalog[];
    participant: User;
}

export type ProductFilter = EntityFilter<Product, ProductRelations>;

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
