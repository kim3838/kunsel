<template>
    <ConfirmationModal
        :closeable="false"
        :max-width="'lg'"
        :show="prompt.show"
        @close="$coreStore.promptAction()">
        <template #icon>
            <ClientOnly>
                <Icon
                    v-if="prompt.icon"
                    class="tw-h-full tw-w-full"
                    :name="prompt.icon">
                </Icon>
            </ClientOnly>
        </template>

        <template #title>
            <span v-text="prompt.title"></span>
        </template>

        <template #content>
            <div v-if="prompt.message">
                <div v-text="prompt.message"></div>
            </div>
            <div v-if="prompt.messageList.length">
                <ul>
                    <ClientOnly>
                        <li v-for="message in prompt.messageList" :key="message">
                            <Icon name="radix-icons:dot"></Icon>&nbsp;{{message}}
                        </li>
                    </ClientOnly>
                </ul>
            </div>
        </template>

        <template #footer>
            <Button :size="'md'" @click.native="$coreStore.promptAction()">
                <span class="tw-font-semibold">{{prompt.action.label}}</span>
            </Button>
        </template>
    </ConfirmationModal>
</template>

<script setup>
import {storeToRefs} from 'pinia';
const {$coreStore} = useNuxtApp();
const {prompt} = storeToRefs($coreStore);
</script>
