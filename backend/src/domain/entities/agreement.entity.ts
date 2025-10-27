import { CatalogData } from './catalog.entity';

export type AgreementStatus = 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'COMPLETED';

export type AgreementSideStatus = 'PENDING' | 'ACCEPTED' | 'CANCELLED';

export type Agreement = {
    id: number;
    supplier_id: number;
    consumer_id: number;
    cost_factor: number;
    linked_supply_id: number | null;
    status: AgreementStatus;
    supplier_status: AgreementSideStatus;
    consumer_status: AgreementSideStatus;
};

export type AgreementData = Omit<Agreement, 'supplier_id' | 'consumer_id'> & {
    supplier: CatalogData;
    consumer: CatalogData;
};
