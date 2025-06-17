export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export interface JwtPayload {
    id: number;
    username: string;
    email: string;
    role: string;
} 