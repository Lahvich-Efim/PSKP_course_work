export type Role = 'coordinator' | 'participant';

export interface User {
    id: number;
    email: string;
    username: string;
    role: Role;
}
