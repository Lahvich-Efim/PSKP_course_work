import { Inject, Injectable } from '@nestjs/common';
import { Catalog, CatalogData } from '../../domain/entities/catalog.entity';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import {
    CatalogFilter,
    ICatalogRepository,
} from 'src/domain/repositories/catalog.interface';
import { IParticipantRepository } from 'src/domain/repositories/participant.interface';
import { IProductRepository } from 'src/domain/repositories/product.interface';
import { PlanContextService } from '../../infrastructure/plan-context.service';
import { UserData } from '../../domain/entities/user.entity';
import { ProductionPlan } from '@prisma/client';
import {
    AccessDeniedError,
    EntityAlreadyExistError,
    NotFoundError,
} from '../../common/exceptions/exceptions';
import { PaginatedResult } from '../../domain/repositories/pagination.interface';
import {
    CATALOG_REPOSITORY,
    PARTICIPANT_REPOSITORY,
    PRODUCT_REPOSITORY,
    PRODUCTION_RELATION_REPOSITORY,
    PRODUCTION_REPOSITORY,
} from '../../domain/tokens';
import { ProductionRepository } from '../../infrastructure/prisma/repositories/production.repository';
import { IProductionRelationRepository } from '../../domain/repositories/production-relation.interface';

@Injectable()
export class CatalogService {
    constructor(
        @Inject(CATALOG_REPOSITORY)
        private readonly catalogRepo: ICatalogRepository,
        private readonly planContext: PlanContextService,
        @Inject(PRODUCTION_REPOSITORY)
        private readonly productionRepo: ProductionRepository,
        @Inject(PARTICIPANT_REPOSITORY)
        private readonly participantRepo: IParticipantRepository,
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepo: IProductRepository,
        @Inject(PRODUCTION_RELATION_REPOSITORY)
        private readonly productionRelationRepo: IProductionRelationRepository,
    ) {}

    private buildFilter(user: UserData, plan?: ProductionPlan): CatalogFilter {
        const filter: CatalogFilter = {};
        if (plan) {
            filter.plan_id = plan.id;
        } else if (user.role !== 'COORDINATOR' && user.role !== 'PARTICIPANT') {
            throw new AccessDeniedError('Нет доступа к каталогу');
        }
        return filter;
    }

    private async toCatalogData(c: Catalog): Promise<CatalogData> {
        const product = await this.productRepo.findOneById(c.product_id);
        if (!product) throw new Error('Продукт не найден');
        const { participant_id, ...prod } = product;
        const participant =
            await this.participantRepo.findOneById(participant_id);
        if (!participant) throw new Error('Участник не найден');

        const production = await this.productionRepo.findOneById(
            product.production_id,
        );
        if (!production) throw new Error('Продукция не найден');

        return {
            id: c.id,
            desired_volume: c.desired_volume,
            product: {
                ...prod,
                participant_name: participant.name,
                unit: production.unit,
            },
        };
    }

    private async fetchById(
        id: number,
        user: UserData,
        plan?: ProductionPlan,
    ): Promise<CatalogData> {
        const filter = this.buildFilter(user, plan);
        const catalog = await this.catalogRepo.findOne({ id, ...filter });
        if (!catalog) throw new NotFoundError(`Каталог не найден!`);
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
        where?: CatalogFilter,
    ): Promise<PaginatedResult<CatalogData>> {
        const plan = await this.planContext.getCurrentPlan();
        const filter = this.buildFilter(user, plan);
        const [raw, count] = await Promise.all([
            this.catalogRepo.findMany({ ...where, ...filter }, offset, limit),
            this.catalogRepo.count({ ...where, ...filter }),
        ]);
        const items = await Promise.all(raw.map((c) => this.toCatalogData(c)));
        return { count, items };
    }

    async getAvailableCatalogsForAgreements(
        user: UserData,
        offset?: number,
        limit?: number,
        direction?: 'supplier' | 'consumer',
    ): Promise<PaginatedResult<CatalogData>> {
        if (user.role !== 'PARTICIPANT') {
            throw new AccessDeniedError(
                'Только участники могут просматривать доступные каталоги',
            );
        }

        const plan = await this.planContext.getCurrentPlan();

        const myCatalogs = await this.catalogRepo.findMany({
            plan_id: plan.id,
            product: { is: { participant_id: user.id } },
        });

        const myCatalogIds = myCatalogs.map((c) => c.id);
        const myProductionIds = new Set<number>();

        for (const cat of myCatalogs) {
            const product = await this.productRepo.findOneById(cat.product_id);
            if (product) myProductionIds.add(product.production_id);
        }

        const allRelations = await this.productionRelationRepo.findMany({});

        const supplierProductionIds = new Set<number>();
        const consumerProductionIds = new Set<number>();

        for (const rel of allRelations) {
            if (myProductionIds.has(rel.production_id)) {
                supplierProductionIds.add(rel.required_production_id);
            }
            if (myProductionIds.has(rel.required_production_id)) {
                consumerProductionIds.add(rel.production_id);
            }
        }

        const targetProductionIds =
            direction === 'supplier'
                ? supplierProductionIds
                : direction === 'consumer'
                  ? consumerProductionIds
                  : new Set([
                        ...supplierProductionIds,
                        ...consumerProductionIds,
                    ]);

        if (targetProductionIds.size === 0) {
            return { count: 0, items: [] };
        }

        const [rawCatalogs, count] = await Promise.all([
            this.catalogRepo.findMany(
                {
                    plan_id: plan.id,
                    product: {
                        is: {
                            production_id: {
                                in: Array.from(targetProductionIds),
                            },
                            participant_id: { not: user.id },
                        },
                    },
                    NOT: { id: { in: myCatalogIds } },
                },
                offset,
                limit,
            ),
            this.catalogRepo.count({
                plan_id: plan.id,
                product: {
                    is: {
                        production_id: { in: Array.from(targetProductionIds) },
                        participant_id: { not: user.id },
                    },
                },
                NOT: { id: { in: myCatalogIds } },
            }),
        ]);

        const items = await Promise.all(
            rawCatalogs.map((c) => this.toCatalogData(c)),
        );
        return { count, items };
    }

    async createCatalog(dto: CreateCatalogDto, user: UserData) {
        const plan = await this.planContext.ensurePlanIsOpen();
        if (user.role !== 'PARTICIPANT') {
            throw new AccessDeniedError(
                'Только участник может выставить каталог продуктов!',
            );
        }
        if (
            await this.catalogRepo.findOne({
                product_id: dto.product_id,
                plan_id: plan.id,
            })
        ) {
            throw new EntityAlreadyExistError('Каталог уже существует!');
        }

        const raw = await this.catalogRepo.create({ plan_id: plan.id, ...dto });
        return this.toCatalogData(raw);
    }

    async updateCatalog(
        data: UpdateCatalogDto & { id: number },
        user: UserData,
    ) {
        const plan = await this.planContext.ensurePlanIsOpen();
        const exists = await this.catalogRepo.findOne({
            id: data.id,
            ...this.buildFilter(user, plan),
        });
        if (!exists) throw new NotFoundError('Данный каталог не существует!');
        const updated = await this.catalogRepo.update({
            ...data,
            plan_id: plan.id,
        });
        return this.toCatalogData(updated);
    }

    async deleteCatalog(id: number, user: UserData): Promise<Catalog> {
        const plan = await this.planContext.ensurePlanIsOpen();
        const exists = await this.catalogRepo.findOne({
            id,
            ...this.buildFilter(user, plan),
        });
        if (!exists) throw new NotFoundError('Данный каталог не существует!');
        return await this.catalogRepo.delete(id);
    }
}
