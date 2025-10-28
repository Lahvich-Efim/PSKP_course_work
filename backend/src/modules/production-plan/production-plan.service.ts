import { Inject, Injectable } from '@nestjs/common';
import {
    AccessDeniedError,
    ProductionPlanException,
    UnknownError,
} from '../../common/exceptions/exceptions';
import {
    ProductionPlan,
    ProductionPlanData,
} from '../../domain/entities/production-plan.entity';
import { CreateProductionPlanDto } from './dto/create-production-plan.dto';
import { UserData } from '../../domain/entities/user.entity';
import { Catalog } from '../../domain/entities/catalog.entity';
import { Supply } from '../../domain/entities/supply.entity';
import { ProductionPlanDetail } from '../../domain/entities/production-plan-detail.entity';
import { Product } from '../../domain/entities/product.entity';
import { Participant } from '../../domain/entities/participant.entity';
import Decimal from 'decimal.js';
import {
    CATALOG_REPOSITORY,
    PARTICIPANT_REPOSITORY,
    PRODUCT_REPOSITORY,
    PRODUCTION_PLAN_DETAIL_REPOSITORY,
    PRODUCTION_PLAN_REPOSITORY,
    PRODUCTION_REPOSITORY,
    SUPPLY_REPOSITORY,
} from '../../domain/tokens';
import { IProductionPlanRepository } from '../../domain/repositories/production-plan.interface';
import { IProductRepository } from '../../domain/repositories/product.interface';
import { ICatalogRepository } from '../../domain/repositories/catalog.interface';
import { ISupplyRepository } from '../../domain/repositories/supply.interface';
import { IProductionPlanDetailRepository } from '../../domain/repositories/production-plan-detail.interface';
import { IParticipantRepository } from '../../domain/repositories/participant.interface';
import { IProductionRepository } from '../../domain/repositories/production.interface';
import { Production } from '../../domain/entities/production.entity';

@Injectable()
export class ProductionPlanService {
    constructor(
        @Inject(PRODUCTION_PLAN_REPOSITORY)
        private readonly productionPlanRepository: IProductionPlanRepository,
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: IProductRepository,
        @Inject(CATALOG_REPOSITORY)
        private readonly catalogRepository: ICatalogRepository,
        @Inject(SUPPLY_REPOSITORY)
        private readonly supplyRepository: ISupplyRepository,
        @Inject(PRODUCTION_PLAN_DETAIL_REPOSITORY)
        private readonly detailRepository: IProductionPlanDetailRepository,
        @Inject(PARTICIPANT_REPOSITORY)
        private readonly participantRepository: IParticipantRepository,
        @Inject(PRODUCTION_REPOSITORY)
        private readonly productionRepository: IProductionRepository,
    ) {}

    async getLastProductionPlan(
        user: UserData,
        offset: number = 0,
        limit: number = 0,
    ): Promise<ProductionPlanData | null> {
        const plan =
            await this.productionPlanRepository.getLastProductionPlan();
        if (!plan) return null;

        if (limit === 0) {
            return {
                id: plan.id,
                period_start: plan.period_start,
                period_end: plan.period_end,
                status: plan.status,
                catalogs: [],
                count: 0,
            };
        }

        const allCatalogsFull = await this.catalogRepository.findMany({
            plan_id: plan.id,
        });

        const products = await this.productRepository.findMany({
            catalogs: {
                some: {
                    plan_id: plan.id,
                },
            },
        });
        const prodMap = new Map<number, Product>(
            products.map((p) => [p.id, p]),
        );

        const userCatalogs =
            user.role !== 'COORDINATOR'
                ? allCatalogsFull.filter(
                      (c) =>
                          prodMap.get(c.product_id)?.participant_id === user.id,
                  )
                : allCatalogsFull;

        const total = userCatalogs.length;
        const pageCatalogs = userCatalogs.slice(offset, offset + limit);
        const ids = pageCatalogs.map((c) => c.id);

        const supplies = await this.supplyRepository.findMany({
            OR: [
                ...ids.map((id) => ({ supplier_catalog_id: id })),
                ...ids.map((id) => ({ consumer_catalog_id: id })),
            ],
        });

        const supplyIds = supplies.map((s) => s.id);

        const details = await this.detailRepository.findMany({
            OR: supplyIds.map((id) => ({ supply_id: id })),
        });

        const participantIds = new Set<number>(
            products.map((p) => p.participant_id),
        );
        const productionIds = new Set<number>(
            products.map((p) => p.production_id),
        );

        const participants = await this.participantRepository.findMany({
            OR: Array.from(participantIds).map((id) => ({ id })),
        });

        const productions = await this.productionRepository.findMany({
            OR: Array.from(productionIds).map((id) => ({
                id,
            })),
        });

        const peerIds = supplies.flatMap((s) => [
            s.supplier_catalog_id,
            s.consumer_catalog_id,
        ]);

        const visibleCatalogs =
            user.role !== 'COORDINATOR'
                ? allCatalogsFull.filter((c) => peerIds.includes(c.id))
                : allCatalogsFull;

        return this.buildPlanData(
            plan,
            pageCatalogs,
            visibleCatalogs,
            supplies,
            details,
            products,
            participants,
            productions,
            total,
        );
    }

