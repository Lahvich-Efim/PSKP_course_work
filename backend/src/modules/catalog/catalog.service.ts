import { Inject, Injectable } from '@nestjs/common';
import { Catalog, CatalogData } from './catalog.entity';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import {
    AccessDeniedError,
    EntityAlreadyExistError,
    NotFoundError,
} from '../../shared/exceptions/exceptions';
import { PaginatedResult } from '../../shared/pagination.interface';
import {
    IParticipantRepository,
    PARTICIPANT_REPOSITORY,
} from '../participant/participant.interface';
import {
    IProductRepository,
    PRODUCT_REPOSITORY,
} from '../product/product.interface';
import { ProductionPlan } from '../production_plan/production-plan.entity';
import { UserData } from '../users/user.entity';
import {
    CATALOG_REPOSITORY,
    CatalogFilter,
    ICatalogRepository,
} from './catalog.interface';
import { PlanContextService } from '../../shared/services/plan-context.service';

@Injectable()
export class CatalogService {
    constructor(
        @Inject(CATALOG_REPOSITORY)
        private readonly catalogRepo: ICatalogRepository,
        private readonly planContext: PlanContextService,
        @Inject(PARTICIPANT_REPOSITORY)
        private readonly participantRepo: IParticipantRepository,
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepo: IProductRepository,
    ) {}

    private buildFilter(user: UserData, plan?: ProductionPlan): CatalogFilter {
        const filter: CatalogFilter = {};
        if (plan) {
            filter.plan_id = plan.id;
        }
        if (user.role === 'PARTICIPANT') {
            filter.product = { participant_id: user.id };
        } else if (user.role !== 'COORDINATOR') {
            throw new AccessDeniedError('Нет доступа к каталогу');
        }
        return filter;
    }

    private async toCatalogData(c: Catalog): Promise<CatalogData> {
        const product = await this.productRepo.findOneById(c.product_id);
        if (!product) throw new Error('Продукт не найден');
        const participant = await this.participantRepo.findOneById(
            product.participant_id,
        );
        if (!participant) throw new Error('Участник не найден');

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { participant_id, ...prod } = product;
        return {
            id: c.id,
            desired_volume: c.desired_volume,
            product: prod,
            participant: participant.name,
        };
    }

    private async fetchById(
        id: number,
        user: UserData,
        plan?: ProductionPlan,
    ): Promise<CatalogData> {
        const filter = this.buildFilter(user, plan);
        const catalog = await this.catalogRepo.findOneById(id, filter);
        if (!catalog) throw new NotFoundError(`Каталог ${id} не найден`);
        return this.toCatalogData(catalog);
    }

    async getCatalog(id: number, user: UserData) {
        return this.fetchById(id, user);
    }

    async getActualityCatalog(id: number, user: UserData) {
        const plan = await this.planContext.getCurrentPlan();
        return this.fetchById(id, user, plan);
    }

    async getCatalogs(
        user: UserData,
        offset?: number,
        limit?: number,
    ): Promise<CatalogData[]> {
        const filter = this.buildFilter(user);
        const raw = await this.catalogRepo.findMany(filter, offset, limit);
        return Promise.all(raw.map((c) => this.toCatalogData(c)));
    }

    async getActualityCatalogs(
        user: UserData,
        offset?: number,
        limit?: number,
    ): Promise<PaginatedResult<CatalogData>> {
        const plan = await this.planContext.getCurrentPlan();
        const filter = this.buildFilter(user, plan);
        const [raw, count] = await Promise.all([
            this.catalogRepo.findMany(filter, offset, limit),
            this.catalogRepo.count(filter),
        ]);
        const items = await Promise.all(raw.map((c) => this.toCatalogData(c)));
        return { count, items };
    }

    async createCatalog(dto: CreateCatalogDto, user: UserData) {
        const plan = await this.planContext.ensurePlanIsOpen();
        if (user.role !== 'PARTICIPANT') {
            throw new AccessDeniedError('Нет доступа на создание');
        }
        if (
            await this.catalogRepo.findOne({
                product_id: dto.product_id,
                plan_id: plan.id,
            })
        ) {
            throw new EntityAlreadyExistError('Каталог уже существует');
        }

        const raw = await this.catalogRepo.create({ plan_id: plan.id, ...dto });
        return this.toCatalogData(raw);
    }

    async updateCatalog(
        data: UpdateCatalogDto & { id: number },
        user: UserData,
    ) {
        const plan = await this.planContext.ensurePlanIsOpen();
        const exists = await this.catalogRepo.findOneById(
            data.id,
            this.buildFilter(user, plan),
        );
        if (!exists) throw new AccessDeniedError('Нет доступа на обновление');
        const updated = await this.catalogRepo.update({
            ...data,
            plan_id: plan.id,
        });
        return this.toCatalogData(updated);
    }

    async deleteCatalog(id: number, user: UserData): Promise<Catalog> {
        const plan = await this.planContext.ensurePlanIsOpen();
        const exists = await this.catalogRepo.findOneById(
            id,
            this.buildFilter(user, plan),
        );
        if (!exists) throw new AccessDeniedError('Нет доступа на удаление');
        return await this.catalogRepo.delete(id);
    }
}
