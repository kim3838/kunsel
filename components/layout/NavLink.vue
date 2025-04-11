<template>
    <NuxtLink
        :to="to"
        :style="{'text-shadow': navigationTextShadow, 'font-family': fontFamily}"
        class="box-border inline-flex items-center px-2 focus:outline-none focus:ring-transparent focus:ring-1"
        :class="[classes, headerFontClass, 'nav-link']">
        <Icon v-if="icon" :name="icon" class="mr-1" /><slot></slot>
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
const primaryColor50 = computed(() => {
    return primaryColor.value + hexAlpha.value['50'];
});
const accentColor20 = computed(() => {
    return accentColor.value + hexAlpha.value['20'];
});



const classes = computed(() => {
    return props.active
        ? 'nav-active'
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
</script>
<style scoped>
.nav{
    border: 1px solid transparent;
}

.nav-active{
    border-style: solid;
    border-top-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-width: 1px;
    border-left-width: 1px;
    border-right-width: 1px;
    border-bottom-width: 2px;
    border-bottom-color: v-bind(primaryColor50);
    background-color: v-bind(accentColor20);
}

.nav-link{
    color: v-bind(navigationLinkColor);
}

.nav-link:focus{
    border: 1px solid v-bind(neutralColor);
}

.nav-link:hover{
    background-color: v-bind(accentColor20);
}
</style>