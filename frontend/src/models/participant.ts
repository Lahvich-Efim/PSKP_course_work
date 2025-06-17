export interface Participant {
    id: number;
    name: string;
    description?: string;
    user: {
        email: string;
        username: string;
    };
}

export interface createParticipant {
    id: number;
    name: string;
    description?: string;
}

export interface updateParticipant {
    name?: string;
    description?: string;
}
