import { CatalogData } from './catalog.entity';

export type StatusPlan = 'OPEN' | 'FINALIZED' | 'ARCHIVED';

export type ProductionPlan = {
    id: number;
    period_start: Date;
    period_end: Date;
    status: StatusPlan;
};

export type ProductionPlanData = {
    id: number;
    period_start: Date;
    period_end: Date;
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
};
