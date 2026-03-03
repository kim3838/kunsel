<template>
    <div v-show="show" :class="[show ? 'flex' : '']" class="fixed inset-0 overflow-y-auto px-0 z-50">
        <div v-show="show" class="fixed inset-0" @click="close">
            <div class="absolute inset-0 modal-layer opacity-75"></div>
        </div>

        <div v-show="show" class="h-min self-center flex items-center relative z-[60] w-full" :class="[modalContainerClass]">
            <div class="modal-body overflow-auto mx-auto my-2 w-full" :class="[modalBodyClass]" :style="[widthStyle, heightStyle]">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import {storeToRefs} from 'pinia'

const {$themeStore} = useNuxtApp()

const {
    primary: primaryColor,
    secondary: secondaryColor,
    neutral: neutralColor,
    body: bodyColor,
    thread: threadColor,
    tint: tintColor,
} = storeToRefs($themeStore)

const props = defineProps({
    landscape: {
        type: Boolean,
        default: false,
    },
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
})

const emit = defineEmits(['close'])

const close = () => {
    if (props.closeable) {
        emit('close')
    }
}

const widthStyle = computed(() => {
    if (props.landscape) {
        return {}
    }
    return {
        'max-width': props.maxWidth ? props.maxWidth : 'max-content',
    }
})

const heightStyle = computed(() => {

    let maxHeight = props.maxHeight ? props.maxHeight : `100vh`;

    return {
        'max-height': `calc(${maxHeight} - 1rem)`
    }
})

const modalBodyClass = computed(() => {
    return props.landscape ? '' : 'rounded-sm'
})

const modalContainerClass = computed(() => {
    return props.landscape ? '' : 'px-2'
})
</script>
<style scoped>
.modal-layer{
    background-color: v-bind(secondaryColor);
}

.modal-body{
    background-color: v-bind(bodyColor);
}
</style>