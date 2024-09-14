import {defineStore} from 'pinia'

type serviceErrorType = {
    prompt: boolean,
    icon: string | null,
    title: string | null,
    payload: object | null
}

export const useCoreStore = defineStore('core', () => {
    const service = ref({
        error: {
            prompt: false,
            title: null,
            icon: null,
            payload: null
        }
    });

    const getServiceError = computed(() => {
        return service.value.error;
    })

    function setServiceError(serviceError: serviceErrorType){

        service.value.error = serviceError;

        let that = this;
        let errors = _flatten(Object.values(_get(serviceError, 'payload.errors', {})));
        let message = errors.length ? null : _get(serviceError, 'payload.message', null);

        if(_get(serviceError, 'prompt', false)){
            useNuxtApp().$promptStore.setPrompt({
                show: serviceError.prompt,
                icon: serviceError.icon,
                title: serviceError.title,
                message: message,
                messageList: errors,
                action: {
                    callback: () => {
                        that.resetServiceError();
                    },
                    label: 'Close'
                }
            });
        }
    }

    function resetServiceError(){
        service.value.error = {
            prompt: false,
            title: null,
            icon: null,
            payload: null
        };
    }

    return {
        service,
        getServiceError,
        setServiceError,
        resetServiceError
    }
})
