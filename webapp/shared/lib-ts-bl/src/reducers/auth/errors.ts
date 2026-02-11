import {isRejected, isRejectedWithValue, Middleware, MiddlewareAPI} from "@reduxjs/toolkit";
import {ErrorDetailDto, ResponseDto} from "./models";
import {errorSet} from "./store";

const isResponseDto = (object: unknown): object is ResponseDto => {
    const response = (object as ResponseDto);
    return response && response.code !== undefined;
};

const isHttpStatusCode = (status: unknown): status is number => {
    return typeof status === "number" && isNaN(status) === false;
};

const getErrorFromResponse = (response: unknown, httpStatus: unknown): ErrorDetailDto => {
    let error: ErrorDetailDto = {
        code: "GENERIC",
        detail: "",
        title: "Generic Server Error",
        type: "GENERIC",
        status: 500,
        links: undefined,
        nested: [],
    };

    if (isResponseDto(response)) {
        const status = isHttpStatusCode(httpStatus) ? httpStatus : 500;
        error = {
            code: response.code ?? "",
            detail: response.detail ?? "",
            title: response.title ?? "",
            type: response.type ?? "",
            status,
            links: response._links ?? undefined,
            nested: [],
        };
        if (status === 401) {
            error.shouldLogout = true;
        }
        if (response.additionalErrors) {
            response.additionalErrors.forEach((additionalError) => {
                error.nested.push({
                    code: additionalError.code ?? "",
                    detail: additionalError.detail ?? "",
                    title: additionalError.title ?? "",
                });
            });
        }
    }

    return error;
};

export const errorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action:any) => {

    if (isRejectedWithValue(action) || isRejected(action)) {
        console.warn("Rejected", action);
        const error = getErrorFromResponse(action.payload.data, action.payload.status);
        api.dispatch(errorSet(error));
    }

    return next(action);
};
