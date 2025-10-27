import { ProductionData } from './production.entity';

export type ProductionRelation = {
    id: number;
    production_id: number;
    required_production_id: number;
};

export type ProductRelationData = Omit<
    ProductionRelation,
    'required_production_id' | 'production_id'
> & {
    production: ProductionData;
    required_production: ProductionData;
};
