<template>
    <Modal
        :show="show"
        :max-width="maxWidth"
        :max-height="maxHeight"
        :closeable="closeable"
        :landscape="landscape"
        :contentPadding="contentPadding"
        @close="close"
    >
        <div :style=[modalBodySpacingStyle] :class="[bodyBorderBottom ? 'body-bottom-border' : '']">
            <div class="text-lg font-header">
                <slot name="title" />
            </div>

            <div class="text-base">
                <slot name="content" />
            </div>
        </div>

        <div class="px-3 py-2.5">
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

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    maxWidth: {
        type: [String, null],
        default: null,
    },
    maxHeight: {
        type: [String, null],
        default: `100vh`,
    },
    closeable: {
        type: Boolean,
        default: true,
    },
    landscape: {
        default: false
    },
    contentPadding: {
        type: String,
        default: 'calc(0.25rem * 3)'
    },
    bodyBorderBottom: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['close']);

const close = () => {
    emit('close');
};

const modalBodySpacingStyle = computed(() => {
    let style = {};

    if(!_isEmpty(props.contentPadding)){
        style = {
            ...style,
            'padding': props.contentPadding
        }
    }

    return style;
})
</script>
<style scoped>

.body-bottom-border{
    border-bottom:1px solid v-bind(neutralColor);
}
</style>