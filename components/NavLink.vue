<template>
    <NuxtLink
        :to="to"
        :style="{'text-shadow': navigationTextShadow, 'font-family': fontFamily}"
        class="box-border inline-flex items-center px-2 focus:outline-none focus:ring-transparent focus:ring-1"
        :class="[classes, headerFontClass, 'nav-link']">
        <slot></slot>
    </NuxtLink>
</template>

<script setup>
const {
    navigationMode,
} = useLayout();

const navigationTextShadow = computed(()=>{
    if(navigationMode.value === 'clear-with-background'){
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
    fontFamily: {
        type: String,
        default: 'inherit'
    },
});

const classes = computed(() => {
    return props.active
        ? 'nav-active'
        : 'nav'
});

const headerFontClass = computed(() => {
    return {
        'xs': 'text-sm font-normal',
        'sm': 'text-base font-normal',
        'md': 'text-lg font-normal',
        'lg': 'text-xl font-normal',
    }[props.size]
});
</script>
<style scoped>
.nav{
    border: 1px solid transparent;
}
</style>