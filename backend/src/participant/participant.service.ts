import { Inject, Injectable } from '@nestjs/common';
import {
    Participant,
    ParticipantData,
} from '../core/entities/participant.entity';
import {
    AccessDeniedError,
    EntityAlreadyExistError,
    NotFoundError,
} from '../shared/exceptions/exceptions';
import { UserData } from 'src/core/entities/user.entity';
import {
    CATALOG_REPOSITORY,
    PARTICIPANT_REPOSITORY,
    USER_REPOSITORY,
} from '../core/interfaces/tokens';
import {
    CreateParticipant,
    IParticipantRepository,
    ParticipantFilter,
    UpdateParticipant,
} from '../core/interfaces/participant.interface';
import { IUserRepository } from '../core/interfaces/user.interface';
import { ICatalogRepository } from '../core/interfaces/catalog.interface';
import { PaginatedResult } from '../core/interfaces/pagination.interface';

@Injectable()
export class ParticipantService {
    constructor(
        @Inject(PARTICIPANT_REPOSITORY)
        private readonly participantRepo: IParticipantRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepo: IUserRepository,
        @Inject(CATALOG_REPOSITORY)
        private readonly catalogRepo: ICatalogRepository,
    ) {}

    private authorizeAccess(user: UserData, targetId: number) {
        if (user.role === 'PARTICIPANT' && user.id !== targetId) {
            throw new AccessDeniedError(
                'Нет доступа к данным другого участника',
            );
        }
    }

    private async toParticipantData(p: Participant): Promise<ParticipantData> {
        const user = await this.userRepo.findOneById(p.id);
        if (!user) throw new NotFoundError(`Данный пользователь не существует`);
        return {
            id: p.id,
            name: p.name,
            description: p.description,
            user: {
                username: user.username,
                email: user.email,
            },
        };
    }

    async getParticipant(
        participantId: number,
        user: UserData,
    ): Promise<ParticipantData> {
        this.authorizeAccess(user, participantId);
        const p = await this.participantRepo.findOneById(participantId);
        if (!p) throw new NotFoundError(`Данный участник не существует`);
        return this.toParticipantData(p);
    }

    async getParticipants(
        where?: ParticipantFilter,
        offset?: number,
        limit?: number,
    ): Promise<PaginatedResult<ParticipantData>> {
        const [items, count] = await Promise.all([
            this.participantRepo.findMany(where, offset, limit),
            this.participantRepo.count(where),
        ]);
        const data = await Promise.all(
            items.map((p) => this.toParticipantData(p)),
        );
        return { count, items: data };
    }

    async createParticipant(
        dto: CreateParticipant,
        user: UserData,
    ): Promise<Participant> {
        if (user.role !== 'COORDINATOR') {
            throw new AccessDeniedError('Нет прав для регистрации участников');
        }
        return this.participantRepo.create(dto);
    }

    async updateParticipant(
        dto: UpdateParticipant,
        user: UserData,
    ): Promise<Participant> {
        this.authorizeAccess(user, dto.id);
        const existing = await this.participantRepo.findOneById(dto.id);
        if (!existing) throw new NotFoundError(`Данный участник не существует`);
        return this.participantRepo.update(dto);
    }

    async deleteParticipant(
        participantId: number,
        user: UserData,
    ): Promise<Participant> {
        this.authorizeAccess(user, participantId);
        const existing = await this.participantRepo.findOneById(participantId);
        if (!existing) throw new NotFoundError(`Данный участник не существует`);
        const existing_catalog = await this.catalogRepo.count({
            product: { is: { participant_id: participantId } },
        });
        if (existing_catalog > 0)
            throw new EntityAlreadyExistError(
                'Удаление участника с выставленным каталогов невозможна!',
            );

        const participant = await this.participantRepo.delete(participantId);
        await this.userRepo.delete(participantId);
        return participant;
    }
}
