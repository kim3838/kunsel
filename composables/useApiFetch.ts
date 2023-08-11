
import type {UseFetchOptions} from "nuxt/app";

export function useApiFetch<T>(path: string, options: UseFetchOptions<T> = {}){
    const runtimeConfig = useRuntimeConfig();

    let headers: any = {};
    const XSRF_TOKEN = useCookie('XSRF-TOKEN');

    if(XSRF_TOKEN.value){
        headers['X-XSRF-TOKEN'] = XSRF_TOKEN as String;
    }

    return useFetch(runtimeConfig.public.baseURL + path, {
        credentials: 'include',
        watch: false,
        ...options,
        headers: {
            ...headers,
            ...options.headers
        }
    });
}