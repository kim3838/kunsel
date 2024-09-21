
import type {UseFetchOptions} from "nuxt/app";

export function laraSsrFetch<T>(
    path: string,
    options: UseFetchOptions<T> = {},
    callbacks: Object = {},
    promptErrorResponse = true
){
    const {baseURL} = useRuntimeConfig().public;

    return useFetch(baseURL + path, {
        credentials: 'include',
        watch: false,
        async onRequest(){
            console.log({'SSR FETCH' : 'START: ' + baseURL + path})
            laraInterceptor("onRequest", callbacks, promptErrorResponse);
        },
        async onRequestError({ request, options, error }) {
            console.log({'SSR FETCH ERROR' : error.message})
            laraInterceptor("onRequestError", callbacks, promptErrorResponse, {request: request, options: options, error: error});
        },
        async onResponse({request, response, options}) {
            console.log({'SSR FETCH RESPONSE' : response?._data?.code})
            laraInterceptor("onResponse", callbacks, promptErrorResponse, {request: request, response: response, options: options});
        },
        ...options,
        headers: {
            ...laraHeaders(),
            ...options?.headers
        }
    });
}