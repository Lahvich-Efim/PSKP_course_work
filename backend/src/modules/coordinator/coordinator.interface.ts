import { Coordinator } from './coordinator.entity';

export type CreateCoordinator = Coordinator;
export type UpdateCoordinator = Partial<Coordinator> & { id: number };

export const COORDINATOR_REPOSITORY = 'ICoordinatorRepository';

export interface ICoordinatorRepository {
    findOneById(coordinatorId: number): Promise<Coordinator | null>;

    findMany(offset?: number, limit?: number): Promise<Coordinator[]>;

    create(coordinator: CreateCoordinator): Promise<Coordinator>;

    update(coordinator: UpdateCoordinator): Promise<Coordinator>;

    delete(coordinatorId: number): Promise<Coordinator>;
}
