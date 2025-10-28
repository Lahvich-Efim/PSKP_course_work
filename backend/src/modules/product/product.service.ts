import { Inject, Injectable } from '@nestjs/common';
import { Product, ProductData } from '../../domain/entities/product.entity';
import {
    AccessDeniedError,
    EntityAlreadyExistError,
    NotFoundError,
    UnknownError,
} from '../../common/exceptions/exceptions';
import { UserData } from '../../domain/entities/user.entity';
import { PlanContextService } from '../../infrastructure/plan-context.service';
import {
    CATALOG_REPOSITORY,
    PARTICIPANT_REPOSITORY,
    PRODUCT_REPOSITORY,
    PRODUCTION_REPOSITORY,
} from '../../domain/tokens';
import {
    CreateProduct,
    IProductRepository,
    ProductFilter,
    UpdateProduct,
} from '../../domain/repositories/product.interface';
import { ICatalogRepository } from '../../domain/repositories/catalog.interface';
import { IParticipantRepository } from '../../domain/repositories/participant.interface';
import { PaginatedResult } from '../../domain/repositories/pagination.interface';
import { IProductionRepository } from '../../domain/repositories/production.interface';

@Injectable()
export class ProductService {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly repository: IProductRepository,
        @Inject(PRODUCTION_REPOSITORY)
        private readonly productionRepository: IProductionRepository,
        private readonly planContext: PlanContextService,
        @Inject(CATALOG_REPOSITORY)
        private readonly catalogRepository: ICatalogRepository,
        @Inject(PARTICIPANT_REPOSITORY)
        private readonly participantRepository: IParticipantRepository,
    ) {}

    private async sanitize(product: Product): Promise<ProductData> {
        const { participant_id, ...rest } = product;
        const participant =
            await this.participantRepository.findOneById(participant_id);
        if (!participant) {
            throw new UnknownError(
                `Участник продукта '${product.name}' по какой то причине отсутствует`,
            );
        }

        const production = await this.productionRepository.findOneById(
            product.production_id,
        );
        if (!production) {
            throw new UnknownError(
                `Продукция для продукта '${product.name} по какой то причине отсутствует'`,
            );
        }
        return {
            ...rest,
            unit: production.unit,
            participant_name: participant.name,
        };
    }

    private async checkAccess(
        productId: number,
        user: UserData,
    ): Promise<void> {
        if (user.role !== 'PARTICIPANT') {
            throw new AccessDeniedError(
                'Только участник может управлять продуктами!',
            );
        }

        const product = await this.repository.findOne({
            id: productId,
        });

        if (!product) {
            throw new NotFoundError('Данный продукт не существует!');
        }

        if (product.participant_id !== user.id) {
            throw new AccessDeniedError(
                'Вы можете управлять только своими продуктами!',
            );
        }
    }

    private buildFilter(user: UserData): ProductFilter {
        const filter: ProductFilter = {};
        if (user.role == 'PARTICIPANT') {
            filter.participant_id = user.id;
        } else if (user.role != 'COORDINATOR') {
            throw new AccessDeniedError('Нет доступа к продуктам');
        }
        return filter;
    }

    async getProduct(productId: number, user: UserData): Promise<ProductData> {
        const where: ProductFilter = this.buildFilter(user);
        const product = await this.repository.findOne(where);
        if (!product) {
            throw new NotFoundError('Данный продукт не найден!');
        }
        return this.sanitize(product);
    }

    async getProducts(
        user: UserData,
        offset?: number,
        limit?: number,
        filter?: ProductFilter,
    ): Promise<PaginatedResult<ProductData>> {
        const where: ProductFilter = { ...filter, ...this.buildFilter(user) };
        const [rawItems, count] = await Promise.all([
            this.repository.findMany(where, offset, limit),
            this.repository.count(where),
        ]);

        const items = await Promise.all(rawItems.map((p) => this.sanitize(p)));
        return { count, items };
    }

    async createProduct(
        dto: CreateProduct,
        user: UserData,
    ): Promise<ProductData> {
        await this.planContext.ensurePlanIsOpen();
        if (user.role !== 'PARTICIPANT')
            throw new AccessDeniedError(
                'Только участник может создать продукт',
            );

        if (
            await this.repository.isExists({
                name: dto.name,
            })
        )
            throw new EntityAlreadyExistError(
                'Продукт с таким именем уже существует!',
            );

        const product = await this.repository.create({
            ...dto,
            participant_id: user.id,
        });

        return this.sanitize(product);
    }

    async updateProduct(
        dto: UpdateProduct,
        user: UserData,
    ): Promise<ProductData> {
        await this.planContext.ensurePlanIsOpen();
        await this.checkAccess(dto.id, user);
        if (
            await this.repository.isExists({
                name: dto.name,
                NOT: {
                    id: dto.id,
                },
            })
        )
            throw new EntityAlreadyExistError(
                'Продукт с таким именем уже существует!',
            );

        const updated = await this.repository.update(dto);
        return this.sanitize(updated);
    }

    async deleteProduct(
        productId: number,
        user: UserData,
    ): Promise<ProductData> {
        await this.planContext.ensurePlanIsOpen();
        await this.checkAccess(productId, user);
        const existing_catalog = await this.catalogRepository.count({
            product_id: productId,
            product: {
                is: {},
            },
        });
        if (existing_catalog > 0) {
            throw new EntityAlreadyExistError(
                'Нельзя удалить продукт с выставленным каталогом',
            );
        }
        const deleted = await this.repository.delete(productId);
        return this.sanitize(deleted);
    }
}
