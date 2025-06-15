
import type {
    FetchContext,
    FetchRequest,
    FetchResponse,
    ResolvedFetchOptions,
} from "ofetch";

export interface InterceptorParametersT<T = any>{
    request: FetchRequest,
    options: ResolvedFetchOptions,
    response?: FetchResponse<T>,
    error?: Error
}

export type CallbackResponseT = {
    onRequest?: (
        request: FetchRequest,
        options: ResolvedFetchOptions,
        error?: Error
    ) => void;
    onRequestError?: (
        request: FetchRequest,
        options: ResolvedFetchOptions,
        error?: Error
    ) => void;
    onResponse?: <T = any>(
        request: FetchRequest,
        options: ResolvedFetchOptions,
        response?: FetchResponse<T>,
    ) => void;
    onSuccessResponse?: <T = any>(
        request: FetchRequest,
        options: ResolvedFetchOptions ,
        response?: FetchResponse<T>,
    ) => void;
    onUnAuthorizedResponse?: <T = any>(
        request: FetchRequest,
        options: ResolvedFetchOptions,
        response?: FetchResponse<T>,
    ) => void;
    onNotAcceptableResponse?: <T = any>(
        request: FetchRequest,
        options: ResolvedFetchOptions,
        response?: FetchResponse<T>,
    ) => void;
}
