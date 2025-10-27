import { PipeTransform, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export class ParseJsonDtoPipe<T extends object> implements PipeTransform {
    constructor(private readonly dtoClass: new (...args: any[]) => T) {}

    transform(value: unknown): T | undefined {
        if (value === undefined || value === null || value === '')
            return undefined;

        if (typeof value === 'object') {
            return this.validateAndTransform(value);
        }

        if (typeof value === 'string') {
            const raw = value.trim();

            if (raw === '[object Object]') return undefined;

            if (
                (raw.startsWith('{') && raw.endsWith('}')) ||
                (raw.startsWith('[') && raw.endsWith(']'))
            ) {
                const parsed = this.safeJsonParse(raw);
                return this.validateAndTransform(parsed);
            }

            try {
                const decoded = decodeURIComponent(raw);
                if (
                    decoded !== raw &&
                    ((decoded.startsWith('{') && decoded.endsWith('}')) ||
                        (decoded.startsWith('[') && decoded.endsWith(']')))
                ) {
                    const parsed2 = this.safeJsonParse(decoded);
                    return this.validateAndTransform(parsed2);
                }
            } catch {
                // ignore decode errors
            }

            throw new BadRequestException(
                'Query parameter "filter" is not valid JSON',
            );
        }
        return undefined;
    }

    private safeJsonParse(raw: string): unknown {
        try {
            return JSON.parse(raw) as unknown;
        } catch {
            throw new BadRequestException(
                'Invalid JSON in query parameter "filter"',
            );
        }
    }

    private validateAndTransform(obj: unknown): T {
        if (typeof obj !== 'object' || obj === null) {
            throw new BadRequestException('Filter must be an object');
        }

        const dto = plainToInstance(
            this.dtoClass,
            obj as Record<string, unknown>,
            {
                enableImplicitConversion: true,
            },
        );
        const errors = validateSync(dto as object, { whitelist: true });
        if (errors.length) throw new BadRequestException(errors);
        return dto;
    }
}
