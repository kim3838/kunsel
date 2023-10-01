<template>
    <ConfirmationModal
        :closeable="false"
        :max-width="'lg'"
        :show="service.error.prompt"
        @close="$coreStore.resetServiceError()">
        <template #icon>
            <Icon
                v-if="service.error.icon"
                class="tw-h-full tw-w-full"
                :name="service.error.icon">
            </Icon>
        </template>

        <template #title>
            <span v-text="service.error.title"></span>
        </template>

        <template #content>
            <div v-if="service.error.payload">
                <div v-text="service.error.payload.message"></div>
            </div>
        </template>

        <template #footer>
            <Button :size="'md'" @click.native="$coreStore.resetServiceError()">
                <span class="tw-font-semibold">Close</span>
            </Button>
        </template>
    </ConfirmationModal>
</template>

<script setup>
import {storeToRefs} from 'pinia';
const {$coreStore} = useNuxtApp();
const {service} = storeToRefs($coreStore);
</script>
