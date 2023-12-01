<template>
    <div class="tw-relative tw-box-border" :class="[heightClass]">
        <div v-if="icon?.trim()" class="tw-absolute tw-h-full tw-z-20 tw-flex tw-items-center tw-pointer-events-none">
            <ClientOnly><Icon :class="[iconClass]" :name="icon" /></ClientOnly>
        </div>
        <input
            :id="id"
            :tabindex="tabindex"
            :disabled="disabled"
            :class="[
                fontClass,
                spacingClass,
                backgroundClass,
                'focus:tw-ring-transparent focus:tw-ring',
                focusRing ? 'focus-ring' : '',
                withBorder ? 'bordered' : 'borderless',
                rounded ? 'tw-rounded-sm': ''
            ]"
            :style="{'top': absoluteTopAllocation}"
            class="tw-relative tw-w-full tw-h-full tw-z-10 tw-form-input tw-box-border"
            :value="modelValue"
            :placeholder="placeholder"
            :type="type"
            :readonly="readonly"
            @input="$emit('update:modelValue', $event.target.value)"
            ref="input">
    </div>

</template>

<script setup>
import {ref, computed} from 'vue';
import {storeToRefs} from 'pinia';
const {$themeStore} = useNuxtApp();

const {
    lining: liningColor,
    thread: threadColor,
    tint: tintColor,
} = storeToRefs($themeStore);

const props = defineProps({
    modelValue: [String, Number],
    size: {
        default: 'md'
    },
    id: {
        type: String,
        default: null,
    },
    tabindex: {
        type: Number,
        default: 0
    },
    icon: {
        type: String,
        default: null,
    },
    type: {
        type: String,
        default: 'text',
    },
    placeholder: {
        type: String,
        default: ''
    },
    inCell: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    readonly: {
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

const iconClass = computed(() => {
    return {
        '2xs': 'tw-h-4 tw-w-4 tw-ml-[0.17rem]',
        'xs': 'tw-h-5 tw-w-5 tw-ml-[0.2rem]',
        'sm': 'tw-h-5 tw-w-5 tw-ml-[0.6rem]',
        'md': 'tw-h-5 tw-w-5 tw-ml-[0.6rem]',
        'lg': 'tw-h-8 tw-w-8 tw-mt-[0.1rem] tw-ml-[0.45rem]',
        'xl': 'tw-h-9 tw-w-9 tw-mt-[0.1rem] tw-ml-[0.6rem]',
        '2xl': 'tw-h-12 tw-w-12 tw-mt-[0.1rem] tw-ml-[0.6rem]',
    }[props.size]
});

const absoluteTopAllocation = computed(() => {
    return {
        '2xs': props.inCell ? '0' : '-0.2rem',
        'xs': props.inCell ? '0' : '-1px',
        'sm': '0',
        'md': '0',
        'lg': '0',
        'xl': '0'
    }[props.size]
});

const spacingClass = computed(() => {
    return {
        '2xs': props.icon?.trim() ? 'tw-pl-[1.3rem]' : '',
        'xs': props.icon?.trim() ? 'tw-pl-[1.55rem]' : '',
        'sm': props.icon?.trim() ? 'tw-pl-[2rem]' : '',
        'md': props.icon?.trim() ? 'tw-pl-[2rem]' : '',
        'lg': props.icon?.trim() ? 'tw-pl-[2.5rem]' : '',
        'xl': props.icon?.trim() ? 'tw-pl-[3rem]' : '',
        '2xl': props.icon?.trim() ? 'tw-pl-[3.75rem]' : ''
    }[props.size]
});

const heightClass = computed(() => {
    return {
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
        '2xs': 'tw-text-xs',
        'xs': 'tw-text-xs',
        'sm': 'tw-text-sm',
        'md': 'tw-text-sm',
        'lg': 'tw-text-lg tw-font-semibold',
        'xl': 'tw-text-2xl tw-font-semibold',
        '2xl': 'tw-text-4xl tw-font-semibold',
        '3xl': 'tw-text-5xl tw-font-bold',
    }[props.size];
});

const backgroundClass = computed(() => {
    return props.disabled ? '' : 'input-background';
});

</script>
<style scoped>
.input-background{
    background-color: v-bind(tintColor) !important;
}

.focus-ring:focus{
    border-color: v-bind(liningColor) !important;
}

.bordered{
    border-width: 1px;
    border-color: v-bind(threadColor) !important;
}

.borderless{
    border: 1px solid transparent;
}

input[type=number] {
    position: relative;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    position: absolute;
    opacity: 1;
    top: 0;
    right: 0;
    height: 100%;
}

</style>