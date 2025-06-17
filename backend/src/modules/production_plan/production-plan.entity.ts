import { CatalogData } from '../catalog/catalog.entity';

export type StatusPlan = 'OPEN' | 'FINALIZED' | 'ARCHIVED';

export type ProductionPlan = {
    id: number;
    period: Date;
    status: StatusPlan;
};

export interface ProductionPlanData {
    id: number;
    period: Date;
    status: string;
    catalogs: (CatalogData & {
        supplies: {
            id: number;
            cost_factor: number;
            direction: 'outgoing' | 'incoming';
            peer_catalog: Omit<CatalogData, 'desired_volume'>;
            final_amount?: number;
        }[];
    })[];
    count: number;
}
