export interface Product {
    id: number;
    unit: string;
    name: string;
    participant_name: string;
}

export interface createProduct {
    unit: string;
    name: string;
}

export interface updateProduct {
    unit?: string;
    name?: string;
}
