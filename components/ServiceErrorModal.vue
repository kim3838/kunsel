<template>
    <ConfirmationModal
        :closeable="false"
        :max-width="'lg'"
        :show="useNuxtApp().$coreStore.service.error.prompt"
        @close="useNuxtApp().$coreStore.resetServiceError()">
        <template #icon>
            <Icon class="tw-h-full tw-w-full" name="ic:sharp-error-outline"></Icon>
        </template>

        <template #title>
            <span v-text="useNuxtApp().$coreStore.service.error.title"></span>
        </template>

        <template #content>
            <div v-if="useNuxtApp().$coreStore.service.error.payload">
                <div v-text="useNuxtApp().$coreStore.service.error.payload.message"></div>
            </div>
        </template>

        <template #footer>
            <Button :size="'md'" @click.native="useNuxtApp().$coreStore.resetServiceError()">
                <span class="tw-font-semibold">Close</span>
            </Button>
        </template>
    </ConfirmationModal>
</template>

<script>
export default {
    name: "ServiceErrorModal",
}
</script>
