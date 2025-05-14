
import type {UseFetchOptions} from "nuxt/app";
import type {CallbackResponseT} from "@/public/js/types/request";

export function laraUseFetch<T>(
    path: string,
    options: UseFetchOptions<T> = {},
    callbacks: CallbackResponseT = {},
    promptErrorResponse = true
){
    const {
        onRequest: laraInterceptorOnRequest,
        onRequestError: laraInterceptorOnRequestError,
        onResponse: laraInterceptorOnResponse
    } = laraInterceptor();
    const {baseURL} = useRuntimeConfig().public;

    return useFetch(baseURL + path, {
        credentials: 'include',
        watch: false,
        server: false,
        async onRequest({ request, options }){
            console.log({'LARA USEFETCH' : 'START: ' + baseURL + path})

            await laraInterceptorOnRequest(
                callbacks,
                promptErrorResponse,
                {request: request, options: options}
            );
        },
        async onRequestError({ request, options, error }) {
            console.log({'LARA USEFETCH ERROR' : error.message});

            await laraInterceptorOnRequestError(
                callbacks,
                promptErrorResponse,
                {request: request, options: options, error: error}
            );
        },
        async onResponse({request, options, response}) {
            console.log({'LARA USEFETCH ON-RESPONSE CODE' : response?._data?.code});

            await laraInterceptorOnResponse(
                callbacks,
                promptErrorResponse,
                {request: request, options: options, response: response}
            );
        },
        ...options,
        headers: {
            ...laraHeaders(),
            ...options?.headers
        }
    });
}