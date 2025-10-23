import { Inject, Injectable } from '@nestjs/common';
import { PRODUCTION_PLAN_DETAIL_REPOSITORY } from '../../domain/tokens';
import { IProductionPlanDetailRepository } from '../../domain/repositories/production-plan-detail.interface';

@Injectable()
export class ProductionPlanDetailService {
    constructor(
        @Inject(PRODUCTION_PLAN_DETAIL_REPOSITORY)
        readonly productionPlanDetailRepository: IProductionPlanDetailRepository,
    ) {}
}
