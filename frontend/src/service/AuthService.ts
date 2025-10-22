import { ApiClient } from '@/api/ApiClient.ts';
import type { User } from '@/models/user.ts';
import type { Participant } from '@/models/participant.ts';
import type { Coordinator } from '@/models/coordinator.ts';

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
        name: string;
        description?: string;
    }): Promise<{ user: User; profile: Participant | Coordinator }> {
        return await this.post<{
            user: User;
            profile: Participant | Coordinator;
        }>('/auth/register', data);
    }

    async logout(): Promise<void> {
        await this.get<Token>('/auth/logout');
    }
}
