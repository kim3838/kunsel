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

const {
    navigationMode,
} = useLayout();

const navigationTextShadow = computed(()=>{
    if(navigationMode.value === 'clear'){
        return '1px 1px 2px #000000';
    }

    return 'none';
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
        'xs': 'tw-text-sm tw-font-medium',
        'sm': 'tw-text-base tw-font-medium',
        'md': 'tw-text-lg tw-font-medium',
        'lg': 'tw-text-xl tw-font-medium',
    }[props.size]
});
</script>
<style scoped>
.nav{
    border: 1px solid transparent;
}
</style>