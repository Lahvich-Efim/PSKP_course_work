import { Supply } from '../entities/supply.entity';
import { EntityFilter } from '../../application/interfaces/filter.interface';
import { Catalog } from '../entities/catalog.entity';

export type CreateSupply = Omit<Supply, 'id'>;
export type UpdateSupply = Partial<Supply> & { id: number };

interface SupplyRelations {
    supplier_catalog: Catalog;
    consumer_catalog: Catalog;
}

export type SupplyFilter = EntityFilter<Supply, SupplyRelations>;

export interface ISupplyRepository {
    findOneById(supplyId: number): Promise<Supply | null>;

    findOne(where: SupplyFilter): Promise<Supply | null>;

    findMany(
        where: SupplyFilter,
        offset?: number,
        limit?: number,
    ): Promise<Supply[]>;

    createMany(supplies: CreateSupply[]): Promise<number>;

    deleteMany(where: SupplyFilter): Promise<number>;

    create(supply: CreateSupply): Promise<Supply>;

    update(supply: UpdateSupply): Promise<Supply>;

    delete(supplyId: number): Promise<Supply>;

    count(where?: SupplyFilter): Promise<number>;
}
