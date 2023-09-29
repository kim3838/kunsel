import { defineStore } from 'pinia'

export const useCoreStore = defineStore('core', {
    state: () => ({
        layout: 'landing',
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
        setLayout(layout){
            if(layout != this.layout){
                this.layout = layout;
            }
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
