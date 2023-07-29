<template>
    <input
        :disabled="disabled"
        :class="[fontClass, heightClass, backgroundClass, ring ? 'focus:tw-ring-light focus:tw-ring-opacity-25' : 'focus:tw-ring-transparent']"
        class="tw-pl-1 tw-form-input tw-border tw-border-neutral-200 tw-rounded-sm focus:tw-border-lighter focus:tw-ring"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        ref="input">
</template>

<script setup>
import { reactive, computed, nextTick } from 'vue';

const props = defineProps({
    modelValue: String,
    height: {
        default: null
    },
    disabled: {
        type: Boolean,
        default: false
    },
    ring: {
        type: Boolean,
        default: false
    }
});
defineEmits(['update:modelValue']);

const heightClass = computed(() => {
    return {
        [null]: 'tw-h-9',
        'xs': 'tw-h-5',
        'sm': 'tw-h-7',
        'md': 'tw-h-8',
        'lg': 'tw-h-11',
        'xl': 'tw-h-14',
        '2xl' : 'tw-h-16',
        '3xl' : 'tw-h-20',
    }[props.height]
});

const fontClass = computed(() => {
    return {
        [null]: 'tw-text-base',
        'xs': 'tw-text-xs',
        'sm': 'tw-text-sm',
        'md': 'tw-text-base',
        'lg': 'tw-text-lg tw-font-semibold',
        'xl': 'tw-text-xl tw-font-semibold',
        '2xl': 'tw-text-3xl tw-font-bold',
        '3xl': 'tw-text-5xl tw-font-bold',
    }[props.height];
});

const backgroundClass = computed(() => {
    return {
        [false] : 'tw-bg-white',
        [true] : 'tw-bg-gray-200'
    }[props.disabled];
});

function focus(){
    this.$refs.input.focus();
}

</script>

