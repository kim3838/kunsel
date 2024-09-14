
import type {UseFetchOptions} from "nuxt/app";

export function laraSsrFetch<T>(
    path: string,
    options: UseFetchOptions<T> = {},
    callbacks: Object = {},
    promptResponse = true
){
    const runtimeConfig = useRuntimeConfig();
    const {$coreStore, $promptStore} = useNuxtApp();
    const user = userState();

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

    //Todo: Request response handler for laraFetch and laraSsrFetch
    function setResponse(icon: String, title: String, payload: Object){
        $coreStore.setServiceError({
            prompt: promptResponse,
            icon: icon,
            title: title,
            payload: payload
        });
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

                setResponse('ic:sharp-error-outline', 'Something Went Wrong', response._data);
            } else if(response?._data?.code >= 400 && response?._data?.code < 499){

                let responseCode = response?._data?.code;

                switch (responseCode.toString()) {
                    case '401':
                        if(user.value){
                            $promptStore.setPrompt({
                                icon: 'mdi:connection',
                                title: _get(response, '_data.message', ''),
                                message: 'Session have been ended, login again to restore session.',
                                action: {
                                    callback: () => {
                                        user.value = undefined;
                                        navigateTo("/login", {replace: true});
                                    },
                                    label: 'Okay'
                                }
                            });
                        } else {
                            setResponse('ic:sharp-error-outline', 'Request failed', response._data);
                        }
                        break;
                    case '406':

                        if(callbacks.onNotAcceptableResponse && typeof callbacks.onNotAcceptableResponse == 'function'){
                            await callbacks.onNotAcceptableResponse(request, response, options);
                        } else {
                            setResponse('ic:sharp-error-outline', 'Request failed', response._data);
                        }

                        break;
                    default:
                        setResponse('ic:sharp-error-outline', 'Request failed', response._data);
                }

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