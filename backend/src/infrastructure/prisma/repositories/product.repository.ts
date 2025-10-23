import { Injectable } from '@nestjs/common';
import {
    IProductRepository,
    ProductFilter,
} from '../../../core/interfaces/product.interface';
import { Product } from '../../../core/entities/product.entity';
import { UserData } from '../../../core/entities/user.entity';
import { BaseRepository } from './base.repository';

export type CreateProduct = Omit<Product, 'id'>;
export type UpdateProduct = Partial<Product> & { id: number };

@Injectable()
export class ProductRepository
    extends BaseRepository
    implements IProductRepository
{
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
