import { Inject, Injectable } from '@nestjs/common';
import {
    CreateProductionRelation,
    IProductionRelationRepository,
    ProductionRelationFilter,
} from '../../domain/repositories/production-relation.interface';
import { UserData } from '../../domain/entities/user.entity';
import {
    AccessDeniedError,
    EntityAlreadyExistError,
    NotFoundError,
} from '../../common/exceptions/exceptions';
import { ProductRelationData } from '../../domain/entities/production-relation.entity';
import { IProductionRepository } from '../../domain/repositories/production.interface';
import { PaginatedResult } from '../../domain/repositories/pagination.interface';
import {
    PRODUCTION_RELATION_REPOSITORY,
    PRODUCTION_REPOSITORY,
} from '../../domain/tokens';

@Injectable()
export class ProductionRelationService {
    constructor(
        @Inject(PRODUCTION_RELATION_REPOSITORY)
        private readonly repo: IProductionRelationRepository,
        @Inject(PRODUCTION_REPOSITORY)
        private readonly productionRepo: IProductionRepository,
    ) {}

    private async toProductRelationData(
        id: number,
        production_id: number,
        required_production_id: number,
    ): Promise<ProductRelationData> {
        const [production, required_production] = await Promise.all([
            this.productionRepo.findOneById(production_id),
            this.productionRepo.findOneById(required_production_id),
        ]);

        if (!production || !required_production) {
            throw new NotFoundError('Продукция не найдена');
        }

        return {
            id,
            production,
            required_production,
        };
    }

    async getProductionRelation(
        id: number,
        user: UserData,
    ): Promise<ProductRelationData> {
        if (user.role !== 'COORDINATOR') {
            throw new AccessDeniedError(
                'Нет доступа к производственным связям',
            );
        }

        const relation = await this.repo.findOneById(id);
        if (!relation) {
            throw new NotFoundError('Связь не найдена');
        }

        return this.toProductRelationData(
            relation.id,
            relation.production_id,
            relation.required_production_id,
        );
    }

    async getProductionRelations(
        user: UserData,
        offset?: number,
        limit?: number,
        filter?: ProductionRelationFilter,
    ): Promise<PaginatedResult<ProductRelationData>> {
        if (user.role !== 'COORDINATOR' && user.role !== 'PARTICIPANT') {
            throw new AccessDeniedError(
                'Нет доступа к производственным связям',
            );
        }

        const [rawItems, count] = await Promise.all([
            this.repo.findMany(filter, offset, limit),
            this.repo.count(filter),
        ]);

        const items = await Promise.all(
            rawItems.map((r) =>
                this.toProductRelationData(
                    r.id,
                    r.production_id,
                    r.required_production_id,
                ),
            ),
        );

        return { count, items };
    }

    async createProductionRelation(
        dto: CreateProductionRelation,
        user: UserData,
    ): Promise<ProductRelationData> {
        if (user.role !== 'COORDINATOR') {
            throw new AccessDeniedError(
                'Только координатор может создавать производственные связи',
            );
        }

        if (dto.production_id === dto.required_production_id) {
            throw new EntityAlreadyExistError(
                'Производство не может зависеть от самого себя',
            );
        }

        const [production, requiredProduction] = await Promise.all([
            this.productionRepo.findOneById(dto.production_id),
            this.productionRepo.findOneById(dto.required_production_id),
        ]);

        if (!production || !requiredProduction) {
            throw new NotFoundError('Производство не найдено');
        }

        const exists = await this.repo.existsLink(
            dto.required_production_id,
            dto.production_id,
        );

        if (exists) {
            throw new EntityAlreadyExistError('Такая связь уже существует');
        }

        const created = await this.repo.create(dto);

        return this.toProductRelationData(
            created.id,
            created.production_id,
            created.required_production_id,
        );
    }

    async deleteProductionRelation(
        id: number,
        user: UserData,
    ): Promise<ProductRelationData> {
        if (user.role !== 'COORDINATOR') {
            throw new AccessDeniedError(
                'Только координатор может удалять производственные связи',
            );
        }

        const relation = await this.repo.findOneById(id);
        if (!relation) {
            throw new NotFoundError('Связь не найдена');
        }

        const deleted = await this.repo.delete(id);

        return this.toProductRelationData(
            deleted.id,
            deleted.production_id,
            deleted.required_production_id,
        );
    }
}
