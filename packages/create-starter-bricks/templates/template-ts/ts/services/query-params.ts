export type QueryParamsValue = string | number | boolean | null | undefined;

export type QueryParams = Record<string, QueryParamsValue | QueryParamsValue[]>;

export const createQueryString = (params: QueryParams): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        const values = Array.isArray(value) ? value : [value];

        values.forEach((item) => {
            if (item === null || item === undefined || item === '') {
                return;
            }

            searchParams.append(key, String(item));
        });
    });

    const queryString = searchParams.toString();

    return queryString ? `?${queryString}` : '';
};
