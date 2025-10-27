import { Product } from '../entities/product.entity';
import { EntityFilter } from '../../application/interfaces/filter.interface';
import { Catalog } from '../entities/catalog.entity';
import { Production } from '../entities/production.entity';
import { Participant } from '../entities/participant.entity';

export type CreateProduct = Omit<Product, 'id'>;
export type UpdateProduct = Partial<Product> & { id: number };

interface ProductRelations {
    catalogs: Catalog[];
    production: Production;
    participant: Participant;
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
