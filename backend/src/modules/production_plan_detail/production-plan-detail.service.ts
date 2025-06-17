import { Inject, Injectable } from '@nestjs/common';
import {
    IProductionPlanDetailRepository,
    PRODUCTION_PLAN_DETAIL_REPOSITORY,
} from './production-plan-detail.interface';

@Injectable()
export class ProductionPlanDetailService {
    constructor(
        @Inject(PRODUCTION_PLAN_DETAIL_REPOSITORY)
        readonly productionPlanDetailRepository: IProductionPlanDetailRepository,
    ) {}
}
