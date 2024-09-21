
import type {UseFetchOptions} from "nuxt/app";

export async function laraFetch<T>(
    path: string,
    options: UseFetchOptions<T> = {},
    callbacks: Object = {},
    promptErrorResponse = true
){
    const {baseURL} = useRuntimeConfig().public;

    //Re-fetch csrf token when performing modifying action
    if (process.client && ["post", "delete", "put", "patch"].includes(
        options?.method?.toLowerCase() ?? ""
    )) {
        await $fetch("/sanctum/csrf-cookie", {
            baseURL: baseURL,
            credentials: "include",
        });
    }

    await $fetch(baseURL + path, {
        credentials: 'include',
        async onRequest(){
            console.log({'CSR FETCH' : 'START: ' + baseURL + path})
            laraInterceptor("onRequest", callbacks, promptErrorResponse)
        },
        async onRequestError({ request, options, error }) {
            console.log({'CSR FETCH ERROR' : error.message})
            laraInterceptor("onRequestError", callbacks, promptErrorResponse, {request: request, options: options, error: error});
        },
        async onResponse({request, response, options}) {
            console.log({'CSR FETCH RESPONSE' : response?._data?.code})
            laraInterceptor("onResponse", callbacks, promptErrorResponse, {request: request, response: response, options: options});
        },
        ...options,
        headers: {
            ...laraHeaders(),
            ...options?.headers
        },
    }).catch((error) => console.log({'OFETCH ERROR': error}));
}