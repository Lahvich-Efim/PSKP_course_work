import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    CreateSupply,
    ISupplyRepository,
    SupplyFilter,
    UpdateSupply,
} from './supply.interface';
import { Supply } from './supply.entity';
import { ProductionPlanDetailFilter } from '../production_plan_detail/production-plan-detail.interface';

@Injectable()
export class SupplyRepository implements ISupplyRepository {
    constructor(private readonly prisma: PrismaService) {}

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

    async findOneById(
        supplyId: number,
        where?: SupplyFilter,
    ): Promise<Supply | null> {
        return this.prisma.supply.findUnique({
            where: {
                id: supplyId,
                ...where,
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
