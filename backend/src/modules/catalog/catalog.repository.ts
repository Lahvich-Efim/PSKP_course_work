import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Catalog } from './catalog.entity';
import {
    CatalogFilter,
    CreateCatalog,
    ICatalogRepository,
    UpdateCatalog,
} from './catalog.interface';

@Injectable()
export class CatalogRepository implements ICatalogRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findOneById(
        catalogId: number,
        where?: CatalogFilter,
    ): Promise<Catalog | null> {
        return this.prisma.catalog.findUnique({
            where: {
                id: catalogId,
                ...where,
            },
        });
    }

    async create(catalog: CreateCatalog): Promise<Catalog> {
        return this.prisma.catalog.create({
            data: {
                plan: {
                    connect: {
                        id: catalog.plan_id,
                    },
                },
                product: {
                    connect: {
                        id: catalog.product_id,
                    },
                },
                desired_volume: catalog.desired_volume,
            },
        });
    }

    async delete(catalogId: number): Promise<Catalog> {
        return this.prisma.catalog.delete({
            where: {
                id: catalogId,
            },
        });
    }

    async findMany(
        where?: CatalogFilter,
        offset?: number,
        limit?: number,
    ): Promise<Catalog[]> {
        return this.prisma.catalog.findMany({
            where,
            skip: offset,
            take: limit,
        });
    }

    async findOne(where: CatalogFilter): Promise<Catalog | null> {
        return this.prisma.catalog.findFirst({
            where,
        });
    }

    async update(catalog: UpdateCatalog): Promise<Catalog> {
        const { id, ...catalogData } = catalog;
        return await this.prisma.catalog.update({
            where: {
                id,
            },
            data: {
                desired_volume: catalogData.desired_volume,
                product_id: catalogData.product_id,
            },
        });
    }

    async createMany(catalogs: CreateCatalog[]): Promise<number> {
        const new_catalogs = await this.prisma.catalog.createMany({
            data: catalogs,
        });
        return new_catalogs.count;
    }

    count(where?: CatalogFilter): Promise<number> {
        return this.prisma.catalog.count({ where });
    }
}
