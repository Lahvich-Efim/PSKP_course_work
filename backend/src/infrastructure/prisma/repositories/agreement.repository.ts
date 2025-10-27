import {
    AgreementFilter,
    CreateAgreement,
    IAgreementRepository,
    UpdateAgreement,
} from '../../../domain/repositories/agreement.interface';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { Agreement } from '../../../domain/entities/agreement.entity';

export class AgreementRepository
    extends BaseRepository
    implements IAgreementRepository
{
    constructor(protected readonly prismaService: PrismaService) {
        super(prismaService);
    }

    static withTransaction(tx: PrismaClient | Prisma.TransactionClient) {
        return new AgreementRepository(tx as unknown as PrismaService);
    }

    async count(where?: AgreementFilter): Promise<number> {
        return this.prisma.agreement.count({ where });
    }

    async create(agreement: CreateAgreement): Promise<Agreement> {
        return this.prisma.agreement.create({
            data: agreement,
        });
    }

    async delete(agreementId: number): Promise<Agreement> {
        return this.prisma.agreement.delete({
            where: {
                id: agreementId,
            },
        });
    }

    async findMany(
        where?: AgreementFilter,
        offset?: number,
        limit?: number,
    ): Promise<Agreement[]> {
        return this.prisma.agreement.findMany({
            where,
            skip: offset,
            take: limit,
        });
    }

    async findOne(where: AgreementFilter): Promise<Agreement | null> {
        return this.prisma.agreement.findFirst({
            where,
        });
    }

    async findOneById(agreementId: number): Promise<Agreement | null> {
        return this.prisma.agreement.findUnique({
            where: {
                id: agreementId,
            },
        });
    }

    async update(agreement: UpdateAgreement): Promise<Agreement> {
        const { id, ...agreementData } = agreement;
        return this.prisma.agreement.update({
            where: {
                id,
            },
            data: agreementData,
        });
    }
}
