export type Role = 'COORDINATOR' | 'PARTICIPANT';

export type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    role: Role;
};

export type UserData = Omit<User, 'password'>;
