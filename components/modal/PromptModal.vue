<template>
    <ConfirmationModal
        :closeable="false"
        :max-width="'lg'"
        :show="show"
        @close="$promptStore.promptAction()">
        <template #icon>
            <ClientOnly>
                <Icon
                    v-if="icon"
                    class="tw-h-full tw-w-full"
                    :name="icon">
                </Icon>
            </ClientOnly>
        </template>

        <template #title>
            <span v-text="title"></span>
        </template>

        <template #content>
            <div v-if="message">
                <div v-text="message"></div>
            </div>
            <div v-if="messageList.length">
                <ul>
                    <ClientOnly>
                        <li v-for="messageNode in messageList" :key="messageNode">
                            <Icon name="radix-icons:dot"></Icon>&nbsp;{{messageNode}}
                        </li>
                    </ClientOnly>
                </ul>
            </div>
        </template>

        <template #footer>
            <div class="tw-flex tw-space-x-2 tw-justify-end">
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
