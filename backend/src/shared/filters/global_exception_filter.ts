import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
} from '@nestjs/common';
import { BaseAPIError } from '../exceptions/exceptions';
import { HTTP_ERROR_TYPE } from '../decorators/http_error';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';

type HttpExceptionConstructor = new (message?: string) => HttpException;

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(private readonly reflector: Reflector) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof BaseAPIError) {
            const ExceptionClass = this.reflector.get<HttpExceptionConstructor>(
                HTTP_ERROR_TYPE,
                exception.constructor,
            );

            const exceptionClass = ExceptionClass
                ? new ExceptionClass()
                : new InternalServerErrorException();

            const status = exceptionClass.getStatus();

            if (!response.headersSent) {
                response.status(status).json({
                    statusCode: status,
                    message: exception.message,
                    error: exception.name,
                });
            }
            return;
        }

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const responseBody = exception.getResponse();

            if (!response.headersSent) {
                response
                    .status(status)
                    .json(
                        typeof responseBody === 'string'
                            ? { statusCode: status, message: responseBody }
                            : responseBody,
                    );
            }
            return;
        }

        const status = HttpStatus.INTERNAL_SERVER_ERROR;

        if (!response.headersSent) {
            response.status(status).json({
                statusCode: status,
                message: 'Internal server error',
                error:
                    exception instanceof Error
                        ? exception.message
                        : 'Unknown error',
            });
        }
    }
}
