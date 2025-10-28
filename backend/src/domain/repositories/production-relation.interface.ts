import { ProductionRelation } from '../entities/production-relation.entity';
import { Production } from '../entities/production.entity';
import { EntityFilter } from '../../application/interfaces/filter.interface';

export type CreateProductionRelation = Omit<ProductionRelation, 'id'>;

interface ProductionRelationRelations {
    production: Production;
    required_production: Production;
}

export type ProductionRelationFilter = EntityFilter<
    ProductionRelation,
    ProductionRelationRelations
>;

export interface IProductionRelationRepository {
    existsLink(
        required_product_id: number,
        product_id: number,
    ): Promise<boolean>;

    findMany(
        where?: ProductionRelationFilter,
        offset?: number,
        limit?: number,
    ): Promise<ProductionRelation[]>;

    findOne(
        where?: ProductionRelationFilter,
    ): Promise<ProductionRelation | null>;

    findOneById(
        production_relation_id: number,
    ): Promise<ProductionRelation | null>;

    create(data: CreateProductionRelation): Promise<ProductionRelation>;

    delete(id: number): Promise<ProductionRelation>;

    count(where?: ProductionRelationFilter): Promise<number>;
}
