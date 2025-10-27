import { Production } from '../entities/production.entity';
import { Product } from '../entities/product.entity';
import { EntityFilter } from '../../application/interfaces/filter.interface';

export type CreateProduction = Omit<Production, 'id'>;
export type UpdateProduction = Partial<Production> & { id: number };

interface ProductionRelations {
    products: Product[];
}

export type ProductionFilter = EntityFilter<Production, ProductionRelations>;

export interface IProductionRepository {
    findOneById(productionId: number): Promise<Production | null>;

    findOne(where: ProductionFilter): Promise<Production | null>;

    findMany(
        where: ProductionFilter,
        offset?: number,
        limit?: number,
    ): Promise<Production[]>;

    isExists(where: ProductionFilter, productionId?: number): Promise<boolean>;

    create(production: CreateProduction): Promise<Production>;

    update(production: UpdateProduction): Promise<Production>;

    delete(productionId: number): Promise<Production>;

    count(where?: ProductionFilter): Promise<number>;
}
