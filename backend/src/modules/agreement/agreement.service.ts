import { Inject, Injectable } from '@nestjs/common';
import {
    AgreementFilter,
    IAgreementRepository,
} from '../../domain/repositories/agreement.interface';
import {
    AGREEMENT_REPOSITORY,
    CATALOG_REPOSITORY,
    PARTICIPANT_REPOSITORY,
    PRODUCT_REPOSITORY,
    PRODUCTION_RELATION_REPOSITORY,
    PRODUCTION_REPOSITORY,
    SUPPLY_REPOSITORY,
    UNIT_OF_WORK,
} from '../../domain/tokens';
import { UserData } from '../../domain/entities/user.entity';
import {
    AccessDeniedError,
    ConflictError,
    EntityAlreadyExistError,
    NotFoundError,
    SupplyException,
} from '../../common/exceptions/exceptions';
import {
    Agreement,
    AgreementData,
    AgreementSideStatus,
    AgreementStatus,
} from '../../domain/entities/agreement.entity';
import { ICatalogRepository } from '../../domain/repositories/catalog.interface';
import { IProductRepository } from '../../domain/repositories/product.interface';
import { IProductionRelationRepository } from '../../domain/repositories/production-relation.interface';
import { PaginatedResult } from '../../domain/repositories/pagination.interface';
import { IParticipantRepository } from '../../domain/repositories/participant.interface';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { IProductionRepository } from '../../domain/repositories/production.interface';
import { ISupplyRepository } from '../../domain/repositories/supply.interface';
import { IUnitOfWork } from '../../application/interfaces/unit-of-work.interface';
import { Catalog, CatalogData } from 'src/domain/entities/catalog.entity';

@Injectable()
export class AgreementService {
    constructor(
        @Inject(AGREEMENT_REPOSITORY)
        private readonly agreementRepo: IAgreementRepository,
        @Inject(CATALOG_REPOSITORY)
        private readonly catalogRepo: ICatalogRepository,
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepo: IProductRepository,
        @Inject(PRODUCTION_REPOSITORY)
        private readonly productionRepo: IProductionRepository,
        @Inject(PRODUCTION_RELATION_REPOSITORY)
        private readonly productionRelationRepo: IProductionRelationRepository,
        @Inject(PARTICIPANT_REPOSITORY)
        private readonly participantRepo: IParticipantRepository,
        @Inject(SUPPLY_REPOSITORY)
        private readonly supplyRepository: ISupplyRepository,
        @Inject(UNIT_OF_WORK)
        private readonly unitOfWork: IUnitOfWork,
    ) {}

    private async toAgreementData(
        agreement: Agreement,
    ): Promise<AgreementData> {
        const [supplierCatalog, consumerCatalog] = await Promise.all([
            this.catalogRepo.findOneById(agreement.supplier_catalog_id),
            this.catalogRepo.findOneById(agreement.consumer_catalog_id),
        ]);

        if (!supplierCatalog || !consumerCatalog) {
            throw new NotFoundError('Каталог не найден');
        }

        const [supplierProduct, consumerProduct] = await Promise.all([
            this.productRepo.findOneById(supplierCatalog.product_id),
            this.productRepo.findOneById(consumerCatalog.product_id),
        ]);

        if (!supplierProduct || !consumerProduct) {
            throw new NotFoundError('Продукт не найден');
        }

        const [participantSupplier, participantConsumer] = await Promise.all([
            this.participantRepo.findOneById(supplierProduct.participant_id),
            this.participantRepo.findOneById(consumerProduct.participant_id),
        ]);

        if (!participantSupplier || !participantConsumer) {
            throw new NotFoundError('Участники не найден');
        }

        const [supplierProduction, consumerProduction] = await Promise.all([
            this.productionRepo.findOneById(supplierProduct.production_id),
            this.productionRepo.findOneById(consumerProduct.production_id),
        ]);

        if (!supplierProduction || !consumerProduction) {
            throw new NotFoundError('Продукция не найден');
        }

        return {
            id: agreement.id,
            cost_factor: agreement.cost_factor,
            linked_supply_id: agreement.linked_supply_id,
            status: agreement.status,
            supplier_status: agreement.supplier_status,
            consumer_status: agreement.consumer_status,
            supplier_catalog: {
                id: supplierCatalog.id,
                desired_volume: supplierCatalog.desired_volume,
                product: {
                    id: supplierProduct.id,
                    name: supplierProduct.name,
                    unit: supplierProduction.unit,
                    production_id: supplierProduct.production_id,
                    participant_name: participantSupplier.name,
                },
            },
            consumer_catalog: {
                id: consumerCatalog.id,
                desired_volume: consumerCatalog.desired_volume,
                product: {
                    id: consumerProduct.id,
                    name: consumerProduct.name,
                    unit: consumerProduction.unit,
                    production_id: consumerProduct.production_id,
                    participant_name: participantConsumer.name,
                },
            },
        };
    }

