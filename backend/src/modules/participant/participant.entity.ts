export type Participant = {
    id: number;
    name: string;
    description?: string | null;
};

export interface ParticipantData {
    id: number;
    name: string;
    description?: string | null;
    user: {
        email: string;
        username: string;
    };
}
