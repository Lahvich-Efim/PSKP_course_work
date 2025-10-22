import { Supply } from './supply.entity';
import { Catalog } from '../catalog/catalog.entity';
import { EntityFilter } from '../../shared/interfaces/filter.interface';

export type CreateSupply = Omit<Supply, 'id'>;
export type UpdateSupply = Partial<Supply> & { id: number };

export const SUPPLY_REPOSITORY = 'ISupplyRepository';

interface SupplyRelations {
    supplier_catalog: Catalog;
    consumer_catalog: Catalog;
}

export type SupplyFilter = EntityFilter<Supply, SupplyRelations>;

export interface ISupplyRepository {
    findOneById(supplyId: number, where?: SupplyFilter): Promise<Supply | null>;

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
