<template>
    <NuxtLink
        :to="to"
        :style="{'text-shadow': navigationTextShadow}"
        class="tw-box-border tw-inline-flex tw-items-center tw-px-4 focus:tw-outline-none focus:tw-ring-transparent focus:tw-ring-1"
        :class="[classes, headerFontClass, 'nav-link']">
        <slot></slot>
    </NuxtLink>
</template>

<script setup>
import {computed} from "vue";
import {storeToRefs} from 'pinia';
const {$themeStore, $coreStore} = useNuxtApp();

const {
    hexAlpha,
    primary: primaryColor,
    accent: accentColor,
    neutral: neutralColor,
} = storeToRefs($themeStore);

const {
    navigationMode
} = storeToRefs($coreStore);

const navigationLinkColor = computed(()=>{
    if(navigationMode.value === 'clear'){
        return '#ffffff';
    }

    return 'auto';
});
const navigationTextShadow = computed(()=>{
    if(navigationMode.value === 'clear'){
        return '1px 1px #464646';
    }

    return 'none';
});
const primaryColor50 = computed(() => {
    return primaryColor.value + hexAlpha.value['50'];
});
const accentColor20 = computed(() => {
    return accentColor.value + hexAlpha.value['20'];
});

const props = defineProps({
    to: {
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
});

const classes = computed(() => {
    return props.active
        ? 'nav-active'
        : 'nav'
});

const headerFontClass = computed(() => {
    return {
        'sm': 'tw-text-base tw-font-medium',
        'md': 'tw-text-lg tw-font-medium',
        'lg': 'tw-text-xl tw-font-medium',
    }[props.size]
});
</script>
<style scoped>
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

.nav{
    border: 1px solid transparent;
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