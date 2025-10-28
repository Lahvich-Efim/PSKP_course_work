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
} from '../../domain/tokens';
import { UserData } from '../../domain/entities/user.entity';
import {
    AccessDeniedError,
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
                'Нельзя создать соглашение с самим собой',
            );
        }

        // Проверяем, что пользователь - владелец одного из каталогов
        const isSupplier = supplierProduct.participant_id === user.id;
        const isConsumer = consumerProduct.participant_id === user.id;

        if (!isSupplier && !isConsumer) {
            throw new AccessDeniedError(
                'Вы должны быть поставщиком или потребителем',
            );
        }

        // Проверяем на дубликаты
        const existing = await this.agreementRepo.findOne({
            supplier_catalog_id: dto.supplier_catalog_id,
            consumer_catalog_id: dto.consumer_catalog_id,
            NOT: { status: 'CANCELLED' },
        });

        if (existing) {
            throw new EntityAlreadyExistError(
                'Такое соглашение уже существует',
            );
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

        // Проверяем участие
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
                newStatus = 'ACTIVE';
            }
        }

        const updated = await this.agreementRepo.update({
            id,
            supplier_status: newSupplierStatus,
            consumer_status: newConsumerStatus,
            status: newStatus,
        });

        return this.toAgreementData(updated);
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
        } else if (user.role !== 'COORDINATOR') {
            throw new AccessDeniedError('Нет доступа к удалению соглашений');
        }

        const deleted = await this.agreementRepo.delete(id);
        return this.toAgreementData(deleted);
    }
}
