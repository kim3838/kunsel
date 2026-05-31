<template>
    <NuxtLink
        :to="to"
        :style="{'font-family': fontFamily}"
        class="relative box-border inline-flex items-center px-2 focus:outline-none rounded-[2px]"
        :class="[classes, headerFontClass]">
        <div class="bg-film"></div>
        <Icon class="flex-none mr-1" :class="[iconClass]" v-if="icon" :name="icon" />
        <slot></slot>
    </NuxtLink>
</template>

<script setup>
const {
    navigationMode,
} = useLayout();

const {
    appTheme,
    subtitleColor,
    primaryColor, primaryColor90, primaryColor80,
    textInvertColor,
    activeClearFluidBackground
} = useCosmetic();

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

    if(!props.active){
        return subtitleColor.value;
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

const classes = computed(() => {
    return props.active
        ? `nav-active-${props.activeStyle}`
        : 'nav-link-inactive'
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
<style lang="scss" scoped>
.bg-film{@extend .bg-film;}

.nav-link-inactive{
    position: relative;
    z-index: 1;
    color: v-bind(navigationLinkColor);
    overflow: hidden;
    @include fluid-gold-hover-before-effect($opacity: 0.4);
    @include ripple-hover-after-effect();
}

.nav-link-inactive:hover{
    color: v-bind(textInvertColor) !important;
    @extend .text-shadow;
}
.nav-link-inactive:hover .bg-film{
    background: v-bind(activeClearFluidBackground);
    animation: initialBackgroundKeyFrames 0ms linear 1 forwards;
}

.nav-active-bg{
    background-color: v-bind(accentColor70);
}

.nav-active-ripple{
    z-index: 1;
    color: v-bind(textInvertColor) !important;
    @extend .text-shadow;
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
    @extend .text-shadow;
    background: v-bind(activeClearFluidBackground);
    overflow: hidden;
    @include fluid-gold-before();
    @include ripple($opacity: 0.2, $animate: true);
}
</style>