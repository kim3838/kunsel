<template>
    <NuxtLink
        :to="to"
        :style="{'font-family': fontFamily}"
        class="relative box-border inline-flex items-center px-2 focus:outline-none rounded-[2px]"
        :class="[classes, headerFontClass, 'nav-link']">
        <Icon class="flex-none mr-1" :class="[iconClass]" v-if="icon" :name="icon" />
        <slot></slot>
    </NuxtLink>
</template>

<script setup>
import {storeToRefs} from 'pinia';

const {$themeStore} = useNuxtApp();
const {
    navigationMode,
} = useLayout();

const {
    appTheme,
    hexAlpha,
    primary: primaryColor,
    accent: accentColor,
    neutral: neutralColor,
    textInvert: textInvertColor
} = storeToRefs($themeStore);

const props = defineProps({
    to: {
        type: String,
        default: null,
    },
    icon: {
        type: String,
        default: null,
    },
    active: {
        type: Boolean,
        default: false,
    },
    activeStyle: {
        type: String,
        default: 'bg',
    },
    size: {
        default: 'md'
    },
    fontFamily: {
        type: String,
        default: 'inherit'
    }
});

const navigationLinkColor = computed(()=>{
    if(navigationMode.value == 'clear-with-background'){
        return '#ffffff';
    }

    return 'auto';
});
const navigationTextShadow = computed(()=>{

    if(navigationMode.value === 'clear-with-background'){
        return '1px 1px 2px #000000';
    } else if(props.active && appTheme.value !== 'dark-silver' && navigationMode.value !== 'clear-with-background'){
        return 'rgba(0, 0, 0, 0.5) 0 1px 2px';
    }

    return 'none';
});
const primaryColor90 = computed(() => {
    return primaryColor.value + hexAlpha.value['90'];
});
const primaryColor80 = computed(() => {
    return primaryColor.value + hexAlpha.value['80'];
});
const primaryColor70 = computed(() => {
    return primaryColor.value + hexAlpha.value['70'];
});
const primaryColor60 = computed(() => {
    return primaryColor.value + hexAlpha.value['60'];
});
const primaryColor50 = computed(() => {
    return primaryColor.value + hexAlpha.value['50'];
});
const primaryColor40 = computed(() => {
    return primaryColor.value + hexAlpha.value['40'];
});
const accentColor90 = computed(() => {
    return accentColor.value + hexAlpha.value['90'];
});
const accentColor70 = computed(() => {
    return accentColor.value + hexAlpha.value['70'];
});
const accentColor60 = computed(() => {
    return accentColor.value + hexAlpha.value['60'];
});
const accentColor40 = computed(() => {
    return accentColor.value + hexAlpha.value['40'];
});

const classes = computed(() => {
    return props.active
        ? `nav-active-${props.activeStyle}`
        : ''
});

const headerFontClass = computed(() => {
    return {
        'xs': 'text-xs',
        'sm': 'text-sm',
        'md': 'text-base',
        'lg': 'text-lg',
    }[props.size]
});

const iconClass = computed(() => {
    return {
        '2xs': 'h-4 w-4',
        'xs': 'h-5 w-5',
        'sm': 'h-5 w-5',
        'md': 'h-5 w-5',
        'lg': 'h-8 w-8'
    }[props.size];
});
</script>
<style scoped>
.nav-link{
    color: v-bind(navigationLinkColor);
}

.nav-link:hover{
    position: relative;
    z-index: 1;
    color: v-bind(textInvertColor) !important;
    text-shadow: rgba(0, 0, 0, 1) 0 1px 2px;
    background: linear-gradient(to right, v-bind(primaryColor70) 20%, v-bind(accentColor) 60%, v-bind(accentColor) 75%, v-bind(primaryColor60) 100%);
    overflow: hidden;
}
.nav-link:hover::before{
    z-index: -1;
    content: '';
    position: absolute;
    top:0;
    bottom: 0;
    left:-35%;
    right:0;
    width: 230%;
    background-image: url('/images/deco/fluid-gold-top.webp');
    filter: grayscale(100%);
    background-size: cover;
    opacity: 0.2;
    transition: all 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
}

.nav-active-bg{
    background-color: v-bind(accentColor70);
}

.nav-active-ripple{
    z-index: 1;
    color: v-bind(textInvertColor) !important;
    text-shadow: rgba(0, 0, 0, 0.5) 0 1px 2px;
    background: linear-gradient(to right, v-bind(primaryColor80) 20%, v-bind(primaryColor) 50%, v-bind(primaryColor) 60%, v-bind(primaryColor90) 100%);
    overflow: hidden;
}
.nav-active-ripple::before{
    z-index: -1;
    content: '';
    position: absolute;
    top:0;
    bottom: 0;
    left:0;
    right:0;
    width: 120%;
    background-image: url('/images/deco/ripple_texture.png'), linear-gradient(to right, transparent, v-bind(primaryColor));
    background-size: cover;
    opacity: 0.2;
    transition: all 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
}

.nav-active-clear-fluid{
    position: relative;
    z-index: 1;
    color: v-bind(textInvertColor) !important;
    text-shadow: rgba(0, 0, 0, 1) 0 1px 2px;
    background: linear-gradient(to right, v-bind(primaryColor70) 20%, v-bind(accentColor) 60%, v-bind(accentColor) 75%, v-bind(primaryColor60) 100%);
    overflow: hidden;
}
.nav-active-clear-fluid::before{
    z-index: -1;
    content: '';
    position: absolute;
    top:0;
    bottom: 0;
    left:-35%;
    right:0;
    width: 230%;
    background-image: url('/images/deco/fluid-gold-top.webp');
    filter: grayscale(100%);
    background-size: cover;
    opacity: 0.2;
    transition: all 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>