    private buildFilter(user: UserData): AgreementFilter {
        const filter: AgreementFilter = {};

        if (user.role === 'PARTICIPANT') {
            filter.OR = [
                {
                    supplier_catalog: {
                        is: { product: { participant_id: user.id } },
                    },
                },
                {
                    consumer_catalog: {
                        is: { product: { participant_id: user.id } },
                    },
                },
            ];
        } else if (user.role !== 'COORDINATOR') {
            throw new AccessDeniedError('Нет доступа к соглашениям');
        }

        return filter;
    }

    async getAgreement(id: number, user: UserData): Promise<AgreementData> {
        const filter = this.buildFilter(user);
        const agreement = await this.agreementRepo.findOne({ id, ...filter });

        if (!agreement) {
            throw new NotFoundError('Соглашение не найдено');
        }

        return this.toAgreementData(agreement);
    }

    async getAgreements(
        user: UserData,
        offset?: number,
        limit?: number,
    ): Promise<PaginatedResult<AgreementData>> {
        const filter = this.buildFilter(user);
        const [agreements, count] = await Promise.all([
            this.agreementRepo.findMany(filter, offset, limit),
            this.agreementRepo.count(filter),
        ]);

        const items = await Promise.all(
            agreements.map((a) => this.toAgreementData(a)),
        );

        return { count, items };
    }

    async getPotentialAgreementsForCatalog(
        catalogId: number,
        user: UserData,
        offset?: number,
        limit?: number,
    ): Promise<{
        myCatalog: CatalogData;
        potentialSuppliers: CatalogData[];
        potentialConsumers: CatalogData[];
        existingAgreements: AgreementData[];
    }> {
        if (user.role !== 'PARTICIPANT') {
            throw new AccessDeniedError(
                'Только участники могут просматривать соглашения',
            );
        }

        const catalog = await this.catalogRepo.findOneById(catalogId);
        if (!catalog) throw new NotFoundError('Каталог не найден');

        const product = await this.productRepo.findOneById(catalog.product_id);
        if (!product || product.participant_id !== user.id) {
            throw new AccessDeniedError('Это не ваш каталог');
        }

        const production = await this.productionRepo.findOneById(
            product.production_id,
        );
        if (!production) throw new NotFoundError('Производство не найдено');

        const relations = await this.productionRelationRepo.findMany({
            OR: [
                { production_id: production.id },
                { required_production_id: production.id },
            ],
        });

        const supplierProductionIds = new Set<number>();
        const consumerProductionIds = new Set<number>();

        for (const rel of relations) {
            if (rel.production_id === production.id) {
                supplierProductionIds.add(rel.required_production_id);
            }
            if (rel.required_production_id === production.id) {
                consumerProductionIds.add(rel.production_id);
            }
        }

        const [supplierCatalogs, consumerCatalogs] = await Promise.all([
            supplierProductionIds.size > 0
                ? this.catalogRepo.findMany(
                      {
                          plan_id: catalog.plan_id,
                          product: {
                              is: {
                                  production_id: {
                                      in: Array.from(supplierProductionIds),
                                  },
                                  participant_id: { not: user.id },
                              },
                          },
                      },
                      offset,
                      limit,
                  )
                : [],
            consumerProductionIds.size > 0
                ? this.catalogRepo.findMany(
                      {
                          plan_id: catalog.plan_id,
                          product: {
                              is: {
                                  production_id: {
                                      in: Array.from(consumerProductionIds),
                                  },
                                  participant_id: { not: user.id },
                              },
                          },
                      },
                      offset,
                      limit,
                  )
                : [],
        ]);

        const existingAgreements = await this.agreementRepo.findMany({
            OR: [
                { supplier_catalog_id: catalogId },
                { consumer_catalog_id: catalogId },
            ],
        });

        const [myCatalogData, suppliersData, consumersData, agreementsData] =
            await Promise.all([
                this.toCatalogData(catalog),
                Promise.all(supplierCatalogs.map((c) => this.toCatalogData(c))),
                Promise.all(consumerCatalogs.map((c) => this.toCatalogData(c))),
                Promise.all(
                    existingAgreements.map((a) => this.toAgreementData(a)),
                ),
            ]);

        return {
            myCatalog: myCatalogData,
            potentialSuppliers: suppliersData,
            potentialConsumers: consumersData,
            existingAgreements: agreementsData,
        };
    }

