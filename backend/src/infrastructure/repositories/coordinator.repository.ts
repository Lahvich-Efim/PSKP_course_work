import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Coordinator } from '../../core/entities/coordinator.entity';
import {
    CreateCoordinator,
    ICoordinatorRepository,
    UpdateCoordinator,
} from '../../core/interfaces/coordinator.interface';

@Injectable()
export class CoordinatorRepository implements ICoordinatorRepository {
    constructor(private readonly prisma: PrismaService) {}

    create(coordinator: CreateCoordinator): Promise<Coordinator> {
        return this.prisma.coordinator.create({
            data: coordinator,
        });
    }

    delete(coordinatorId: number): Promise<Coordinator> {
        return this.prisma.coordinator.delete({
            where: { id: coordinatorId },
        });
    }

    findMany(offset?: number, limit?: number): Promise<Coordinator[]> {
        return this.prisma.coordinator.findMany({
            skip: offset,
            take: limit,
        });
    }

    findOneById(coordinatorId: number): Promise<Coordinator | null> {
        return this.prisma.coordinator.findUnique({
            where: { id: coordinatorId },
        });
    }

    update(coordinator: UpdateCoordinator): Promise<Coordinator> {
        const { id, ...coordinatorData } = coordinator;
        return this.prisma.coordinator.update({
            where: { id },
            data: coordinatorData,
        });
    }
}
