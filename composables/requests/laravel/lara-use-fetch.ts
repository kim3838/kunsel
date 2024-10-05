
import type {UseFetchOptions} from "nuxt/app";

export function laraUseFetch<T>(
    path: string,
    options: UseFetchOptions<T> = {},
    callbacks: Object = {},
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
        async onRequest(){
            console.log({'LARA USEFETCH' : 'START: ' + baseURL + path})

            await laraInterceptorOnRequest(callbacks, promptErrorResponse);
        },
        async onRequestError({ request, options, error }) {
            console.log({'LARA USEFETCH ERROR' : error.message});

            await laraInterceptorOnRequestError(
                callbacks,
                promptErrorResponse,
                {request: request, options: options, error: error}
            );
        },
        async onResponse({request, response, options}) {
            console.log({'LARA USEFETCH ON-RESPONSE CODE' : response?._data?.code});

            await laraInterceptorOnResponse(
                callbacks,
                promptErrorResponse,
                {request: request, response: response, options: options}
            );
        },
        ...options,
        headers: {
            ...laraHeaders(),
            ...options?.headers
        }
    });
}