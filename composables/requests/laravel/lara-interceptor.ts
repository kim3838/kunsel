
import type {CallbackResponseT, InterceptorParametersT} from "@/public/js/types/request";

export const laraInterceptor = () => {
    const coreStore = useCoreStore();
    const promptStore = usePromptStore();
    const user = userState();

    async function onRequest(callbacks: CallbackResponseT, promptErrorResponse = false, interceptorParameters: InterceptorParametersT){
        //Perform on request callback
        if(callbacks.onRequest && typeof callbacks.onRequest == 'function'){
            await callbacks.onRequest(
                interceptorParameters.request,
                interceptorParameters.options,
            );
        }

        coreStore.resetServiceError();
    }

    async function onRequestError(callbacks: CallbackResponseT, promptErrorResponse = false, interceptorParameters: InterceptorParametersT){
        //Perform on request error callback
        if(callbacks.onRequestError && typeof callbacks.onRequestError == 'function'){
            await callbacks.onRequestError(
                interceptorParameters.request,
                interceptorParameters.options,
                interceptorParameters.error
            );
        }

        coreStore.setServiceError({
            prompt: promptErrorResponse,
            icon: 'mdi:information-variant-circle-outline',
            title: 'Request failed',
            payload: {
                message: interceptorParameters?.error?.message ?? null
            }
        });
    }

    async function onResponse(callbacks: CallbackResponseT, promptErrorResponse = false, interceptorParameters: InterceptorParametersT){
        let request = interceptorParameters.request;
        let options = interceptorParameters.options;
        let response = interceptorParameters.response;
        let responseCode: number = _isEmpty(response) ? 0 : response._data.code;

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

        if(responseCode >= 400 && responseCode < 499){

            switch(responseCode.toString()) {
                case '401':
                    if(user.value){
                        promptStore.setPrompt({
                            icon: 'mdi:connection',
                            title: _get(response, '_data.message', ''),
                            message: 'Session have been ended, login again to restore session.',
                            action: {
                                callback: () => {
                                    useAuth().logout();
                                    navigateTo("/login", {replace: true});
                                },
                                label: 'Okay'
                            }
                        });
                    } else {
                        coreStore.setServiceError({
                            prompt: promptErrorResponse,
                            icon: 'mdi:information-variant-circle-outline',
                            title: 'Request failed',
                            payload: response?._data
                        });
                    }
                    break;
                case '406':

                    coreStore.setServiceError({
                        prompt: promptErrorResponse,
                        icon: 'mdi:information-variant-circle-outline',
                        title: 'Request failed',
                        payload: response?._data
                    });

                    //Perform not acceptable response callback
                    if(callbacks.onNotAcceptableResponse && typeof callbacks.onNotAcceptableResponse == 'function'){
                        await callbacks.onNotAcceptableResponse(request, options, response);
                    }

                    break;
                default:
                    coreStore.setServiceError({
                        prompt: promptErrorResponse,
                        icon: 'mdi:information-variant-circle-outline',
                        title: 'Request failed',
                        payload: response?._data
                    });
            }
        }

        if(responseCode >= 500 && responseCode < 600){
            coreStore.setServiceError({
                prompt: promptErrorResponse,
                icon: 'mdi:information-variant-circle-outline',
                title: 'Something Went Wrong',
                payload: response?._data
            });
        }
    }

    return {
        onRequest,
        onRequestError,
        onResponse
    }
}