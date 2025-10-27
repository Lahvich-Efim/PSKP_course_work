import { HttpException, SetMetadata } from '@nestjs/common';

export const HTTP_ERROR_TYPE = 'HTTP_ERROR_TYPE';

export function HttpError(
    httpException: new (message?: string) => HttpException,
) {
    return SetMetadata(HTTP_ERROR_TYPE, httpException);
}
