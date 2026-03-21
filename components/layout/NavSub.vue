<template>
    <div
        ref="navHeader"
        tabindex="0"
        :style="{'font-family': fontFamily}"
        :class="[classes]"
        class="nav-sub relative inline-flex items-center h-full px-2 py-1 cursor-pointer focus:outline-none rounded-[2px]">
        <Icon v-if="icon" :name="icon" :class="[iconClass]" class="mr-1" />
        <span :class="[headerFontClass]">{{title}}</span>
        <Icon class="flex-none" :class="[dropDownIconClass]" :name="navHeaderIcon"/>
    </div>
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
    lining: liningColor,
    textInvert: textInvertColor
} = storeToRefs($themeStore);

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

const props = defineProps({
    dropAlign: {
        default: 'left'
    },
    dropOptions: {
        type: Array,
        default: []
    },
    title: {
        type: String,
        default: ''
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
        default: 'dashed',
    },
    size: {
        default: 'md'
    },
    fontFamily: {
        type: String,
        default: 'inherit'
    },
});

const emit = defineEmits(['updateSubNavigationOptions']);

const navHeader = ref(null);

const navigationTextShadow = computed(()=>{
    if(navigationMode.value == 'clear-with-background'){
        return '1px 1px 2px #000000';
    }

    return 'none';
});

const navHeaderIcon = computed(()=>{
    return 'ic:baseline-arrow-drop-down';
});
const navigationLinkColor = computed(()=>{
    if(navigationMode.value == 'clear-with-background'){
        return '#ffffff';
    }

    return 'auto';
});

const { focused: navigationFocused } = useFocus(navHeader);

watch(navigationFocused, focused => {
    emit('updateSubNavigationOptions', {
        drop_align: props.dropAlign,
        options: props.dropOptions,
    });
});

const classes = computed(() => {
    return props.active
        ? `nav-sub-active-${props.activeStyle}`
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

const dropDownIconClass = computed(() => {
    return {
        '2xs': 'h-4 w-4',
        'xs': 'h-5 w-5',
        'sm': 'h-5 w-5',
        'md': 'h-5 w-5',
        'lg': 'h-6 w-6'
    }[props.size];
});
</script>
<style scoped>
.nav-sub{
    color: v-bind(navigationLinkColor);
}

.nav-sub:hover{
    position: relative;
    z-index: 1;
    color: v-bind(textInvertColor) !important;
    text-shadow: rgba(0, 0, 0, 1) 0 1px 2px;
    background: linear-gradient(to right, v-bind(primaryColor70) 20%, v-bind(accentColor) 60%, v-bind(accentColor) 75%, v-bind(primaryColor60) 100%);
    overflow: hidden;
}
.nav-sub:hover::before{
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

.nav-sub-active-dashed{
    border: 1px dashed v-bind(liningColor);
}
.nav-sub-active-clear-fluid{
    position: relative;
    z-index: 1;
    color: v-bind(textInvertColor) !important;
    text-shadow: rgba(0, 0, 0, 1) 0 1px 2px;
    background: linear-gradient(to right, v-bind(primaryColor70) 20%, v-bind(accentColor) 60%, v-bind(accentColor) 75%, v-bind(primaryColor60) 100%);
    overflow: hidden;
}
.nav-sub-active-clear-fluid::before{
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