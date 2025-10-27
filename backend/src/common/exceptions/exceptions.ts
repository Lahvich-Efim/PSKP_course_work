import { HttpError } from '../decorators/http_error';
import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

export abstract class BaseAPIError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = this.constructor.name;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

@HttpError(NotFoundException)
export class NotFoundError extends BaseAPIError {}

@HttpError(UnauthorizedException)
export class UnauthorizedError extends BaseAPIError {}

@HttpError(ConflictException)
export class ConflictError extends BaseAPIError {}

@HttpError(BadRequestException)
export class AuthException extends BaseAPIError {}

@HttpError(BadRequestException)
export class SupplyException extends BaseAPIError {}

@HttpError(ForbiddenException)
export class AccessDeniedError extends BaseAPIError {}

@HttpError(ForbiddenException)
export class EntityAlreadyExistError extends ConflictError {}

@HttpError(ConflictException)
export class ProductionPlanException extends ConflictError {}

@HttpError(InternalServerErrorException)
export class UnknownError extends BaseAPIError {}
