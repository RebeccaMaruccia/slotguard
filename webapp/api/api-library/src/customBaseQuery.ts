import {BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError} from '@reduxjs/toolkit/query/react'

export const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, WebApi, extraOptions) => {
    const params = WebApi.extra as ExtraArgument;
    const baseUrl = params.baseUrl;
    const rawBaseQuery = fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers, { endpoint, extra }) => {
            const params = extra as ExtraArgument;
            if (params.headersEnricher && (params.privateEndpoints === undefined || params.privateEndpoints.includes(endpoint))) {
                params.headersEnricher(headers, endpoint);
            }
            return headers;
        }
    });
    return rawBaseQuery(args, WebApi, extraOptions);
};

export interface ExtraArgument {
    baseUrl: string;
    privateEndpoints?: string[];
    headersEnricher: (headers: Headers, endpoint: string) => void;
}