    private async toCatalogData(catalog: Catalog): Promise<CatalogData> {
        const product = await this.productRepo.findOneById(catalog.product_id);
        if (!product) throw new NotFoundError('Продукт не найден');

        const participant = await this.participantRepo.findOneById(
            product.participant_id,
        );
        if (!participant) throw new NotFoundError('Участник не найден');

        const production = await this.productionRepo.findOneById(
            product.production_id,
        );
        if (!production) throw new NotFoundError('Производство не найдено');

        return {
            id: catalog.id,
            desired_volume: catalog.desired_volume,
            product: {
                id: product.id,
                name: product.name,
                unit: production.unit,
                production_id: product.production_id,
                participant_name: participant.name,
            },
        };
    }

    async createAgreement(
        dto: CreateAgreementDto,
        user: UserData,
    ): Promise<AgreementData> {
        if (user.role !== 'PARTICIPANT') {
            throw new AccessDeniedError(
                'Только участники могут создавать соглашения',
            );
        }

        const [supplierCatalog, consumerCatalog] = await Promise.all([
            this.catalogRepo.findOneById(dto.supplier_catalog_id),
            this.catalogRepo.findOneById(dto.consumer_catalog_id),
        ]);

        if (!supplierCatalog || !consumerCatalog) {
            throw new NotFoundError('Каталог не найден');
        }

        const [supplierProduct, consumerProduct] = await Promise.all([
            this.productRepo.findOneById(supplierCatalog.product_id),
            this.productRepo.findOneById(consumerCatalog.product_id),
        ]);

        if (!supplierProduct || !consumerProduct) {
            throw new NotFoundError('Продукт не найден');
        }

        // Проверяем совместимость через production_relation
        const canSupply = await this.productionRelationRepo.existsLink(
            supplierProduct.production_id,
            consumerProduct.production_id,
        );

        if (!canSupply) {
            throw new SupplyException(
                `Продукт "${supplierProduct.name}" не может поставляться для "${consumerProduct.name}". Необходимо создать производственную связь.`,
            );
        }

        if (dto.supplier_catalog_id === dto.consumer_catalog_id) {
            throw new SupplyException(
                'Нельзя создать соглашение с самим собой (одним каталогом)',
            );
        }

        const isSupplier = supplierProduct.participant_id === user.id;
        const isConsumer = consumerProduct.participant_id === user.id;

        if (!isSupplier && !isConsumer) {
            throw new AccessDeniedError(
                'Вы должны быть поставщиком или потребителем в этом соглашении',
            );
        }

        // Проверяем, нет ли уже активного соглашения
        const existing = await this.agreementRepo.findOne({
            supplier_catalog_id: dto.supplier_catalog_id,
            consumer_catalog_id: dto.consumer_catalog_id,
            NOT: { status: 'CANCELLED' },
        });

        if (existing) {
            throw new EntityAlreadyExistError(
                'Активное соглашение уже существует',
            );
        }

        // **КЛЮЧЕВОЕ ИЗМЕНЕНИЕ**: если оба каталога принадлежат одному участнику,
        // автоматически создаём соглашение со статусом COMPLETED и Supply
        const isSameParticipant =
            supplierProduct.participant_id === consumerProduct.participant_id;

        if (isSameParticipant) {
            return this.unitOfWork.runInTransaction(async (tx) => {
                const { agreementRepository, supplyRepository } = tx;

                const supply = await supplyRepository.create({
                    supplier_catalog_id: dto.supplier_catalog_id,
                    consumer_catalog_id: dto.consumer_catalog_id,
                    cost_factor: dto.cost_factor,
                });

                const agreement = await agreementRepository.create({
                    ...dto,
                    status: 'COMPLETED',
                    supplier_status: 'ACCEPTED',
                    consumer_status: 'ACCEPTED',
                    linked_supply_id: supply.id,
                });

                return this.toAgreementData(agreement);
            });
        }

        const agreement = await this.agreementRepo.create({
            ...dto,
            status: 'PENDING',
            supplier_status: isSupplier ? 'ACCEPTED' : 'PENDING',
            consumer_status: isConsumer ? 'ACCEPTED' : 'PENDING',
            linked_supply_id: null,
        });

        return this.toAgreementData(agreement);
    }

