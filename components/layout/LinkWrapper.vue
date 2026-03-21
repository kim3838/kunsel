<template>
    <NuxtLink
        :style="{'font-family': fontFamily}"
        class="relative" :class="[classes]">
        <slot></slot>
    </NuxtLink>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia';

const {$themeStore} = useNuxtApp();
const {
    navigationMode,
} = useLayout();
const {
    hexAlpha,
    primary: primaryColor,
    accent: accentColor,
    textInvert: textInvertColor
} = storeToRefs($themeStore);

const {activeClearFluidBackground: activeClearFluidBackgroundComputed} = useCosmetic();

const primaryColor90 = computed(() => {
    return primaryColor.value + hexAlpha.value['90'];
});
const primaryColor80 = computed(() => {
    return primaryColor.value + hexAlpha.value['80'];
});
const accentColor70 = computed(() => {
    return accentColor.value + hexAlpha.value['70'];
});

const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    },
    activeStyle: {
        type: String,
        default: 'bg',
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
const classes = computed(() => {
    let classes = '';

    classes = classes + {
        'bg': 'nav-link-bg',
        'clear-fluid': 'nav-link-clear-fluid',
    }[props.activeStyle];

    if(props.active){
        classes = classes + ` nav-active-${props.activeStyle}`;
    }

    return classes
});

</script>

<style scoped>
.nav-active-bg{
    background-color: v-bind(accentColor70);
}
.nav-active-ripple{
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

.nav-active-clear-fluid{
    position: relative;
    z-index: 1;
    color: v-bind(textInvertColor) !important;
    text-shadow: rgba(0, 0, 0, 1) 0 1px 2px;
    background: v-bind(activeClearFluidBackgroundComputed);
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

.nav-link-bg{
    color: v-bind(navigationLinkColor);
}

.nav-link-bg:hover{
    background-color: v-bind(accentColor70);
}

.nav-link-clear-fluid{
    position: relative;
    z-index: 1;
    color: v-bind(navigationLinkColor);
    overflow: hidden;
}
.nav-link-clear-fluid::before{
    z-index: -1;
    content: '';
    position: absolute;
    top:0;
    bottom: 0;
    left:0;
    right:0;
    width: 230%;
    background-image: url('/images/deco/fluid-gold-top.webp');
    filter: grayscale(100%);
    background-size: cover;
    opacity: 0;
    transition: all 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
}
.nav-link-clear-fluid:hover{
    position: relative;
    z-index: 1;
    color: v-bind(textInvertColor) !important;
    text-shadow: rgba(0, 0, 0, 1) 0 1px 2px;
    background: v-bind(activeClearFluidBackgroundComputed);
    overflow: hidden;
}
.nav-link-clear-fluid:hover::before{
    left:-35%;
    opacity: 0.2;
}
</style>