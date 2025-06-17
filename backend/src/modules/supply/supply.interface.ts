import { Supply } from './supply.entity';
import { CatalogFilter } from '../catalog/catalog.interface';

export type CreateSupply = Omit<Supply, 'id'>;
export type UpdateSupply = Partial<Supply> & { id: number };

export const SUPPLY_REPOSITORY = 'ISupplyRepository';

export interface SupplyFilter extends Partial<Supply> {
    OR?: SupplyFilter[];
    supplier_catalog?: CatalogFilter;
    consumer_catalog?: CatalogFilter;
}

export interface ISupplyRepository {
    findOneById(supplyId: number, where?: SupplyFilter): Promise<Supply | null>;

    findOne(where: SupplyFilter): Promise<Supply | null>;

    findMany(
        where: SupplyFilter,
        offset?: number,
        limit?: number,
    ): Promise<Supply[]>;

    createMany(supplies: CreateSupply[]): Promise<number>;

    create(supply: CreateSupply): Promise<Supply>;

    update(supply: UpdateSupply): Promise<Supply>;

    delete(supplyId: number): Promise<Supply>;

    count(where?: SupplyFilter): Promise<number>;
}
