<template>
    <span class="tw-relative tw-overflow-hidden tw-flex tw-items-center tw-justify-start tw-cursor-pointer">
        <span class="tw-absolute tw-h-full tw-w-full"></span>
        <input
            :disabled="disabled"
            :tabindex="tabable ? 0 : -1"
            type="checkbox"
            :checked="proxyChecked"
            :class="[heightClass, inputClass]"
            class="tw-form-checkbox tw-text-accent tw-border-light focus:tw-ring-transparent focus:tw-border-lighter focus:tw-ring">
        <span v-if="label?.trim()" :class="[fontClass]" class="tw-ml-1 tw-text-accent" v-text="label"></span>
    </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    value: {
        type: [Number, String, Object],
        default: null
    },
    selected: {
        type: Array,
        default: null,
    },
    disabled: {
        type: Boolean,
        default: false
    },
    label: {
        type: String,
        default: null,
    },
    size: {
        default: null
    },
    checked: {
        type: Boolean,
        default: false,
    },
    tabable: {
        type: Boolean,
        default: true,
    }
});

const proxyChecked = computed(() => {

    if(Array.isArray(props.selected)){
        return props.selected.indexOf(props.value) >= 0;
    } else {
        return props.checked;
    }
});

const heightClass = computed(() => {
    return {
        [null]: 'tw-h-3.5 tw-w-3.5',
        'sm': 'tw-h-3 tw-w-3',
        'md': 'tw-h-3.5 tw-w-3.5',
        'lg': 'tw-h-5 tw-w-5',
    }[props.size];
});

const fontClass = computed(() => {
    return {
        [null]: 'tw-text-base tw-font-medium',
        'sm': 'tw-text-sm',
        'md': 'tw-text-base',
        'lg': 'tw-text-lg'
    }[props.size];
});

const inputClass = computed(() => {
    return {
        [null]: '',
        'sm': '',
        'md': '',
        'lg': 'tw-border-2'
    }[props.size];
});
</script>

