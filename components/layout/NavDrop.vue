<template>
    <div
        ref="navDrop"
        tabindex="0"
        :style="{'text-shadow': navigationTextShadow, 'font-family': fontFamily}"
        :class="[classes]"
        class="nav-drop relative inline-flex items-center h-full px-2 py-1 cursor-pointer focus:outline-none">
        <Icon v-if="icon" :class="[iconClass]" :name="icon" class="mr-1" />
        <span :class="[headerFontClass]">{{title}}</span>
        <Icon :class="[dropDownIconClass]" :name="navDropIcon"/>
        <div
            v-if="activeComputed"
            :style="navDropOptionsStyleComputed"
            :class="['nav-drop-options-parent', parent ? 'drop-shadow-sm mt-[7px]' : 'drop-shadow-none']">
            <div class="relative">
                <div v-if="parent" class="absolute border-solid options-arrow-lining-color" :style="[optionsArrowSlotClass]"></div>
                <div v-if="parent" class="absolute border-solid options-arrow-color" :style="[optionsArrowClass]"></div>
                <div v-for="dropOption in dropOptions" :key="dropOption.title" :style="{'text-shadow': navigationTextShadow}" class="nav-drop-link cursor-pointer">

                    <NuxtLink
                        v-if="dropOption.type === 'link'"
                        :to="dropOption.to"
                        class="px-2 py-1 w-full inline-flex items-center"
                        :class="[childNonDropFontClass]">
                        <Icon v-if="dropOption.icon" :class="[dropDownIconClass]" :name="dropOption.icon" class="mr-1" /><span>{{dropOption.title}}</span>
                    </NuxtLink>

                    <a v-if="dropOption.type == 'anchor-link'" :href="dropOption.to">
                        <NuxtLink
                            class="px-2 py-1 w-full inline-flex items-center"
                            :class="[childNonDropFontClass]">
                            <Icon v-if="dropOption.icon" :class="[dropDownIconClass]" :name="dropOption.icon" class="mr-1" /><span>{{dropOption.title}}</span>
                        </NuxtLink>
                    </a>

                    <div v-if="dropOption.type === 'action'"
                         @click="typeof dropOption.callback == 'function' ? dropOption.callback() : false;"
                         class="px-2 py-1 w-full inline-flex items-center"
                         :class="[childNonDropFontClass]">
                        <Icon v-if="dropOption.icon" :name="dropOption.icon" :class="[dropDownIconClass]" class="mr-1" /><span>{{dropOption.title}}</span>
                    </div>

                    <NavDrop
                        class="w-full"
                        v-if="_includes([ 'drop', 'sub-nav'], dropOption.type)"
                        :parent="false"
                        :size="childDropSize"
                        :drop-justify="'right'"
                        :title="dropOption.title"
                        :icon="dropOption.icon"
                        :drop-options="dropOption.options"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import {storeToRefs} from 'pinia';

const {$themeStore} = useNuxtApp();
const {
    navigationMode,
} = useLayout();
const {
    hexAlpha,
    accent: accentColor,
    lining: liningColor,
    neutral: neutralColor,
    tint: tintColor
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
    size: {
        default: 'md'
    },
    dropJustify: {
        default: 'bottom'
    },
    dropAlign: {
        default: 'left'
    },
    parent: {
        type: Boolean,
        default: true
    },
    fontFamily: {
        type: String,
        default: 'inherit'
    },
});

const navDrop = ref(null);

const navigationTextShadow = computed(()=>{
    if(navigationMode.value == 'clear-with-background'){
        return '1px 1px 2px #000000';
    }

    return 'none';
});

const navDropIcon = computed(()=>{
   return props.parent ? 'ic:baseline-arrow-drop-down' : 'ic:baseline-arrow-right';
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
const navDropOptionsParentBackgroundColor = computed(()=>{
    if(
        navigationMode.value == 'clear-with-background'
    ){
        return accentColor40.value;
    }

    return tintColor.value;
});
const navDropOptionsParentBorderColor = computed(()=>{
    if(
        navigationMode.value == 'clear-with-background'
    ){
        return accentColor40.value;
    }

    return liningColor.value;
});

const activeComputed = ref(false);
const navDropOptionsStyleComputed = computed(() => {

    let dropDirection = {
        'bottom': {
            top: 'calc(100% + 0px)',
            [props.dropAlign]: 'calc(0px)',
        },
        'right': {
            top: '0px',
            left: 'calc(100% + 0px)',
        },
        'left': {
            top: '0px',
            right: 'calc(100% + 0px)',
        },
    };

    return dropDirection[props.dropJustify]
});

const { focused: navigationFocused } = useFocus(navDrop);

const handleClickOutside = (event) => {
    if (navDrop.value && !navDrop.value.contains(event.target)) {
        activeComputed.value = false;
    }
};

onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside);
});

watch(navigationFocused, value => {
    if(value && props.dropOptions.length){
        activeComputed.value = true;
    }
});

const classes = computed(() => {
    return activeComputed.value
        ? 'nav-drop-active'
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
const childNonDropFontClass = computed(() => {
    return {
        'xs': 'text-sm',
        'sm': 'text-base',
        'md': 'text-lg',
        'lg': 'text-xl',
    }[props.size]
});
const childDropSize = computed(() => {
    return {
        'xs': 'xs',
        'sm': 'sm',
        'md': 'md',
        'lg': 'lg',
    }[props.size]
});
const optionsArrowSlotClass = computed(() => {
    return {
        [props.dropAlign]:'9px',
        'top': '-7px',
        'border-right': '7px solid transparent',
        'border-left': '7px solid transparent',
        'border-bottom': '7px'
    };
});

const optionsArrowClass = computed(() => {
    return {
        [props.dropAlign]:'10px',
        'top': '-6px',
        'border-right': '6px solid transparent',
        'border-left': '6px solid transparent',
        'border-bottom': '6px'
    }
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
.nav-drop-active{
    background-color: v-bind(accentColor40);
}

.nav-drop{
    color: v-bind(navigationLinkColor);
}
.nav-drop:hover{
    background-color: v-bind(accentColor40);
}

.nav-drop-options-parent{
    position: absolute;
    border: 1px solid v-bind(navDropOptionsParentBorderColor);
    min-width: calc(100% + 0px);
    width: max-content;
    background-color: v-bind(navDropOptionsParentBackgroundColor);
}

.nav-drop-link{
    color: v-bind(navigationLinkColor);
}

.nav-drop-link:hover{
    background-color: v-bind(accentColor40);
}
.options-arrow-lining-color{
    border-bottom-color: v-bind(navDropOptionsParentBorderColor) !important;
}

.options-arrow-color {
    border-bottom-color: v-bind(tintColor) !important;
}
</style>