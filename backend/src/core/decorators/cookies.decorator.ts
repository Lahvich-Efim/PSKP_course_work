import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Cookie = createParamDecorator(
    (key: string, ctx: ExecutionContext): any => {
        const request = ctx.switchToHttp().getRequest<Request>();
        return key ? (request.cookies?.[key] ?? null) : request.cookies;
    },
);
