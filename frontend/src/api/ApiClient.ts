import api from '@/api/axios.ts';
import type { RawAxiosRequestHeaders } from 'axios';

export class ApiClient {
    protected get<TResponse>(
        url: string,
        params?: object,
        headers?: RawAxiosRequestHeaders,
    ) {
        return api
            .get<TResponse>(url, { params: { ...params }, headers: headers })
            .then((res) => res.data);
    }

    protected post<TResponse, TData = unknown>(
        url: string,
        data?: TData,
        headers?: RawAxiosRequestHeaders,
    ) {
        return api
            .post<TResponse>(url, data, {
                headers,
            })
            .then((res) => res.data);
    }

    protected patch<TResponse, TData = unknown>(
        url: string,
        data?: TData,
        headers?: RawAxiosRequestHeaders,
    ) {
        return api
            .patch<TResponse>(url, data, { headers })
            .then((res) => res.data);
    }

    protected delete<TResponse>(url: string, headers?: RawAxiosRequestHeaders) {
        return api.delete<TResponse>(url, { headers }).then((res) => res.data);
    }
}
