<template>
    <input
        :disabled="disabled"
        :class="[
            fontClass,
            heightClass,
            backgroundClass,
            'focus:tw-ring-transparent focus:tw-ring',
            focusRing ? 'focus-ring' : '',
            withBorder ? 'bordered' : 'borderless',
            rounded ? 'tw-rounded-sm': '']"
        class="tw-pl-1 tw-form-input"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        ref="input">
</template>

<script setup>
import {ref, computed} from 'vue';

const { $themeStore } = useNuxtApp();

let shade = ref($themeStore.shade);
let thread = ref($themeStore.thread);
let tint = ref($themeStore.tint);
let accent = ref($themeStore.accent);
let lining = ref($themeStore.lining);

const props = defineProps({
    modelValue: [String, Number],
    size: {
        default: null
    },
    disabled: {
        type: Boolean,
        default: false
    },
    ring: {
        type: Boolean,
        default: false
    },
    focusRing: {
        type: Boolean,
        default: true
    },
    withBorder: {
        type: Boolean,
        default: true
    },
    rounded: {
        type: Boolean,
        default: true
    }
});

defineEmits(['update:modelValue']);

const heightClass = computed(() => {
    return {
        [null]: 'tw-h-9',
        '2xs': 'tw-h-5',
        'xs': 'tw-h-6',
        'sm': 'tw-h-7',
        'md': 'tw-h-8',
        'lg': 'tw-h-11',
        'xl': 'tw-h-14',
        '2xl' : 'tw-h-16',
        '3xl' : 'tw-h-20',
    }[props.size]
});

const fontClass = computed(() => {
    return {
        [null]: 'tw-text-base',
        '2xs': 'tw-text-xs',
        'xs': 'tw-text-xs',
        'sm': 'tw-text-sm',
        'md': 'tw-text-sm',
        'lg': 'tw-text-lg tw-font-semibold',
        'xl': 'tw-text-2xl tw-font-semibold',
        '2xl': 'tw-text-3xl tw-font-bold',
        '3xl': 'tw-text-5xl tw-font-bold',
    }[props.size];
});

const backgroundClass = computed(() => {
    return props.disabled ? '' : 'input-background';
});

</script>
<style scoped>
.input-background{
    background-color: v-bind(tint) !important;
}

.focus-ring:focus{
    border-color: v-bind(lining) !important;
}

.bordered{
    border-width: 1px;
    border-color: v-bind(thread) !important;
}

.borderless{
    border: 1px solid transparent;
}
</style>