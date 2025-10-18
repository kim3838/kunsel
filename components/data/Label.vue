<template>
    <span
        :class="[
            fontClass, heightClass, invert ? 'px-0' : 'px-[0.3rem]',
            (shade && !invert) ? '_label' : ''
        ]"
        :style=[style]
        class="relative font-label inline-flex items-center">
        {{label}}
    </span>
</template>

<script setup lang="ts">
import type {CommonColorsT} from "@/stores/theme";
import {storeToRefs} from "pinia";
import type {LabelTypesT} from "@/public/js/types/theme";
const {$themeStore} = useNuxtApp();

const {
    common: commonColor,
} = storeToRefs($themeStore);
const typedCommonColor = commonColor as Ref<CommonColorsT>;

const props = defineProps({
    label: {
        type: String,
        default: null,
    },
    size: {
        type: String,
        default: 'md'
    },
    shade: {
        type: Boolean,
        default: false,
    },
    invert: {
        type: Boolean,
        default: false,
    },
    fontFamily: {
        type: String,
        default: 'inherit'
    },
    type: {
        type: String as PropType<LabelTypesT>,
        default: 'default'
    }
});

const fontClass = computed(() => {

    return {
        '2xs': `text-sm font-normal`,
        'xs': `text-sm font-normal`,
        'sm': `text-sm font-normal`,
        'md': `text-base font-normal`,
        'lg': `text-base font-normal`,
        'xl': `text-base font-normal`,
        '2xl': `text-base font-normal`,
    }[props.size]
});

const heightClass = computed(() => {
    return {
        '2xs': 'h-5',
        'xs': 'h-5',
        'sm': 'h-5',
        'md': 'h-6',
        'lg': 'h-7',
        'xl': 'h-8',
        '2xl' : 'h-8',
    }[props.size]
});

const backgroundColor = computed(() => {

    return typedCommonColor.value[props.type].primary;
});

const style = computed(() => {

    return {
        ...(props.invert ? {} : {
            'background-color': backgroundColor.value
        }),
        'color': props.invert ? backgroundColor.value : '#fff',
        'border-radius': '.25em'
    };
});
</script>

<style scoped>

._label{
    overflow: hidden;
}

._label::before{
    content: '';
    position: absolute;
    top:0;
    bottom: 0;
    left:0;
    right:0;
    width: 120%;
    background-image: url('/images/deco/ripple_texture.png'), linear-gradient(to right, transparent, v-bind(backgroundColor));
    background-size: cover;
    opacity: 0.2;
    transition: all 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>