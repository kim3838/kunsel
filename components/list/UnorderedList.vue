<template>
    <div class="tw-relative tw-overflow-hidden tw-flex tw-items-start tw-justify-start">
        <div class="tw-absolute tw-h-full tw-w-full tw-pointer-events-none"></div>
        <div :style="{'height': iconSlotHeight}" class="tw-flex tw-items-center">
            <ClientOnly><Icon :name="icon" :class="[heightClass]"/></ClientOnly>
        </div>
        <div :class="[fontClass]" class="tw-ml-1 tw-whitespace-pre-line">{{label}}<slot></slot></div>
    </div>
</template>

<script setup>
import {ref, computed} from 'vue';
import {storeToRefs} from 'pinia';
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    type: themeType,
    primary: primaryColor,
    lining: liningColor,
    textInvert: textInvertColor,
} = storeToRefs($themeStore);

const props = defineProps({
    label: {
        type: String,
        default: null,
    },
    size: {
        type: String,
        default: 'md'
    },
    icon: {
        type: String,
        default: 'material-symbols:arrow-right'
    },
});

const iconSlotHeight = computed(()=>{
    return {
        'sm': '20px',
        'md': '24px',
        'lg': '28px',
    }[props.size];
})

const heightClass = computed(() => {
    return {
        'sm': 'tw-h-3 tw-w-3',
        'md': 'tw-h-3.5 tw-w-3.5',
        'lg': 'tw-h-5 tw-w-5',
    }[props.size];
});

const fontClass = computed(() => {
    return {
        'sm': 'tw-text-sm',
        'md': 'tw-text-base',
        'lg': 'tw-text-lg'
    }[props.size];
});
</script>