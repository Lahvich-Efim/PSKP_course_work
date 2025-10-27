import { Injectable } from '@nestjs/common';
import {
    CreateProduct,
    IProductRepository,
    ProductFilter,
    UpdateProduct,
} from '../../../domain/repositories/product.interface';
import { Product } from '../../../domain/entities/product.entity';
import { UserData } from '../../../domain/entities/user.entity';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma.service';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class ProductRepository
    extends BaseRepository
    implements IProductRepository
{
    constructor(protected readonly prisma: PrismaService) {
        super(prisma);
    }

    static withTransaction(tx: PrismaClient | Prisma.TransactionClient) {
        return new ProductRepository(tx as unknown as PrismaService);
    }

    async findOneById(productId: number): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: { id: productId },
        });
    }

    async findOne(where: ProductFilter): Promise<Product | null> {
        return this.prisma.product.findFirst({
            where,
        });
    }

    async findMany(
        where: ProductFilter,
        offset?: number,
        limit?: number,
    ): Promise<Product[]> {
        return this.prisma.product.findMany({
            where,
            skip: offset,
            take: limit,
        });
    }

    async isExists(where: ProductFilter, productId?: number): Promise<boolean> {
        return !!(await this.prisma.product.findFirst({
            where: {
                id: productId,
                ...where,
            },
        }));
    }

    async create(product: CreateProduct): Promise<Product> {
        return this.prisma.product.create({
            data: product,
        });
    }

    async update(product: UpdateProduct): Promise<Product> {
        const { id, ...data } = product;
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    async delete(productId: number): Promise<Product> {
        return this.prisma.product.delete({
            where: { id: productId },
        });
    }

    async isProductOwner(user: UserData, productId: number): Promise<boolean> {
        return !!(await this.prisma.product.findFirst({
            where: {
                id: productId,
                participant: {
                    id: user.id,
                },
            },
        }));
    }

    count(where?: ProductFilter): Promise<number> {
        return this.prisma.product.count({ where });
    }
}
