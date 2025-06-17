import { ApiClient } from '@/api/ApiClient.ts';
import type { User } from '@/models/user.ts';

type Token = {
    access_token: string;
};

export class AuthService extends ApiClient {
    async login(data: { username: string; password: string }): Promise<Token> {
        return await this.post<Token>('/auth/login', data);
    }
    async refreshToken(): Promise<Token> {
        return await this.post<Token>(
            '/auth/refresh',
            {},
            {
                'x-manual-refresh': 'true',
            },
        );
    }

    async register(data: {
        username: string;
        password: string;
        email: string;
        role: string;
    }): Promise<User> {
        return await this.post<User>('/auth/register', data);
    }

    async logout(): Promise<void> {
        await this.get<Token>('/auth/logout');
    }
}
