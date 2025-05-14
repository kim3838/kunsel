
import {defineStore} from 'pinia'
import type {ServiceErrorT} from "@/public/js/common/type";

export const useCoreStore = defineStore('core', () => {
    const service = ref<{
        error: ServiceErrorT;
    }>({
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

    function setServiceError(serviceError: ServiceErrorT){

        service.value.error = serviceError;

        let errors = _flatten(Object.values(_get(serviceError, 'payload.errors', []))) as string[];
        let message = errors.length ? null : _get(serviceError, 'payload.message', null);

        if(_get(serviceError, 'prompt', false)){
            useNuxtApp().$promptStore.setPrompt({

                icon: serviceError.icon ?? null,
                title: serviceError.title ?? null,
                message: message,
                messageList: errors,
                action: {
                    callback: () => {
                        resetServiceError();
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
