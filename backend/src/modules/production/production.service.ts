import { Inject, Injectable } from '@nestjs/common';
import {
    CreateProduction,
    IProductionRepository,
    ProductionFilter,
    UpdateProduction,
} from '../../domain/repositories/production.interface';
import { PRODUCTION_REPOSITORY } from '../../domain/tokens';
import { UserData } from '../../domain/entities/user.entity';
import {
    AccessDeniedError,
    EntityAlreadyExistError,
    NotFoundError,
} from '../../common/exceptions/exceptions';
import { ProductionData } from '../../domain/entities/production.entity';
import { PaginatedResult } from '../../domain/repositories/pagination.interface';

@Injectable()
export class ProductionService {
    constructor(
        @Inject(PRODUCTION_REPOSITORY)
        private readonly repo: IProductionRepository,
    ) {}

    private buildFilter(user: UserData): ProductionFilter {
        const filter: ProductionFilter = {};
        if (user.role !== 'COORDINATOR' && user.role !== 'PARTICIPANT') {
            throw new AccessDeniedError('Нет доступа к производствам');
        }
        return filter;
    }

    async getProductions(
        user: UserData,
        offset?: number,
        limit?: number,
    ): Promise<PaginatedResult<ProductionData>> {
        const where = this.buildFilter(user);
        console.log(where);
        const [rawItems, count] = await Promise.all([
            this.repo.findMany(where, offset, limit),
            this.repo.count(where),
        ]);
        console.log(rawItems);
        return { count, items: rawItems };
    }

    async getProduction(id: number, user: UserData): Promise<ProductionData> {
        const where = this.buildFilter(user);
        const prod = await this.repo.findOne({ id, ...where });
        if (!prod) throw new NotFoundError('Производство не найдено');
        return prod;
    }

    async createProduction(
        dto: CreateProduction,
        user: UserData,
    ): Promise<ProductionData> {
        if (user.role !== 'COORDINATOR')
            throw new AccessDeniedError(
                'Только координатор может создавать производство',
            );

        if (await this.repo.isExists({ name: dto.name }))
            throw new EntityAlreadyExistError(
                'Производство с таким именем уже существует',
            );

        return this.repo.create(dto);
    }

    async updateProduction(
        dto: UpdateProduction,
        user: UserData,
    ): Promise<ProductionData> {
        if (user.role !== 'COORDINATOR')
            throw new AccessDeniedError(
                'Только координатор может обновлять производство',
            );

        const exists = await this.repo.findOneById(dto.id);
        if (!exists) throw new NotFoundError('Производство не найдено');

        return this.repo.update(dto);
    }

    async deleteProduction(
        id: number,
        user: UserData,
    ): Promise<ProductionData> {
        if (user.role !== 'COORDINATOR')
            throw new AccessDeniedError(
                'Только координатор может удалять производство',
            );

        const exists = await this.repo.findOneById(id);
        if (!exists) throw new NotFoundError('Производство не найдено');

        return this.repo.delete(id);
    }
}
