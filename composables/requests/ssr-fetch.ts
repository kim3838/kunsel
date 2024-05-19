
import type {UseFetchOptions} from "nuxt/app";

export function ssrFetch<T>(
    path: string,
    options: UseFetchOptions<T> = {},
    callbacks: Object = {},
){
    const runtimeConfig = useRuntimeConfig();

    let headers: any = {
        referer: runtimeConfig.public.frontendURL,
        accept: 'application/json, text/plain, */*'
    };

    const XSRF_TOKEN = useCookie('XSRF-TOKEN', {
        secure: true,
        sameSite: 'lax'
    });

    if(XSRF_TOKEN.value){
        headers['X-XSRF-TOKEN'] = XSRF_TOKEN.value;
    }

    if(process.server){
        headers = {
            ...headers,
            ...useRequestHeaders(['cookie'])
        }
    }

    return useFetch(runtimeConfig.public.baseURL + path, {
        credentials: 'include',
        watch: false,
        async onRequest(){
            console.log({'SSR FETCH' : 'START: ' + runtimeConfig.public.baseURL + path})

            if(callbacks.onRequest && typeof callbacks.onRequest == 'function'){
                await callbacks.onRequest();
            }
        },
        async onRequestError({ request, options, error }) {
            console.log({'SSR FETCH ERROR' : error.message})

            if(callbacks.onRequestError && typeof callbacks.onRequestError == 'function'){
                await callbacks.onRequestError(request, options, error);
            }
        },
        async onResponse({request, response, options}) {
            console.log({'SSR FETCH RESPONSE' : response?._data?.code})

            if(callbacks.onResponse && typeof callbacks.onResponse == 'function'){
                await callbacks.onResponse(request, response, options);
            }

            if (response._data.code >= 500 && response._data.code < 600) {

            } else if(response?._data?.code >= 400 && response?._data?.code < 499){

            } else {
                console.log({'SSR FETCH': 'SUCCESS' });

                if(callbacks.onSuccessResponse && typeof callbacks.onSuccessResponse == 'function'){
                    await callbacks.onSuccessResponse(request, response, options);
                }
            }
        },
        ...options,
        headers: {
            ...headers,
            ...options?.headers
        }
    });
}