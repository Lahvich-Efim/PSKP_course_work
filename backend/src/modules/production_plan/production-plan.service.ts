import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ProductionPlan } from '@prisma/client';
import {
    AccessDeniedError,
    ProductionPlanException,
    UnknownError,
} from '../../shared/exceptions/exceptions';
import {
    IProductionPlanRepository,
    PRODUCTION_PLAN_REPOSITORY,
} from './production-plan.interface';
import { ProductionPlanData } from './production-plan.entity';
import { CreateProductionPlanDto } from './dto/create-production-plan.dto';
import {
    IProductRepository,
    PRODUCT_REPOSITORY,
} from '../product/product.interface';
import {
    ISupplyRepository,
    SUPPLY_REPOSITORY,
} from '../supply/supply.interface';
import {
    IProductionPlanDetailRepository,
    PRODUCTION_PLAN_DETAIL_REPOSITORY,
} from '../production_plan_detail/production-plan-detail.interface';
import {
    IParticipantRepository,
    PARTICIPANT_REPOSITORY,
} from '../participant/participant.interface';
import { UserData } from '../users/user.entity';
import { Catalog } from '../catalog/catalog.entity';
import { Supply } from '../supply/supply.entity';
import { ProductionPlanDetail } from '../production_plan_detail/production-plan-detail.entity';
import { Product } from '../product/product.entity';
import { Participant } from '../participant/participant.entity';
import Decimal from 'decimal.js';
import {
    CATALOG_REPOSITORY,
    ICatalogRepository,
} from '../catalog/catalog.interface';

@Injectable()
export class ProductionPlanService {
    constructor(
        @Inject(PRODUCTION_PLAN_REPOSITORY)
        private readonly productionPlanRepository: IProductionPlanRepository,
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: IProductRepository,
        @Inject(forwardRef(() => CATALOG_REPOSITORY))
        private readonly catalogRepository: ICatalogRepository,
        @Inject(SUPPLY_REPOSITORY)
        private readonly supplyRepository: ISupplyRepository,
        @Inject(PRODUCTION_PLAN_DETAIL_REPOSITORY)
        private readonly detailRepository: IProductionPlanDetailRepository,
        @Inject(PARTICIPANT_REPOSITORY)
        private readonly participantRepository: IParticipantRepository,
    ) {}

    async getLastProductionPlan(
        user: UserData,
        offset: number = 0,
        limit: number = 0,
    ): Promise<ProductionPlanData> {
        const plan =
            await this.productionPlanRepository.getLastProductionPlan();
        if (!plan)
            throw new ProductionPlanException(
                'План производства не был создан',
            );

        const allCatalogs = await this.catalogRepository.findMany({
            plan_id: plan.id,
            product:
                user.role !== 'COORDINATOR'
                    ? {
                          participant_id: user.id,
                      }
                    : {},
        });

        const products = await this.productRepository.findMany({});

        const total = allCatalogs.length;
        const pageCatalogs =
            limit > 0
                ? allCatalogs.slice(offset * limit, offset * limit + limit)
                : allCatalogs;

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
        const participants = await this.participantRepository.findMany();

        return this.buildPlanData(
            plan,
            pageCatalogs,
            allCatalogs,
            supplies,
            details,
            products,
            participants,
            total,
        );
    }

