import { Inject, Injectable } from '@nestjs/common';
import {
    IParticipantRepository,
    PARTICIPANT_REPOSITORY,
    CreateParticipant,
    UpdateParticipant,
    ParticipantFilter,
} from './participant.interface';
import { Participant, ParticipantData } from './participant.entity';
import {
    AccessDeniedError,
    NotFoundError,
} from '../../shared/exceptions/exceptions';
import { PaginatedResult } from '../../shared/pagination.interface';
import { IUserRepository, USER_REPOSITORY } from '../users/user.interface';
import { UserData } from 'src/modules/users/user.entity';

@Injectable()
export class ParticipantService {
    constructor(
        @Inject(PARTICIPANT_REPOSITORY)
        private readonly participantRepo: IParticipantRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepo: IUserRepository,
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
        if (!user)
            throw new NotFoundError(
                `Пользователь для участника ${p.id} не найден`,
            );
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
        if (!p)
            throw new NotFoundError(`Участник с id ${participantId} не найден`);
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
            throw new AccessDeniedError('Нет прав для создания участника');
        }
        return this.participantRepo.create(dto);
    }

    async updateParticipant(
        dto: UpdateParticipant,
        user: UserData,
    ): Promise<Participant> {
        this.authorizeAccess(user, dto.id);
        const existing = await this.participantRepo.findOneById(dto.id);
        if (!existing)
            throw new NotFoundError(`Участник с id ${dto.id} не найден`);
        return this.participantRepo.update(dto);
    }

    async deleteParticipant(
        participantId: number,
        user: UserData,
    ): Promise<Participant> {
        this.authorizeAccess(user, participantId);
        const existing = await this.participantRepo.findOneById(participantId);
        if (!existing)
            throw new NotFoundError(`Участник с id ${participantId} не найден`);
        const participant = this.participantRepo.delete(participantId);
        await this.userRepo.delete(user.id);
        return participant;
    }
}
