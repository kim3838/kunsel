//@ts-nocheck
import type {UseFetchOptions} from "nuxt/app";
import type {CallbackResponseT} from "@/public/js/types/request";

export async function laraFetch<DataT, ErrorT>(
    path: string,
    options: UseFetchOptions<DataT> = {},
    callbacks: CallbackResponseT,
    promptErrorResponse = true
){
    if(import.meta.server)return;

    const debug = useNuxtApp().$debug as (key: string, payload: any) => void;
    const logEnabled = false;

    const {
        onRequest: laraInterceptorOnRequest,
        onRequestError: laraInterceptorOnRequestError,
        onResponse: laraInterceptorOnResponse
    } = laraInterceptor();
    const {baseURL} = useRuntimeConfig().public;

    //Re-fetch csrf token when performing modifying action
    const method = options?.method ? String(options.method).toLowerCase() : "";

    if (import.meta.client && ["post", "delete", "put", "patch"].includes(method)) {
        await $fetch("/sanctum/csrf-cookie", {
            baseURL: baseURL,
            credentials: "include",
        });
    }

    await $fetch(baseURL + path, {
        credentials: 'include',
        async onRequest({request, options}){

            if(logEnabled){
                debug('LARA 0FETCH START', baseURL + path);
            }

            await laraInterceptorOnRequest(
                callbacks,
                promptErrorResponse,
                {request: request, options: options}
            );
        },
        async onRequestError({ request, options, error }) {

            if(logEnabled){
                debug('LARA 0FETCH ERROR', error.message);
            }

            await laraInterceptorOnRequestError(
                callbacks,
                promptErrorResponse,
                {request: request, options: options, error: error}
            );
        },
        async onResponse({request, options, response}) {

            if(logEnabled){
                debug('LARA 0FETCH RESPONSE CODE', response?._data?.code);
            }

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
        },
    }).catch((error) => {

        if(logEnabled){
            debug('LARA 0FETCH ERROR', error);
        }
    });
}