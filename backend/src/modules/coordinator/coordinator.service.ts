import { Inject, Injectable } from '@nestjs/common';
import {
    COORDINATOR_REPOSITORY,
    ICoordinatorRepository,
} from './coordinator.interface';
import { Coordinator, CoordinatorData } from './coordinator.entity';
import { NotFoundError } from '../../shared/exceptions/exceptions';
import { CreateCoordinatorDto } from './dto/coordinator.dto';

@Injectable()
export class CoordinatorService {
    constructor(
        @Inject(COORDINATOR_REPOSITORY)
        private readonly repository: ICoordinatorRepository,
    ) {}

    private sanitize(coordinator: Coordinator): CoordinatorData {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...coordinatorData } = coordinator;
        return coordinatorData;
    }

    async getCoordinator(coordinatorId: number): Promise<CoordinatorData> {
        const coordinator = await this.repository.findOneById(coordinatorId);
        if (!coordinator) {
            throw new NotFoundError(
                'Координатор с id ' + coordinatorId + ' не найден!',
            );
        }
        return this.sanitize(coordinator);
    }

    async getCoordinators(
        limit?: number,
        offset?: number,
    ): Promise<CoordinatorData[]> {
        const coordinators = await this.repository.findMany(offset, limit);
        return coordinators.map((coordinator) => this.sanitize(coordinator));
    }

    async createCoordinator(
        createCoordinatorDto: CreateCoordinatorDto & { id: number },
    ): Promise<CoordinatorData> {
        const coordinator = await this.repository.create(createCoordinatorDto);
        return this.sanitize(coordinator);
    }

    async updateCoordinator(
        id: number,
        name: string,
    ): Promise<CoordinatorData> {
        const coordinator = await this.repository.update({
            id,
            name,
        });
        return this.sanitize(coordinator);
    }

    async deleteCoordinator(coordinatorId: number): Promise<Coordinator> {
        return this.repository.delete(coordinatorId);
    }
}
