import { Agreement } from '../entities/agreement.entity';
import { EntityFilter } from '../../application/interfaces/filter.interface';

export type CreateAgreement = Omit<Agreement, 'id'>;
export type UpdateAgreement = Partial<CreateAgreement> & {
    id: number;
};

export interface AgreementRelations {
    supplier: Agreement;
    consumer: Agreement;
}

export type AgreementFilter = EntityFilter<Agreement, AgreementRelations>;

export interface IAgreementRepository {
    findOneById(agreementId: number): Promise<Agreement | null>;

    findOne(where: AgreementFilter): Promise<Agreement | null>;

    findMany(
        where?: AgreementFilter,
        offset?: number,
        limit?: number,
    ): Promise<Agreement[]>;

    create(agreement: CreateAgreement): Promise<Agreement>;

    update(agreement: UpdateAgreement): Promise<Agreement>;

    delete(agreementId: number): Promise<Agreement>;

    count(where?: AgreementFilter): Promise<number>;
}
