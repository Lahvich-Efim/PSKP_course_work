import { Inject, Injectable } from '@nestjs/common';
import {
    IProductRepository,
    PRODUCT_REPOSITORY,
    ProductFilter,
} from './product.interface';
import { Product, ProductData } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import {
    AccessDeniedError,
    NotFoundError,
} from '../../shared/exceptions/exceptions';
import { PaginatedResult } from '../../shared/pagination.interface';
import { UserData } from '../users/user.entity';
import { UpdateProduct } from './product.repository';
import { PlanContextService } from '../../shared/services/plan-context.service';
import {
    CATALOG_REPOSITORY,
    ICatalogRepository,
} from '../catalog/catalog.interface';
// Удаляем импорт IProductionPlanRepository, так как теперь он инкапсулирован в PlanContextService

@Injectable()
export class ProductService {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly repository: IProductRepository,
        private readonly planContext: PlanContextService,
        @Inject(CATALOG_REPOSITORY)
        private readonly catalogRepository: ICatalogRepository,
        // Удаляем инъекцию productionPlanRepository
    ) {}

    private sanitize(product: Product): ProductData {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { participant_id, ...rest } = product;
        return rest;
    }

    private async checkAccess(
        productId: number,
        user: UserData,
    ): Promise<Product> {
        const product = await this.repository.findOneById(productId);
        if (!product)
            throw new NotFoundError(`Продукт с id ${productId} не найден`);

        if (user.role === 'COORDINATOR') return product;

        if (user.role === 'PARTICIPANT' && product.participant_id === user.id)
            return product;

        throw new AccessDeniedError('Нет доступа к продукту');
    }

    async getProduct(productId: number, user: UserData): Promise<ProductData> {
        const product = await this.checkAccess(productId, user);
        return this.sanitize(product);
    }

    async getActualProduct(
        productId: number,
        user: UserData,
    ): Promise<ProductData> {
        const [plan, archivedPlanIds] = await Promise.all([
            this.planContext.getCurrentPlan(),
            this.planContext.getArchivedPlanIds(), // Используем новый метод из PlanContextService
        ]);

        const archivedCatalogs = await this.catalogRepository.findMany({
            OR: archivedPlanIds.map((id) => ({ plan_id: id })),
            product_id: productId,
        });

        if (archivedCatalogs.length > 0) {
            throw new NotFoundError(
                `Продукт с id ${productId} находится в архивированном плане`,
            );
        }

        const catalog = await this.catalogRepository.findOne({
            plan_id: plan.id,
            product_id: productId,
        });

        if (!catalog) {
            throw new NotFoundError(
                `Актуальный продукт с id ${productId} не найден в текущем плане`,
            );
        }

        const product = await this.checkAccess(productId, user);
        return this.sanitize(product);
    }

    async getProducts(
        user: UserData,
        offset = 0,
        limit = 10,
    ): Promise<PaginatedResult<ProductData>> {
        const where =
            user.role === 'PARTICIPANT' ? { participant_id: user.id } : {};

        const [rawItems, count] = await Promise.all([
            this.repository.findMany(where, offset, limit),
            this.repository.count(where),
        ]);

        const items = rawItems.map((p) => this.sanitize(p));
        return { count, items };
    }

    async getActualProducts(
        user: UserData,
        offset?: number,
        limit?: number,
    ): Promise<PaginatedResult<ProductData>> {
        const archivedPlanIds = await this.planContext.getArchivedPlanIds();

        let archivedProductIds: number[] = [];
        if (archivedPlanIds.length > 0) {
            const archivedCatalogs = await this.catalogRepository.findMany({
                OR: archivedPlanIds.map((id) => ({ plan_id: id })),
            });
            archivedProductIds = Array.from(
                new Set(archivedCatalogs.map((c) => c.product_id)),
            );
        }

        const where: ProductFilter = {};
        if (user.role === 'PARTICIPANT') {
            where.participant_id = user.id;
        } else if (user.role !== 'COORDINATOR') {
            throw new AccessDeniedError('Нет доступа к продуктам');
        }

        const [rawItems, count] = await Promise.all([
            this.repository.findMany(where, offset, limit),
            this.repository.count(where),
        ]);

        // Фильтруем продукты, которые находятся в архивированных планах
        const filteredItems = rawItems.filter(
            (product) => !archivedProductIds.includes(product.id),
        );

        const items = filteredItems.map((p) => this.sanitize(p));
        return { count: filteredItems.length, items };
    }

    async createProduct(
        dto: CreateProductDto,
        user: UserData,
    ): Promise<ProductData> {
        await this.planContext.ensurePlanIsOpen();
        if (user.role !== 'PARTICIPANT')
            throw new AccessDeniedError(
                'Только участник может создать продукт',
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
        const updated = await this.repository.update(dto);
        return this.sanitize(updated);
    }

    async deleteProduct(
        productId: number,
        user: UserData,
    ): Promise<ProductData> {
        await this.planContext.ensurePlanIsOpen();
        await this.checkAccess(productId, user);
        const deleted = await this.repository.delete(productId);
        return this.sanitize(deleted);
    }
}
