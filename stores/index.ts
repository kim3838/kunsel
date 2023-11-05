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
        },
        prompt: {
            show: false,
            icon: null,
            title: null,
            message: null,
            messageList: [],
            action: {
                callback: null,
                label: 'Click'
            }
        }
    }),

    getters: {
        getServiceError() {
            return this.service.error;
        }
    },

    actions: {
        setLayout(layout){
            if(layout != this.layout){
                this.layout = layout;
            }
        },
        setServiceError(serviceError){
            this.service.error = serviceError;

            let errors = _flatten(Object.values(this.service.error?.payload?.errors) ?? []);
            let message = errors.length ? null : this.service.error?.payload?.message;

            if(this.service.error.prompt){
                this.prompt = {
                    show: true,
                    icon: this.service.error.icon,
                    title: this.service.error.title,
                    message: message,
                    messageList: errors,
                    action: {
                        callback: () => {
                            this.resetServiceError();
                        },
                        label: 'Close'
                    }
                };
            }
        },
        setPrompt(promptPayload){
            this.prompt = {
                show: true,
                icon: promptPayload.icon,
                title: promptPayload.title,
                message: promptPayload.message,
                messageList: [],
                action: {
                    callback: promptPayload.action.callback,
                    label: promptPayload.action.label
                }
            };
        },
        resetServiceError(){
            this.service.error = {
                prompt: false,
                title: null,
                icon: null,
                payload: null
            };
        },
        resetPrompt(){
            this.prompt = {
                show: false,
                icon: null,
                title: null,
                message: null,
                messageList: [],
                action: {
                    callback: null,
                    label: 'Click'
                }
            };
        },
        promptAction(){
            if(typeof this.prompt.action.callback == 'function'){
                this.prompt.action.callback();
            }
            this.resetPrompt();
        }
    },
})
