
import { defineStore } from 'pinia'

export const useFormStore = defineStore('form', {
    state: () => ({
        service: {
            error: {
                prompt: false,
                title: null,
                payload: null
            }
        },
        formCounter: 0,
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
        resetServiceError(state){
            this.service.error = {
                prompt: false,
                title: null,
                payload: null
            };
        },
        formIncrement() {
            this.formCounter++;
        },
    },
})
