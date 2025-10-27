export type Tokens = {
    accessToken: string;
    refreshToken: string;
};

export type JwtPayload = {
    id: number;
    username: string;
    email: string;
    role: string;
};
