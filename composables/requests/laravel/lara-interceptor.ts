
export const laraInterceptor = async (interceptor, callbacks, promptErrorResponse = false, interceptorParameters = {}) => {
    const {$coreStore, $promptStore} = useNuxtApp();
    const user = userState();

    switch (interceptor) {
        case "onRequest":

            //Perform on request callback
            if(callbacks.onRequest && typeof callbacks.onRequest == 'function'){
                await callbacks.onRequest();
            }

            $coreStore.resetServiceError();

            break;
        case "onRequestError":

            //Perform on request error callback
            if(callbacks.onRequestError && typeof callbacks.onRequestError == 'function'){
                await callbacks.onRequestError(
                    interceptorParameters?.request ?? null,
                    interceptorParameters?.options ?? null,
                    interceptorParameters?.error ?? null
                );
            }

            $coreStore.setServiceError({
                prompt: promptErrorResponse,
                icon: 'ic:sharp-error-outline',
                title: 'Request failed',
                payload: {
                    message: interceptorParameters?.error?.message ?? null
                }
            });

            break;
        case "onResponse":

            let request = interceptorParameters?.request ?? null;
            let response = interceptorParameters?.response ?? null;
            let options = interceptorParameters?.options ?? null;
            let responseCode = response._data.code;

            //Perform on response callback
            if(callbacks.onResponse && typeof callbacks.onResponse == 'function'){
                await callbacks.onResponse(request, response, options);
            }

            if(responseCode == 200){
                //Perform success response callback
                if(callbacks.onSuccessResponse && typeof callbacks.onSuccessResponse == 'function'){
                    await callbacks.onSuccessResponse(request, response, options);
                }
            }

            if(responseCode >= 400 && responseCode < 499){

                switch(responseCode.toString()) {
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
                            $coreStore.setServiceError({
                                prompt: promptErrorResponse,
                                icon: 'ic:sharp-error-outline',
                                title: 'Request failed',
                                payload: response?._data
                            });
                        }
                        break;
                    case '406':

                        $coreStore.setServiceError({
                            prompt: promptErrorResponse,
                            icon: 'ic:sharp-error-outline',
                            title: 'Request failed',
                            payload: response?._data
                        });

                        //Perform not acceptable response callback
                        if(callbacks.onNotAcceptableResponse && typeof callbacks.onNotAcceptableResponse == 'function'){
                            await callbacks.onNotAcceptableResponse(request, response, options);
                        }

                        break;
                    default:
                        $coreStore.setServiceError({
                            prompt: promptErrorResponse,
                            icon: 'ic:sharp-error-outline',
                            title: 'Request failed',
                            payload: response?._data
                        });
                }
            }

            if(responseCode >= 500 && responseCode < 600){
                $coreStore.setServiceError({
                    prompt: promptErrorResponse,
                    icon: 'ic:sharp-error-outline',
                    title: 'Something Went Wrong',
                    payload: response?._data
                });
            }

            break;
    }
}