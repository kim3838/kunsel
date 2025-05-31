<template>
    <div
        ref="navHeader"
        tabindex="0"
        :style="{'text-shadow': navigationTextShadow, 'font-family': fontFamily}"
        :class="[classes]"
        class="nav relative inline-flex items-center h-full px-2 py-1 cursor-pointer focus:outline-none">
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
    accent: accentColor,
} = storeToRefs($themeStore);

const props = defineProps({
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
const accentColor40 = computed(() => {
    return accentColor.value + hexAlpha.value['40'];
});
const navigationLinkColor = computed(()=>{
    if(navigationMode.value == 'clear-with-background'){
        return '#ffffff';
    }

    return 'auto';
});

const { focused: navigationFocused } = useFocus(navHeader);

watch(navigationFocused, focused => {
    emit('updateSubNavigationOptions', props.dropOptions);
});

const classes = computed(() => {
    return props.active
        ? 'nav-active'
        : ''
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
.nav-active{
    background-color: v-bind(accentColor40);
}

.nav{
    color: v-bind(navigationLinkColor);
}
.nav:hover{
    background-color: v-bind(accentColor40);
}
</style>