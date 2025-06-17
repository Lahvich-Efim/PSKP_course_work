import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CatalogService } from '../catalog/catalog.service';
import {
    AccessDeniedError,
    EntityAlreadyExistError,
    NotFoundError,
    SupplyException,
} from '../../shared/exceptions/exceptions';
import { PaginatedResult } from '../../shared/pagination.interface';
import {
    CreateSupply,
    ISupplyRepository,
    SUPPLY_REPOSITORY,
    SupplyFilter,
    UpdateSupply,
} from './supply.interface';
import { Supply, SupplyData } from './supply.entity';
import { UserData } from '../users/user.entity';
import { PlanContextService } from '../../shared/services/plan-context.service';
import { ProductionPlan } from '../production_plan/production-plan.entity';

@Injectable()
export class SupplyService {
    constructor(
        @Inject(SUPPLY_REPOSITORY)
        private readonly supplyRepo: ISupplyRepository,
        private readonly planContext: PlanContextService,
        private readonly catalogService: CatalogService,
    ) {}

    private buildFilter(user: UserData, plan?: ProductionPlan): SupplyFilter {
        const filter: SupplyFilter = {};
        if (plan) {
            filter.supplier_catalog = { plan_id: plan.id };
            filter.consumer_catalog = { plan_id: plan.id };
        }

        if (user.role === 'PARTICIPANT') {
            filter.OR = [
                { consumer_catalog: { product: { participant_id: user.id } } },
                { supplier_catalog: { product: { participant_id: user.id } } },
            ];
        } else if (user.role !== 'COORDINATOR') {
            throw new AccessDeniedError('Нет доступа к поставкам');
        }

        return filter;
    }

    private async toSupplyData(
        supply: Supply,
        user: UserData,
    ): Promise<SupplyData> {
        const [supplier, consumer] = await Promise.all([
            this.catalogService.getCatalog(supply.supplier_catalog_id, user),
            this.catalogService.getCatalog(supply.consumer_catalog_id, user),
        ]);

        return {
            id: supply.id,
            supplier_catalog: supplier,
            consumer_catalog: consumer,
            cost_factor: supply.cost_factor,
        };
    }

    private async fetchOne(
        id: number,
        user: UserData,
        plan?: ProductionPlan,
    ): Promise<SupplyData> {
        const filter = this.buildFilter(user, plan);
        const entity = await this.supplyRepo.findOneById(id, filter);
        if (!entity) throw new NotFoundError(`Поставка с id ${id} не найдена`);
        return this.toSupplyData(entity, user);
    }

    async getSupply(supplyId: number, user: UserData): Promise<SupplyData> {
        return this.fetchOne(supplyId, user);
    }

    async getActualitySupply(
        supplyId: number,
        user: UserData,
    ): Promise<SupplyData> {
        const plan = await this.planContext.getCurrentPlan();
        return this.fetchOne(supplyId, user, plan);
    }

    async getSupplies(
        user: UserData,
        offset?: number,
        limit?: number,
    ): Promise<SupplyData[]> {
        const filter = this.buildFilter(user);
        const raw = await this.supplyRepo.findMany(filter, offset, limit);
        return Promise.all(raw.map((s) => this.toSupplyData(s, user)));
    }

    async getActualitySupplies(
        user: UserData,
        offset?: number,
        limit?: number,
    ): Promise<PaginatedResult<SupplyData>> {
        const plan = await this.planContext.getCurrentPlan();
        const filter = this.buildFilter(user, plan);
        const [raw, count] = await Promise.all([
            this.supplyRepo.findMany(filter, offset, limit),
            this.supplyRepo.count(filter),
        ]);
        const items = await Promise.all(
            raw.map((s) => this.toSupplyData(s, user)),
        );
        return { count, items };
    }

    async createSupply(dto: CreateSupply, user: UserData): Promise<SupplyData> {
        await this.planContext.ensurePlanIsOpen();
        if (user.role !== 'COORDINATOR') {
            throw new AccessDeniedError('Нет прав для создания поставки');
        }

        await Promise.all([
            this.catalogService.getCatalog(dto.consumer_catalog_id, user),
            this.catalogService.getCatalog(dto.supplier_catalog_id, user),
        ]).catch(() => {
            throw new SupplyException('Неправильные каталоги поставки!');
        });

        if (dto.consumer_catalog_id === dto.supplier_catalog_id) {
            throw new SupplyException('Нельзя поставлять самому себе!');
        }

        if (
            await this.supplyRepo.findOne({
                consumer_catalog_id: dto.consumer_catalog_id,
                supplier_catalog_id: dto.supplier_catalog_id,
            })
        ) {
            throw new EntityAlreadyExistError('Такая поставка уже существует!');
        }

        const raw = await this.supplyRepo.create({ ...dto });
        return this.toSupplyData(raw, user);
    }

    async updateSupply(dto: UpdateSupply, user: UserData): Promise<SupplyData> {
        const plan = await this.planContext.ensurePlanIsOpen();

        if (dto.consumer_catalog_id === dto.supplier_catalog_id) {
            throw new SupplyException('Нельзя поставлять самому себе!');
        }

        const exists = await this.supplyRepo.findOneById(
            dto.id,
            this.buildFilter(user, plan),
        );
        if (!exists) throw new NotFoundError(`Поставка ${dto.id} не найдена`);

        const conflict = await this.supplyRepo.findOne({
            consumer_catalog_id: dto.consumer_catalog_id,
            supplier_catalog_id: dto.supplier_catalog_id,
            OR: [{ id: dto.id }],
        });
        if (conflict) {
            throw new EntityAlreadyExistError('Такая поставка уже существует!');
        }

        const updated = await this.supplyRepo.update({
            ...dto,
        });
        return this.toSupplyData(updated, user);
    }

    async deleteSupply(id: number, user: UserData): Promise<SupplyData> {
        const plan = await this.planContext.ensurePlanIsOpen();
        const exists = await this.supplyRepo.findOneById(
            id,
            this.buildFilter(user, plan),
        );
        if (!exists) throw new AccessDeniedError('Нет доступа к удалению');

        const raw = await this.supplyRepo.delete(id);
        return this.toSupplyData(raw, user);
    }
}
