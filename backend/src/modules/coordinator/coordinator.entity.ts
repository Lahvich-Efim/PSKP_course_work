export type Coordinator = {
    id: number;
    name: string;
};

export type CoordinatorData = Omit<Coordinator, 'id'>;
