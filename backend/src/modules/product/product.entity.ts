export type Product = {
    id: number;
    name: string;
    unit: string;
    participant_id: number;
};

export type ProductData = Omit<Product, 'participant_id'> & {
    participant_name: string;
};
