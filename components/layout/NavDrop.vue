<template>
    <div
        ref="navDrop"
        tabindex="0"
        :style="{'text-shadow': navigationTextShadow, 'font-family': fontFamily}"
        :class="[classes]"
        class="nav-drop px-2 py-1 cursor-pointer focus:outline-none focus:ring-transparent focus:ring-1">
        <Icon v-if="icon" :name="icon" class="mr-1" />
        <span :class="[headerFontClass]">{{title}}</span>
        <Icon :name="navDropIcon"/>
        <div
            v-if="activeComputed"
            :style="navDropOptionsStyleComputed"
            :class="['nav-drop-options-parent', parent ? 'drop-shadow-lg' : 'drop-shadow-none']">
            <div v-for="dropOption in dropOptions" :key="dropOption.title" :style="{'text-shadow': navigationTextShadow}" class="nav-drop-link cursor-pointer">

                <NuxtLink
                    v-if="dropOption.type === 'link'"
                    :to="dropOption.to"
                    class="px-2 py-1 w-full inline-flex items-center"
                    :class="[childNonDropFontClass]">
                    <Icon v-if="dropOption.icon" :name="dropOption.icon" class="mr-1" /><span>{{dropOption.title}}</span>
                </NuxtLink>

                <a v-if="dropOption.type == 'anchor-link'" :href="dropOption.to">
                    <NuxtLink
                        class="px-2 py-1 w-full inline-flex items-center"
                        :class="[childNonDropFontClass]">
                        <Icon v-if="dropOption.icon" :name="dropOption.icon" class="mr-1" /><span>{{dropOption.title}}</span>
                    </NuxtLink>
                </a>

                <div v-if="dropOption.type === 'action'"
                     @click="typeof dropOption.callback == 'function' ? dropOption.callback() : false;"
                     class="px-2 py-1 w-full inline-flex items-center"
                    :class="[childNonDropFontClass]">
                    <Icon v-if="dropOption.icon" :name="dropOption.icon" class="mr-1" /><span>{{dropOption.title}}</span>
                </div>

                <NavDrop
                    class="w-full"
                    v-if="dropOption.type === 'drop'"
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
const accentColor20 = computed(() => {
    return accentColor.value + hexAlpha.value['20'];
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
        return accentColor20.value;
    }

    return tintColor.value;
});
const navDropOptionsParentBorderColor = computed(()=>{
    if(
        navigationMode.value == 'clear-with-background'
    ){
        return accentColor20.value;
    }

    return neutralColor.value;
});

const activeComputed = ref(false);
const navDropOptionsStyleComputed = computed(() => {

    let dropDirection = {
        'bottom': {
            top: 'calc(100% + 0px)',
            [props.dropAlign]: 'calc(0px)',
        },
        'right': {
            top: '-1px',
            left: 'calc(100% + 0px)',
        },
        'left': {
            top: '-1px',
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
        'xs': 'text-sm font-normal',
        'sm': 'text-base font-normal',
        'md': 'text-lg font-medium',
        'lg': 'text-xl font-medium',
    }[props.size]
});
const childNonDropFontClass = computed(() => {
    return {
        'xs': 'text-sm font-normal',
        'sm': 'text-base font-normal',
        'md': 'text-lg font-medium',
        'lg': 'text-xl font-medium',
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
</script>
<style scoped>
.nav-drop-active{
    background-color: v-bind(accentColor20);
}

.nav-drop{
    color: v-bind(navigationLinkColor);
    position: relative;
    display: inline-flex;
    align-items: center;
}
.nav-drop:hover{
    background-color: v-bind(accentColor20);
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
    background-color: v-bind(accentColor20);
}
</style>