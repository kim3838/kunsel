<template>
    <span
        :class="[
            fontClass, heightClass, invert ? 'px-0' : 'px-[0.3rem]',
            (shade && !invert && lightTheme && !isClearColorType) ? '_label' : ''
        ]"
        :style=[style]
        class="relative font-label inline-flex items-center">
        {{label}}
    </span>
</template>

<script setup lang="ts">
import type {CommonColorsT} from "@/stores/theme";
import type {LabelTypeT} from "@/public/js/types/theme";
import {storeToRefs} from "pinia";

const {$themeStore} = useNuxtApp();

const {
    type: themeType,
    text: textColor,
    common: commonColor,
} = storeToRefs($themeStore);
const typedCommonColor = commonColor as Ref<CommonColorsT>;

const lightTheme = computed(() => {
    return themeType.value === 'light';
})

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
        type: String as PropType<LabelTypeT>,
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

    return isClearColorType.value ? `transparent` : typedCommonColor.value[props.type].primary;
});

const isClearColorType = computed(() => {
    return props.type == 'clear';
})

const style = computed(() => {

    let color = isClearColorType.value
        ? textColor.value
        : (props.invert ? backgroundColor.value : '#fff');

    return {
        ...(props.invert ? {} : {
            'background-color': backgroundColor.value
        }),
        ...(isClearColorType.value ? {
            'box-shadow': `0 0 2px ${commonColor.value.default.primary}`,
        } : {}),
        'color': color,
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