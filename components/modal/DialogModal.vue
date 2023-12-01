<template>
    <Modal
        :show="show"
        :max-width="maxWidth"
        :closeable="closeable"
        @close="close"
    >
        <div class="tw-p-3 modal-body">
            <div class="tw-text-lg tw-font-semibold">
                <slot name="title" />
            </div>

            <div class="tw-mt-1 tw-text-base">
                <slot name="content" />
            </div>
        </div>

        <div class="tw-px-3 tw-py-2.5 tw-text-end">
            <slot name="footer" />
        </div>
    </Modal>
</template>

<script setup>
import {storeToRefs} from 'pinia';

const {$themeStore} = useNuxtApp();

const {
    neutral: neutralColor,
} = storeToRefs($themeStore);

defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    maxWidth: {
        type: String,
        default: '2xl',
    },
    closeable: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(['close']);

const close = () => {
    emit('close');
};
</script>
<style scoped>

.modal-body{
    border-bottom:1px solid v-bind(neutralColor);
}
</style>