
import type {UseFetchOptions} from "nuxt/app";

export function ssrFetch<T>(path: string, options: UseFetchOptions<T> = {}){
    const runtimeConfig = useRuntimeConfig();

    let headers: any = {
        referer: runtimeConfig.public.frontendURL,
        accept: 'application/json, text/plain, */*'
    };

    const XSRF_TOKEN = useCookie('XSRF-TOKEN');

    if(XSRF_TOKEN.value){
        headers['X-XSRF-TOKEN'] = XSRF_TOKEN as String;
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
        ...options,
        headers: {
            ...headers,
            ...options?.headers
        }
    });
}