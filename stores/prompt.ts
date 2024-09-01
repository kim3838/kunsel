import {defineStore} from 'pinia'

export const usePromptStore = defineStore('prompt', () => {

    const show = ref(false);
    const icon = ref(null);
    const title = ref(null);
    const message = ref(null);
    const messageList = ref([]);
    const action = ref({
        callback: null,
        label: 'Click'
    });

    function setPrompt(promptPayload){
        show.value = true;
        icon.value = promptPayload.icon;
        title.value = promptPayload.title;
        message.value = promptPayload.message;
        messageList.value = _get(promptPayload, 'messageList', []);
        action.value = {
            callback: promptPayload.action.callback,
            label: promptPayload.action.label
        };
    }

    function $reset(){
        show.value = false;
        icon.value = null;
        title.value = null;
        message.value = null;
        messageList.value = [];
        action.value = {
            callback: null,
            label: 'Click'
        };
    }

    function promptAction(){
        if(typeof action.value.callback == 'function'){
            action.value.callback();
        }
        $reset();
    }

    return {
        show,
        icon,
        title,
        message,
        messageList,
        action,
        setPrompt,
        $reset,
        promptAction
    };
});