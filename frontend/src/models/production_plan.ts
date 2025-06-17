import type { Catalog } from './catalog.ts';

export interface ProductionPlan {
    id: number;
    period: Date;
    status: string;
    catalogs: (Catalog & {
        supplies: {
            id: number;
            cost_factor: number;
            direction: 'outgoing' | 'incoming';
            peer_catalog: Omit<Catalog, 'desired_volume'>;
            final_amount?: number;
        }[];
    })[];
    count: number;
}

export interface createProductionPlan {
    period?: number;
}
