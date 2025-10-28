export interface ScalarFilter<T> {
    equals?: T;
    not?: T | ScalarFilter<T>;
    in?: T[];
    notIn?: T[];
    lt?: T;
    lte?: T;
    gt?: T;
    gte?: T;
    contains?: T extends string ? T : never;
    startsWith?: T extends string ? T : never;
    endsWith?: T extends string ? T : never;
}

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
> = {
    [K in keyof T]?: K extends keyof Relations
        ? never
        : T[K] extends string | number | boolean | Date | null
          ? T[K] | ScalarFilter<NonNullable<T[K]>>
          : never;
} & {
    [K in keyof Relations]?: Relations[K] extends any[]
        ? RelationFilter<EntityFilter<Relations[K][0]>>
        : SingleRelationFilter<EntityFilter<Relations[K]>>;
} & {
    AND?: EntityFilter<T, Relations>[];
    OR?: EntityFilter<T, Relations>[];
    NOT?: EntityFilter<T, Relations>;
};
