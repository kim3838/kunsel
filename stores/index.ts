import {defineStore} from 'pinia'

export const useCoreStore = defineStore('core', () => {
    const route = useRoute();

    const layout = ref('landing');
    const navigation = ref({
        mode: 'clear'
    });
    const service = ref({
        error: {
            prompt: false,
            title: null,
            icon: null,
            payload: null
        }
    });
    const prompt = ref({
        show: false,
        icon: null,
        title: null,
        message: null,
        messageList: [],
        action: {
            callback: null,
            label: 'Click'
        }
    });

    const getServiceError = computed(() => {
        return service.value.error;
    })
    const navigationMode = computed(() => {
        return navigation.value.mode;
    })
    const enableScrollSnap = computed(() => {
        return ['index'].indexOf(_toLower(route.name)) >= 0;
    })

    function setNavigationMode(mode){
        if(mode != navigation.value.mode){
            navigation.value.mode = mode;
        }
    }
    function setLayout(layout){
        if(layout != layout.value){
            layout.value = layout;
        }
    }
    function setServiceError(serviceError){
        service.value.error = serviceError;

        let errors = _flatten(Object.values(_get(serviceError, 'payload.errors', {})));
        let message = errors.length ? null : _get(serviceError, 'payload.message', null);

        if(_get(serviceError, 'prompt', false)){
            prompt.value = {
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
    }
    function setPrompt(promptPayload){
        prompt.value = {
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
    }
    function resetServiceError(){
        service.value.error = {
            prompt: false,
            title: null,
            icon: null,
            payload: null
        };
    }
    function resetPrompt(){
        prompt.value = {
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
    }
    function promptAction(){
        if(typeof prompt.value.action.callback == 'function'){
            prompt.value.action.callback();
        }
        resetPrompt();
    }

    return {
        layout,
        navigation,
        service,
        prompt,
        getServiceError,
        navigationMode,
        enableScrollSnap,
        setNavigationMode,
        setLayout,
        setServiceError,
        setPrompt,
        resetServiceError,
        resetPrompt,
        promptAction
    }
})
