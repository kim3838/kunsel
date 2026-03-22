<template>
    <NuxtLink
        :style="{'font-family': fontFamily}"
        class="relative" :class="[classes]">
        <slot></slot>
    </NuxtLink>
</template>

<script setup lang="ts">
const {
    navigationMode,
} = useLayout();

const {
    primaryColor, primaryColor90, primaryColor80,
    accentColor70,
    textInvertColor,
    activeClearFluidBackground
} = useCosmetic();

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

<style lang="scss" scoped>
.nav-active-bg{
    background-color: v-bind(accentColor70);
}
.nav-active-ripple{
    color: v-bind(textInvertColor) !important;
    @extend .text-shadow;
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
    @include fluid-gold-hover-before-effect();
    @include ripple-hover-after-effect();
}
.nav-link-clear-fluid:hover{
    position: relative;
    z-index: 1;
    color: v-bind(textInvertColor) !important;
    @extend .text-shadow;
    background: v-bind(activeClearFluidBackground);
    overflow: hidden;
}

.nav-active-clear-fluid{
    position: relative;
    z-index: 1;
    color: v-bind(textInvertColor) !important;
    @extend .text-shadow;
    background: v-bind(activeClearFluidBackground);
    overflow: hidden;
    @include fluid-gold-before();
    @include ripple($opacity: 0.2, $animate: true);
}
</style>