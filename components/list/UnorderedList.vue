<template>
    <div class="relative overflow-hidden flex items-start justify-start">
        <div class="absolute h-full w-full pointer-events-none"></div>
        <div :style="{'height': iconSlotHeight}" class=" box-border flex items-center">
            <Icon :name="icon" :class="[heightClass]"/>
        </div>
        <div :class="[fontClass]" :style="{'font-family': fontFamily}" class="ml-1 whitespace-pre-line">{{label}}<slot></slot></div>
    </div>
</template>

<script setup>
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
    fontFamily: {
        type: String,
        default: 'inherit'
    },
    icon: {
        type: String,
        default: 'material-symbols:arrow-right'
    },
});

const iconSlotHeight = computed(()=>{
    return {
        'sm': '18px',
        'md': '22px',
        'lg': '26px',
    }[props.size];
})

const heightClass = computed(() => {
    return {
        'sm': 'h-3 w-3',
        'md': 'h-3.5 w-3.5',
        'lg': 'h-5 w-5',
    }[props.size];
});

const fontClass = computed(() => {
    return {
        'sm': 'text-sm',
        'md': 'text-base',
        'lg': 'text-lg'
    }[props.size];
});
</script>