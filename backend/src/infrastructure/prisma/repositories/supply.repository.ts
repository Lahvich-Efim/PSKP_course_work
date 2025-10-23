import { Injectable } from '@nestjs/common';
import {
    CreateSupply,
    ISupplyRepository,
    SupplyFilter,
    UpdateSupply,
} from '../../../domain/repositories/supply.interface';
import { Supply } from '../../../domain/entities/supply.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class SupplyRepository
    extends BaseRepository
    implements ISupplyRepository
{
    async create(supply: CreateSupply): Promise<Supply> {
        return await this.prisma.supply.create({
            data: supply,
        });
    }

    async delete(supplyId: number): Promise<Supply> {
        return this.prisma.supply.delete({
            where: {
                id: supplyId,
            },
        });
    }

    async findMany(
        where: SupplyFilter,
        offset?: number,
        limit?: number,
    ): Promise<Supply[]> {
        return this.prisma.supply.findMany({
            where,
            skip: offset,
            take: limit,
        });
    }

    async findOne(where: SupplyFilter): Promise<Supply | null> {
        return this.prisma.supply.findFirst({
            where,
        });
    }

    async findOneById(supplyId: number): Promise<Supply | null> {
        return this.prisma.supply.findUnique({
            where: {
                id: supplyId,
            },
        });
    }

    async update(supply: UpdateSupply): Promise<Supply> {
        const { id, ...supplyData } = supply;
        return this.prisma.supply.update({
            data: supplyData,
            where: {
                id,
            },
        });
    }

    async createMany(supplies: CreateSupply[]): Promise<number> {
        const new_supplies = await this.prisma.supply.createMany({
            data: supplies,
        });
        return new_supplies.count;
    }

    async count(where?: SupplyFilter): Promise<number> {
        return this.prisma.supply.count({ where });
    }

    async deleteMany(where?: SupplyFilter): Promise<number> {
        const result = await this.prisma.supply.deleteMany({ where });
        return result.count;
    }
}
