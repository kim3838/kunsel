import { defineStore } from 'pinia'

export const useCoreStore = defineStore('core', {
    state: () => ({
        layout: 'landing',
        navigation: {
            mode: 'clear'
        },
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
        },

        navigationMode() {
            return this.navigation.mode;
        },
    },

    actions: {
        setNavigationMode(mode){
            if(mode != this.navigation.mode){
                this.navigation.mode = mode;
            }
        },
        setLayout(layout){
            if(layout != this.layout){
                this.layout = layout;
            }
        },
        setServiceError(serviceError){
            this.service.error = serviceError;

            let errors = _flatten(Object.values(_get(serviceError, 'payload.errors', {})));
            let message = errors.length ? null : _get(serviceError, 'payload.message', null);

            if(_get(serviceError, 'prompt', false)){
                this.prompt = {
                    show: serviceError.prompt,
                    icon: serviceError.icon,
                    title: serviceError.title,
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
