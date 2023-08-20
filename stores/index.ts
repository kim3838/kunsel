
import { defineStore } from 'pinia'

export const useCoreStore = defineStore('core', {
    state: () => ({
        service: {
            error: {
                prompt: false,
                title: null,
                icon: null,
                payload: null
            }
        }
    }),

    getters: {
        getServiceError() {
            return this.service.error;
        }
    },

    actions: {
        setServiceError(serviceError){
            this.service.error = serviceError;
        },
        resetServiceError(){
            this.service.error = {
                prompt: false,
                title: null,
                icon: null,
                payload: null
            };
        }
    },
})