    async createProductionPlan(
        params: CreateProductionPlanDto,
        user: UserData,
    ): Promise<ProductionPlan> {
        if (user.role !== 'COORDINATOR') {
            throw new AccessDeniedError('Не имеете право доступа к ресурсу');
        }

        const lastPlan =
            await this.productionPlanRepository.getLastProductionPlan();

        const newPlan = await this.productionPlanRepository.create({
            period_start: params.period_start,
            period_end: params.period_end,
            status: 'OPEN',
        });

        if (lastPlan) {
            await this.detailRepository.deleteMany({ plan_id: lastPlan.id });

            const lastCatalogs = await this.catalogRepository.findMany({
                plan_id: lastPlan.id,
            });
            const lastSupplies = await this.supplyRepository.findMany({
                AND: [
                    { supplier_catalog: { is: { plan_id: lastPlan.id } } },
                    { consumer_catalog: { is: { plan_id: lastPlan.id } } },
                ],
            });

            const catalogIdMapping: Record<number, number> = {};
            for (const oldCat of lastCatalogs) {
                const newCat = await this.catalogRepository.create({
                    plan_id: newPlan.id,
                    product_id: oldCat.product_id,
                    desired_volume: oldCat.desired_volume,
                });
                catalogIdMapping[oldCat.id] = newCat.id;
            }
            const newSuppliesData = lastSupplies.map((s) => ({
                cost_factor: s.cost_factor,
                supplier_catalog_id: catalogIdMapping[s.supplier_catalog_id],
                consumer_catalog_id: catalogIdMapping[s.consumer_catalog_id],
            }));
            await this.supplyRepository.createMany(newSuppliesData);

            await this.supplyRepository.deleteMany({
                OR: lastSupplies.map((s) => ({ id: s.id })),
            });
            await this.catalogRepository.deleteMany({
                OR: lastCatalogs.map((c) => ({ id: c.id })),
            });

            await this.productionPlanRepository.update({
                id: lastPlan.id,
                status: 'ARCHIVED',
            });
        }

        return newPlan;
    }

    private buildPlanData(
        plan: ProductionPlan,
        pageCatalogs: Catalog[],
        allCatalogs: Catalog[],
        supplies: Supply[],
        details: ProductionPlanDetail[],
        products: Product[],
        participants: Participant[],
        productions: Production[],
        total: number,
    ): ProductionPlanData {
        const productMap = new Map(products.map((p) => [p.id, p]));
        const partMap = new Map(participants.map((p) => [p.id, p.name]));
        const detailMap = new Map(
            details.map((d) => [d.supply_id, d.final_amount]),
        );
        const productionMap = new Map(productions.map((p) => [p.id, p]));
        const allCatalogsMap = new Map(allCatalogs.map((c) => [c.id, c]));

        const suppliesByCatalog = new Map<number, Supply[]>();
        for (const s of supplies) {
            if (!suppliesByCatalog.has(s.supplier_catalog_id))
                suppliesByCatalog.set(s.supplier_catalog_id, []);
            if (!suppliesByCatalog.has(s.consumer_catalog_id))
                suppliesByCatalog.set(s.consumer_catalog_id, []);
            suppliesByCatalog.get(s.supplier_catalog_id)!.push(s);
            suppliesByCatalog.get(s.consumer_catalog_id)!.push(s);
        }

        const catalogs = pageCatalogs.map((cat) => {
            const prod = productMap.get(cat.product_id)!;
            const owner = partMap.get(prod.participant_id)!;
            const production = productionMap.get(prod.production_id)!;

            const suppliesList =
                suppliesByCatalog.get(cat.id)?.map((s) => {
                    const outgoing = s.supplier_catalog_id === cat.id;
                    const direction: 'outgoing' | 'incoming' = outgoing
                        ? 'outgoing'
                        : 'incoming';
                    const peerId = outgoing
                        ? s.consumer_catalog_id
                        : s.supplier_catalog_id;
                    const peerCat = allCatalogsMap.get(peerId)!;
                    const peerProd = productMap.get(peerCat.product_id)!;
                    return {
                        id: s.id,
                        cost_factor: s.cost_factor,
                        final_amount: detailMap.get(s.id),
                        direction,
                        peer_catalog: {
                            id: peerCat.id,
                            product: {
                                ...peerProd,
                                participant_name: partMap.get(
                                    peerProd.participant_id,
                                )!,
                                unit: productionMap.get(peerProd.production_id)!
                                    .unit,
                            },
                        },
                    };
                }) ?? [];

            return {
                id: cat.id,
                product: {
                    ...prod,
                    participant_name: owner,
                    unit: production.unit,
                },
                desired_volume: cat.desired_volume,
                supplies: suppliesList,
            };
        });

        return {
            id: plan.id,
            period_start: plan.period_start,
            period_end: plan.period_end,
            status: plan.status,
            catalogs,
            count: total,
        };
    }

