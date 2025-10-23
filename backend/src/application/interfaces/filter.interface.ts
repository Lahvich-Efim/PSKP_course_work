export type BaseFilter<T extends object> = Partial<T> & {
    AND?: BaseFilter<T>[];
    OR?: BaseFilter<T>[];
    NOT?: BaseFilter<T>;
};

export interface RelationFilter<T extends object> {
    some?: T;
    every?: T;
    none?: T;
}

export interface SingleRelationFilter<T extends object> {
    is?: T;
    isNot?: T;
}

export type EntityFilter<
    T extends object,
    Relations extends Record<string, any> = {},
> = Omit<BaseFilter<T>, keyof Relations> & {
    [K in keyof Relations]?: Relations[K] extends any[]
        ? RelationFilter<EntityFilter<Relations[K][0]>>
        : SingleRelationFilter<EntityFilter<Relations[K]>>;
} & {
    AND?: EntityFilter<T, Relations>[];
    OR?: EntityFilter<T, Relations>[];
    NOT?: EntityFilter<T, Relations>;
};
