
import type {UseFetchOptions} from "nuxt/app";
import type {CallbackResponseT} from "@/public/js/types/request";

export function laraSsrUseFetch<T>(
    path: string,
    options: UseFetchOptions<T> = {},
    callbacks: CallbackResponseT = {}
){
    const {baseURL} = useRuntimeConfig().public;

    return useFetch(baseURL + path, {
        credentials: 'include',
        watch: false,
        server: true,
        async onRequest({ request, options }){
            //console.log({'LARA SSR USEFETCH' : 'START: ' + baseURL + path})

            //Perform on request callback
            if(callbacks.onRequest && typeof callbacks.onRequest == 'function'){
                await callbacks.onRequest(request, options);
            }
        },
        async onRequestError({ request, options, error }) {
            //console.log({'LARA SSR USEFETCH ERROR' : error.message});

            //Perform on request error callback
            if(callbacks.onRequestError && typeof callbacks.onRequestError == 'function'){
                await callbacks.onRequestError(request, options, error);
            }
        },
        async onResponse({request, options, response}) {
            //console.log({'LARA SSR USEFETCH ON-RESPONSE CODE' : response?._data?.code});
            let responseCode = response._data.code;

            //Perform on response callback
            if(callbacks.onResponse && typeof callbacks.onResponse == 'function'){
                await callbacks.onResponse(request, options, response);
            }

            if(responseCode == 200){

                //Perform success response callback
                if(callbacks.onSuccessResponse && typeof callbacks.onSuccessResponse == 'function'){
                    await callbacks.onSuccessResponse(request, options, response);
                }
            }
        },
        ...options,
        headers: {
            ...laraHeaders(),
            ...options?.headers
        }
    });
}