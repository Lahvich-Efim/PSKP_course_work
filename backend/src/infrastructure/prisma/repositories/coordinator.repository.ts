import { Injectable } from '@nestjs/common';
import { Coordinator } from '../../../domain/entities/coordinator.entity';
import {
    CreateCoordinator,
    ICoordinatorRepository,
    UpdateCoordinator,
} from '../../../domain/repositories/coordinator.interface';
import { BaseRepository } from './base.repository';

@Injectable()
export class CoordinatorRepository
    extends BaseRepository
    implements ICoordinatorRepository
{
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
