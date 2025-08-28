
import {defineStore} from 'pinia'
import type {PromptT} from "@/public/js/common/type";

export const usePromptStore = defineStore('prompt', () => {

    const show = ref<boolean>(false);
    const resetable = ref<boolean>(false);
    const resetLabel = ref<string>('Cancel');
    const icon = ref<string | null>(null);
    const title = ref<string | null>(null);
    const message = ref<string | null>(null);
    const messageList = ref<string[]>([]);
    const action = ref(<{
        callback: (() => void) | null;
        label: string;
    }>{
        callback: null,
        label: 'Click'
    });

    function setPrompt(promptPayload: PromptT){
        show.value = true;
        icon.value = promptPayload.icon;
        title.value = promptPayload.title;
        resetable.value = promptPayload?.resetable ?? false;
        resetLabel.value = promptPayload?.resetLabel ?? resetLabel.value;
        message.value = promptPayload.message;
        messageList.value = _get(promptPayload, 'messageList', []) ?? [];
        action.value = {
            callback: promptPayload.action.callback,
            label: promptPayload.action.label
        };
    }

    function $reset(){
        show.value = false;
        icon.value = null;
        title.value = null;
        resetable.value = false;
        resetLabel.value = 'Cancel';
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
        resetable,
        resetLabel,
        message,
        messageList,
        action,
        setPrompt,
        $reset,
        promptAction
    };
});