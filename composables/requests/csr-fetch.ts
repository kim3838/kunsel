
import type {UseFetchOptions} from "nuxt/app";

export async function csrFetch<T>(
    path: string,
    options: UseFetchOptions<T> = {},
    callbacks: Object = {},
    promptResponse = true
){
    const {baseURL,frontendURL} = useRuntimeConfig().public;
    const {$coreStore, $promptStore} = useNuxtApp();
    const user = userState();
    const CSRF_COOKIE = "XSRF-TOKEN";
    const CSRF_HEADER = "X-XSRF-TOKEN";

    let headers: any = {
        referer: frontendURL,
        accept: 'application/json, text/plain, */*'
    };

    let token = useCookie(CSRF_COOKIE, {
        secure: true,
        sameSite: 'lax'
    });

    if (process.client && ["post", "delete", "put", "patch"].includes(
        options?.method?.toLowerCase() ?? ""
    )) {
        await $fetch("/sanctum/csrf-cookie", {
            baseURL: baseURL,
            credentials: "include",
        });

        token = useCookie(CSRF_COOKIE, {
            secure: true,
            sameSite: 'lax'
        });
    }

    if(token){
        headers[CSRF_HEADER] = token.value;
    }

    function setResponse(icon: String, title: String, payload: Object){
        $coreStore.setServiceError({
            prompt: promptResponse,
            icon: icon,
            title: title,
            payload: payload
        });
    }

    await $fetch(baseURL + path, {
        credentials: 'include',
        async onRequest(){
            console.log({'CSR FETCH' : 'START: ' + baseURL + path})

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
    }).catch((error) => console.log({'ofetch error': error}));
}