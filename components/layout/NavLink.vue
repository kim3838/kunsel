<template>
    <NuxtLink
        :to="to"
        :style="{'text-shadow': navigationTextShadow, 'font-family': fontFamily}"
        class="relative box-border inline-flex items-center px-2 focus:outline-none"
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
    },
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
    }

    return 'none';
});
const primaryColor90 = computed(() => {
    return primaryColor.value + hexAlpha.value['90'];
});
const primaryColor80 = computed(() => {
    return primaryColor.value + hexAlpha.value['80'];
});
const accentColor40 = computed(() => {
    return accentColor.value + hexAlpha.value['40'];
});

const classes = computed(() => {
    return props.active
        ? `nav-active-${props.activeStyle}`
        : 'nav'
});

const headerFontClass = computed(() => {
    return {
        'xs': 'text-sm',
        'sm': 'text-base',
        'md': 'text-lg',
        'lg': 'text-xl',
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
.nav{
    border: 1px solid transparent;
}

.nav-active-bg{
    border: 1px solid transparent;
    background-color: v-bind(accentColor40);
}

.nav-active-ripple{
    border: 1px solid transparent;
    color: v-bind(textInvertColor) !important;
    text-shadow: rgba(0, 0, 0, 0.5) 0 1px 2px;
    background: linear-gradient(to right, v-bind(primaryColor80) 20%, v-bind(primaryColor) 50%, v-bind(primaryColor90) 100%);
    overflow: hidden;
}
.nav-active-ripple::before{
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

.nav-link{
    color: v-bind(navigationLinkColor);
}

.nav-link:hover{
    background-color: v-bind(accentColor40);
}
</style>