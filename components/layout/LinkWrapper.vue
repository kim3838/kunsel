<template>
    <NuxtLink
        :style="{'text-shadow': navigationTextShadow, 'font-family': fontFamily}"
        class="relative" :class="[classes, 'nav-link']">
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
    return props.active
        ? `nav-active-${props.activeStyle}`
        : ''
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

.nav-link{
    color: v-bind(navigationLinkColor);
}

.nav-link:hover{
    background-color: v-bind(accentColor70);
}
</style>