    async updateAgreementStatus(
        id: number,
        action: 'accept' | 'cancel',
        user: UserData,
    ): Promise<AgreementData> {
        if (user.role !== 'PARTICIPANT') {
            throw new AccessDeniedError(
                'Только участники могут обновлять соглашения',
            );
        }

        const agreement = await this.agreementRepo.findOneById(id);
        if (!agreement) {
            throw new NotFoundError('Соглашение не найдено');
        }

        const [supplierCatalog, consumerCatalog] = await Promise.all([
            this.catalogRepo.findOneById(agreement.supplier_catalog_id),
            this.catalogRepo.findOneById(agreement.consumer_catalog_id),
        ]);

        if (!supplierCatalog || !consumerCatalog) {
            throw new NotFoundError('Каталог не найден');
        }

        const [supplierProduct, consumerProduct] = await Promise.all([
            this.productRepo.findOneById(supplierCatalog.product_id),
            this.productRepo.findOneById(consumerCatalog.product_id),
        ]);

        if (!supplierProduct || !consumerProduct) {
            throw new NotFoundError('Продукт не найден');
        }

        // **ВАЖНО**: проверяем, что это не внутреннее соглашение
        const isSameParticipant =
            supplierProduct.participant_id === consumerProduct.participant_id;
        if (isSameParticipant) {
            throw new AccessDeniedError(
                'Внутренние соглашения нельзя изменять через этот эндпоинт',
            );
        }

        const isSupplier = supplierProduct.participant_id === user.id;
        const isConsumer = consumerProduct.participant_id === user.id;

        if (!isSupplier && !isConsumer) {
            throw new AccessDeniedError('Вы не участвуете в этом соглашении');
        }

        let newSupplierStatus: AgreementSideStatus = agreement.supplier_status;
        let newConsumerStatus: AgreementSideStatus = agreement.consumer_status;
        let newStatus: AgreementStatus = agreement.status;

        if (action === 'cancel') {
            if (isSupplier) newSupplierStatus = 'CANCELLED';
            if (isConsumer) newConsumerStatus = 'CANCELLED';

            newStatus = 'CANCELLED';
        } else if (action === 'accept') {
            if (isSupplier) newSupplierStatus = 'ACCEPTED';
            if (isConsumer) newConsumerStatus = 'ACCEPTED';

            if (
                newSupplierStatus === 'ACCEPTED' &&
                newConsumerStatus === 'ACCEPTED'
            ) {
                newStatus = 'COMPLETED';
            } else {
                newStatus = 'ACTIVE';
            }
        }

        return this.unitOfWork
            .runInTransaction(async (tx) => {
                const { agreementRepository, supplyRepository } = tx;

                if (newStatus === 'COMPLETED') {
                    const supply = await supplyRepository.create({
                        supplier_catalog_id: agreement.supplier_catalog_id,
                        consumer_catalog_id: agreement.consumer_catalog_id,
                        cost_factor: agreement.cost_factor,
                    });

                    return agreementRepository.update({
                        id,
                        supplier_status: newSupplierStatus,
                        consumer_status: newConsumerStatus,
                        status: newStatus,
                        linked_supply_id: supply.id,
                    });
                } else if (newStatus === 'CANCELLED') {
                    if (agreement.linked_supply_id) {
                        await supplyRepository.delete(
                            agreement.linked_supply_id,
                        );
                    }

                    return agreementRepository.update({
                        id,
                        supplier_status: newSupplierStatus,
                        consumer_status: newConsumerStatus,
                        status: newStatus,
                        linked_supply_id: null,
                    });
                } else {
                    return agreementRepository.update({
                        id,
                        supplier_status: newSupplierStatus,
                        consumer_status: newConsumerStatus,
                        status: newStatus,
                    });
                }
            })
            .then((updated) => this.toAgreementData(updated));
    }

    async deleteAgreement(id: number, user: UserData): Promise<AgreementData> {
        const agreement = await this.agreementRepo.findOneById(id);
        if (!agreement) {
            throw new NotFoundError('Соглашение не найдено');
        }

        if (user.role === 'PARTICIPANT') {
            const [supplierCatalog, consumerCatalog] = await Promise.all([
                this.catalogRepo.findOneById(agreement.supplier_catalog_id),
                this.catalogRepo.findOneById(agreement.consumer_catalog_id),
            ]);

            if (!supplierCatalog || !consumerCatalog) {
                throw new NotFoundError('Каталог не найден');
            }

            const [supplierProduct, consumerProduct] = await Promise.all([
                this.productRepo.findOneById(supplierCatalog.product_id),
                this.productRepo.findOneById(consumerCatalog.product_id),
            ]);

            if (!supplierProduct || !consumerProduct) {
                throw new NotFoundError('Продукт не найден');
            }

            const isSupplier = supplierProduct.participant_id === user.id;
            const isConsumer = consumerProduct.participant_id === user.id;

            if (!isSupplier && !isConsumer) {
                throw new AccessDeniedError(
                    'Вы не можете удалить это соглашение',
                );
            }
            if (agreement.linked_supply_id) {
                throw new ConflictError(
                    'Вы не можете удалить это соглашение, когда принята обоим участником',
                );
            }
        } else if (user.role !== 'COORDINATOR') {
            throw new AccessDeniedError('Нет доступа к удалению соглашений');
        }

        const deleted = await this.agreementRepo.delete(id);
        return this.toAgreementData(deleted);
    }
}