    async calculateProductionPlan(user: UserData) {
        if (user.role !== 'COORDINATOR')
            throw new AccessDeniedError(
                'Только координатор может сделать расчет',
            );

        const plan =
            await this.productionPlanRepository.getLastProductionPlan();
        if (!plan) throw new ProductionPlanException('План не создан');
        if (plan.status !== 'OPEN')
            throw new ProductionPlanException('План уже рассчитан');

        const catalogs = await this.catalogRepository.findMany({
            plan_id: plan.id,
        });
        if (catalogs.length === 0)
            throw new ProductionPlanException('Нет каталогов');

        // Индекс каталога -> позиция
        const idx = new Map<number, number>();
        catalogs.forEach((c, i) => idx.set(c.id, i));

        // Вектор Y
        const Y: Decimal[] = catalogs.map((c) => new Decimal(c.desired_volume));
        const n = catalogs.length;

        // Матрица A (n x n), заполнена нулями
        const A: Decimal[][] = Array.from({ length: n }, () =>
            Array.from({ length: n }, () => new Decimal(0)),
        );

        // Подгружаем поставки, связанные с этими каталогами
        const supplies = await this.supplyRepository.findMany({
            OR: catalogs.flatMap((c) => [
                { supplier_catalog_id: c.id },
                { consumer_catalog_id: c.id },
            ]),
        });

        // Заполняем A и создаём map для быстрого поиска поставки по паре (supplier,consumer)
        const supplyPairMap = new Map<string, Supply>();
        for (const s of supplies) {
            const i = idx.get(s.supplier_catalog_id);
            const j = idx.get(s.consumer_catalog_id);
            if (i === undefined || j === undefined) continue;
            A[i][j] = new Decimal(s.cost_factor);
            supplyPairMap.set(
                `${s.supplier_catalog_id}:${s.consumer_catalog_id}`,
                s,
            );
        }

        // I - A
        const IminusA = A.map((row, i) =>
            row.map((aij, j) =>
                i === j ? new Decimal(1).minus(aij) : aij.neg(),
            ),
        );

        const inv = this.invert(IminusA);
        if (!inv) throw new UnknownError('(I–A) необратима');

        // X = inv * Y
        const X = inv.map((row) =>
            row.reduce(
                (sum, aij, k) => sum.plus(aij.times(Y[k])),
                new Decimal(0),
            ),
        );

        const toCreate: Array<{
            plan_id: number;
            supply_id: number;
            final_amount: number;
        }> = [];

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const amount = A[i][j].times(X[j]);
                if (amount.gt(0)) {
                    const supplierCatalogId = catalogs[i].id;
                    const consumerCatalogId = catalogs[j].id;
                    const sup = supplyPairMap.get(
                        `${supplierCatalogId}:${consumerCatalogId}`,
                    );
                    if (!sup) continue;

                    toCreate.push({
                        plan_id: plan.id,
                        supply_id: sup.id,
                        final_amount: amount.toNumber(),
                    });
                }
            }
        }

        await Promise.all(toCreate.map((c) => this.detailRepository.create(c)));

        return this.productionPlanRepository.update({
            id: plan.id,
            status: 'FINALIZED',
        });
    }

    // Устойчивый Gauss-Jordan с пивотированием строк
    private invert(mat: Decimal[][]): Decimal[][] | null {
        const n = mat.length;
        // создаём расширенную матрицу [mat | I]
        const M = mat.map((r, i) => [
            ...r.map((v) => v),
            ...Array.from(
                { length: n },
                (_, j) => new Decimal(i === j ? 1 : 0),
            ),
        ]);

        for (let i = 0; i < n; i++) {
            // Пивот: если M[i][i] == 0, ищем строку ниже для swap
            if (M[i][i].isZero()) {
                let swapRow = -1;
                for (let k = i + 1; k < n; k++) {
                    if (!M[k][i].isZero()) {
                        swapRow = k;
                        break;
                    }
                }
                if (swapRow === -1) {
                    // матрица сингулярна
                    return null;
                }
                const tmp = M[i];
                M[i] = M[swapRow];
                M[swapRow] = tmp;
            }

            // Нормализуем строку i: делим на pivot
            const pivot = M[i][i];
            for (let j = 0; j < 2 * n; j++) M[i][j] = M[i][j].div(pivot);

            // Обнуляем остальные строковые элементы в столбце i
            for (let k = 0; k < n; k++) {
                if (k === i) continue;
                const factor = M[k][i];
                if (factor.isZero()) continue;
                for (let j = 0; j < 2 * n; j++) {
                    M[k][j] = M[k][j].minus(M[i][j].times(factor));
                }
            }
        }

        // возвращаем правую половину
        return M.map((r) => r.slice(n));
    }
}