    async createProductionPlan(
        params: CreateProductionPlanDto,
        user: UserData,
    ): Promise<ProductionPlan> {
        if (user.role !== 'COORDINATOR')
            throw new AccessDeniedError('Не имеете право доступа к ресурсу');

        const lastPlan =
            await this.productionPlanRepository.getLastProductionPlan();

        const newPlan = await this.productionPlanRepository.create({
            period: params.period,
            status: 'OPEN',
        });

        if (!lastPlan) {
            const products = await this.productRepository.findMany({});
            const newProductMapping: Record<number, number> = {};

            for (const product of products) {
                const duplicatedProduct = await this.productRepository.create({
                    name: product.name,
                    unit: product.unit,
                    participant_id: product.participant_id,
                });
                newProductMapping[product.id] = duplicatedProduct.id;
            }

            const newCatalogs = products.map((product) => ({
                plan_id: newPlan.id,
                product_id: newProductMapping[product.id],
                desired_volume: 0,
            }));
            await this.catalogRepository.createMany(newCatalogs);
        } else if (lastPlan.status === 'FINALIZED') {
            const lastCatalogs = await this.catalogRepository.findMany({
                plan_id: lastPlan.id,
            });

            const productIdsInLastPlan = Array.from(
                new Set(lastCatalogs.map((c) => c.product_id)),
            );
            const orFilterProductsInLastPlan = productIdsInLastPlan.map(
                (id) => ({ id }),
            );
            const productsToDuplicate =
                productIdsInLastPlan.length > 0
                    ? await this.productRepository.findMany({
                          OR: orFilterProductsInLastPlan,
                      })
                    : [];

            const productIdMapping: Record<number, number> = {};
            for (const product of productsToDuplicate) {
                const duplicatedProduct = await this.productRepository.create({
                    name: product.name,
                    unit: product.unit,
                    participant_id: product.participant_id,
                });
                productIdMapping[product.id] = duplicatedProduct.id;
            }

            const catalogIdMapping: Record<number, number> = {};
            for (const catalog of lastCatalogs) {
                const newCatalog = await this.catalogRepository.create({
                    product_id: productIdMapping[catalog.product_id],
                    desired_volume: catalog.desired_volume,
                    plan_id: newPlan.id,
                });
                catalogIdMapping[catalog.id] = newCatalog.id;
            }

            const supplies = await this.supplyRepository.findMany({
                supplier_catalog: { plan_id: lastPlan.id },
                consumer_catalog: { plan_id: lastPlan.id },
            });

            if (supplies.length) {
                const newSupplies = supplies.map((supply) => ({
                    cost_factor: supply.cost_factor,
                    consumer_catalog_id:
                        catalogIdMapping[supply.consumer_catalog_id],
                    supplier_catalog_id:
                        catalogIdMapping[supply.supplier_catalog_id],
                }));
                await this.supplyRepository.createMany(newSupplies);
            }
        }

        if (lastPlan) {
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
        total: number,
    ): ProductionPlanData {
        const prodMap = new Map(products.map((p) => [p.id, p]));
        const partMap = new Map(participants.map((p) => [p.id, p.name]));
        const detailMap = new Map(
            details.map((d) => [d.supply_id, d.final_amount]),
        );

        const catalogs = pageCatalogs.map((cat) => {
            const prod = prodMap.get(cat.product_id)!;
            const owner = partMap.get(prod.participant_id)!;

            const suppliesList = supplies
                .filter(
                    (s) =>
                        s.supplier_catalog_id === cat.id ||
                        s.consumer_catalog_id === cat.id,
                )
                .map((s) => {
                    const outgoing = s.supplier_catalog_id === cat.id;
                    const direction: 'outgoing' | 'incoming' = outgoing
                        ? 'outgoing'
                        : 'incoming';
                    const peerId = outgoing
                        ? s.consumer_catalog_id
                        : s.supplier_catalog_id;
                    const peerCat = allCatalogs.find((a) => a.id === peerId)!;
                    const peerProd = prodMap.get(peerCat.product_id)!;
                    return {
                        id: s.id,
                        cost_factor: s.cost_factor,
                        final_amount: detailMap.get(s.id),
                        direction,
                        peer_catalog: {
                            id: peerCat.id,
                            product: peerProd,
                            participant: partMap.get(peerProd.participant_id)!,
                        },
                    };
                });

            return {
                id: cat.id,
                product: prod,
                participant: owner,
                desired_volume: cat.desired_volume,
                supplies: suppliesList,
            };
        });

        return {
            id: plan.id,
            period: plan.period,
            status: plan.status,
            catalogs,
            count: total,
        };
    }

    async calculateProductionPlan(user: UserData) {
        if (user.role !== 'COORDINATOR')
            throw new AccessDeniedError('Нужна роль COORDINATOR');

        // 1. Получаем текущий план
        const plan =
            await this.productionPlanRepository.getLastProductionPlan();
        if (!plan) throw new ProductionPlanException('План не создан');
        if (plan.status !== 'OPEN')
            throw new ProductionPlanException('План уже рассчитан');

        // 2. Получаем все каталоги текущего плана
        const catalogs = await this.catalogRepository.findMany({
            plan_id: plan.id,
        });
        if (catalogs.length === 0)
            throw new ProductionPlanException('Нет каталогов');

        // 3. Составляем индекс
        const idx = new Map<number, number>();
        catalogs.forEach((c, i) => idx.set(c.id, i));

        // 4. Вектор Y и матрица A
        const Y: Decimal[] = catalogs.map((c) => new Decimal(c.desired_volume));
        const A: Decimal[][] = Array.from({ length: catalogs.length }, () =>
            Array.from({ length: catalogs.length }, () => new Decimal(0)),
        );

        // 5. Загружаем все поставки, где участвуют наши каталоги
        const orFilterSupplies = catalogs.flatMap((c) => [
            { supplier_catalog_id: c.id },
            { consumer_catalog_id: c.id },
        ]);
        const supplies = await this.supplyRepository.findMany({
            OR: orFilterSupplies,
        });

        // 6. Заполняем A[i][j] = cost_factor
        for (const s of supplies) {
            const i = idx.get(s.supplier_catalog_id)!;
            const j = idx.get(s.consumer_catalog_id)!;
            A[i][j] = new Decimal(s.cost_factor);
        }

        // 7. Строим I−A
        const IminusA = A.map((row, i) =>
            row.map((aij, j) =>
                i === j ? new Decimal(1).minus(aij) : aij.neg(),
            ),
        );

        // 8. Инверсия через Gauss-Jordan Decimal
        const inv = this.invert(IminusA);
        if (!inv) throw new UnknownError('(I–A) необратима');

        // 9. X = inv * Y
        const X = inv.map((row) =>
            row.reduce(
                (sum, aij, k) => sum.plus(aij.times(Y[k])),
                new Decimal(0),
            ),
        );

        // 10. U = A * X и сохранение деталей
        for (let i = 0; i < catalogs.length; i++) {
            for (let j = 0; j < catalogs.length; j++) {
                const amount = A[i][j].times(X[j]);
                if (amount.gt(0)) {
                    const supplierId = catalogs[i].id;
                    const consumerId = catalogs[j].id;
                    const sup = supplies.find(
                        (s) =>
                            s.supplier_catalog_id === supplierId &&
                            s.consumer_catalog_id === consumerId,
                    );
                    if (sup) {
                        await this.detailRepository
                            .create({
                                plan_id: plan.id,
                                supply_id: sup.id,
                                final_amount: amount.toNumber(),
                            })
                            .catch(async () => {
                                const existing =
                                    await this.detailRepository.findOne({
                                        supply_id: sup.id,
                                    });
                                if (existing) {
                                    await this.detailRepository.update({
                                        id: existing.id,
                                        final_amount: amount.toNumber(),
                                    });
                                }
                            });
                    }
                }
            }
        }

        return this.productionPlanRepository.update({
            id: plan.id,
            status: 'FINALIZED',
        });
    }

    private invert(mat: Decimal[][]): Decimal[][] | null {
        const n = mat.length;
        const M = mat.map((r, i) => [
            ...r.map((v) => v),
            ...Array.from(
                { length: n },
                (_, j) => new Decimal(i === j ? 1 : 0),
            ),
        ]);

        for (let i = 0; i < n; i++) {
            const pivot = M[i][i];
            if (pivot.isZero()) return null;
            for (let j = 0; j < 2 * n; j++) M[i][j] = M[i][j].div(pivot);
            for (let k = 0; k < n; k++) {
                if (k === i) continue;
                const factor = M[k][i];
                for (let j = 0; j < 2 * n; j++)
                    M[k][j] = M[k][j].minus(M[i][j].times(factor));
            }
        }
        return M.map((r) => r.slice(n));
    }
}
