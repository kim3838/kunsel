
import type {UseFetchOptions} from "nuxt/app";

export function csrFetch<T>(
    path: string,
    options: UseFetchOptions<T> = {},
    callbacks: Object = {},
    promptResponse = true
){
    const runtimeConfig = useRuntimeConfig();
    const {$coreStore} = useNuxtApp();
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

    function setResponse(icon: String, title: String, payload: Object){
        $coreStore.setServiceError({
            prompt: promptResponse,
            icon: icon,
            title: title,
            payload: payload
        });
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
        lazy: true,
        server: false,
        async onRequest(){
            console.log({'CSR FETCH' : 'START'})

            if(callbacks.onRequest && typeof callbacks.onRequest == 'function'){
                await callbacks.onRequest();
            }

            $coreStore.resetServiceError();
        },
        async onRequestError({ request, options, error }) {
            console.log({'CSR FETCH ERROR' : error.message})

            if(callbacks.onRequestError && typeof callbacks.onRequestError == 'function'){
                await callbacks.onRequestError(request, options, error);
            }

            setResponse('ic:sharp-error-outline', 'Request failed', {message: error.message});
        },
        async onResponse({request, response, options}) {
            console.log({'CSR FETCH RESPONSE' : response?._data?.code})

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
                            $coreStore.setPrompt({
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
                console.log({'CSR FETCH': 'SUCCESS' });

                if(callbacks.onSuccessResponse && typeof callbacks.onSuccessResponse == 'function'){
                    await callbacks.onSuccessResponse(request, response, options);
                }
            }
        },
        ...options,
        headers: {
            ...headers,
            ...options?.headers
        },
    });
}