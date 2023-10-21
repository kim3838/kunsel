
import type {UseFetchOptions} from "nuxt/app";

export function csrFetch<T>(path: string, options: UseFetchOptions<T> = {}){
    const runtimeConfig = useRuntimeConfig();

    let headers: any = {
        referer: runtimeConfig.public.frontendURL,
        accept: 'application/json, text/plain, */*'
    };

    const XSRF_TOKEN = useCookie('XSRF-TOKEN');

    if(XSRF_TOKEN.value){
        headers['X-XSRF-TOKEN'] = XSRF_TOKEN as String;
    }

    /*
    * When using immediate: false
    *
    * Dont use its pending,
    * as it will start as true: meaning the data isn't received yet,
    * use custom pending instead
    **/
    return useFetch(runtimeConfig.public.baseURL + path, {
        credentials: 'include',
        watch: false,
        immediate: true,
        server: false,
        ...options,
        headers: {
            ...headers,
            ...options?.headers
        },
    });
}