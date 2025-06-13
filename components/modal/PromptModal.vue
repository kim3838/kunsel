<template>
    <ConfirmationModal
        :closeable="false"
        :icon="icon"
        :show="show"
        @close="$promptStore.promptAction()">
        <template #title>
            <span v-text="title"></span>
        </template>

        <template #content>
            <div v-if="message">
                <div v-text="message"></div>
            </div>
            <div v-if="messageList.length" class="ml-2">
                <UnorderedList
                    v-for="(message, index) in messageList" :key="`${message}-${index}`"
                    :size="'md'"
                    :label="message"
                ></UnorderedList>
            </div>
        </template>

        <template #footer>
            <div class="flex space-x-2 justify-end">
                <Button :size="'md'" @click.native="$promptStore.promptAction()" :label="action.label"></Button>
            </div>
        </template>
    </ConfirmationModal>
</template>

<script setup>
import {storeToRefs} from 'pinia';
const {$promptStore} = useNuxtApp();
const {
    show,
    icon,
    title,
    message,
    messageList,
    action
} = storeToRefs($promptStore);
</script>
