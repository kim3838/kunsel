<template>
    <span class="tw-flex tw-items-center tw-justify-start tw-cursor-pointer">
        <input
            type="checkbox"
            :value="value"
            v-model="proxyModel"
            :class="[heightClass, inputClass]"
            class="tw-form-checkbox tw-text-darker tw-border-light focus:tw-ring-transparent focus:tw-border-lighter focus:tw-ring">
        <span :class="[fontClass]" class="tw-ml-1" v-text="label"></span>
    </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: [Array, Boolean],
    value: {
        type: [Boolean, Object],
        default: false
    },
    label: {
        type: String,
        default: '_',
    },
    size: {
        default: null
    },
});

const emit = defineEmits(["update:modelValue"]);

const proxyModel = computed({
    get() {
        return props.modelValue;
    },
    set(newValue) {
        emit("update:modelValue", newValue);
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
        'md': 'tw-text-base tw-font-medium',
        'lg': 'tw-text-xl tw-font-semibold'
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

