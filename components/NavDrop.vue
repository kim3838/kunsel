<template>
    <div
        ref="nav"
        tabindex="0"
        :style="{'text-shadow': navigationTextShadow}"
        :class="[classes, headerFontClass]"
        class="nav tw-px-4 tw-cursor-pointer focus:tw-outline-none focus:tw-ring-transparent focus:tw-ring-1">
        {{title}}
        <ClientOnly><Icon :name="navDropIcon"/></ClientOnly>
        <div
            v-if="activeComputed"
            :style="navDropOptionsStyleComputed"
            class="nav-drop-options-parent tw-transition-all tw-duration-700 tw-text-base tw-drop-shadow-2xl">
            <div v-for="dropOption in dropOptions" :key="dropOption.title" :style="{'text-shadow': navigationTextShadow}" class="nav-drop-link tw-cursor-pointer">

                <NuxtLink
                    v-if="dropOption.type === 'link'"
                    :to="dropOption.to"
                    class="tw-px-4 tw-py-1 tw-w-full tw-inline-flex tw-items-center">
                    <ClientOnly><Icon v-if="dropOption.icon" :name="dropOption.icon" class="tw-mr-1" /></ClientOnly><span>{{dropOption.title}}</span>
                </NuxtLink>

                <div v-if="dropOption.type === 'action'"
                     @click="typeof dropOption.callback == 'function' ? dropOption.callback() : false;"
                     class="tw-px-4 tw-py-1 tw-w-full tw-inline-flex tw-items-center">
                    <ClientOnly><Icon v-if="dropOption.icon" :name="dropOption.icon" class="tw-mr-1" /></ClientOnly><span>{{dropOption.title}}</span>
                </div>

                <NavDrop
                    class="tw-w-full"
                    v-if="dropOption.type === 'drop'"
                    :parent="false"
                    :size="'sm'"
                    :drop-justify="'right'"
                    :title="dropOption.title"
                    :drop-options="dropOption.options"
                />
            </div>
        </div>
    </div>
</template>
<script setup>
import {computed, ref} from "vue";
import {useFocusWithin} from '@vueuse/core';
import {storeToRefs} from 'pinia';

const {$coreStore, $themeStore} = useNuxtApp();
const nav = ref();
const {focused: navigationFocused} = useFocusWithin(nav);
const {
    hexAlpha,
    primary: primaryColor,
    accent: accentColor,
    neutral: neutralColor,
    tint: tintColor
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
const dropOptionsParentBackgroundColor = computed(()=>{
    if(navigationMode.value === 'clear'){
        return accentColor20.value;
    }

    return tintColor.value;
});
const dropOptionsParentBorderColor = computed(()=>{
    if(navigationMode.value === 'clear'){
        return accentColor20.value;
    }

    return neutralColor.value;
});
const navDropIcon = computed(()=>{
   return props.parent ? 'ic:baseline-arrow-drop-down' : 'ic:baseline-arrow-right';
});
const primaryColor50 = computed(() => {
    return primaryColor.value + hexAlpha.value['50'];
});
const accentColor20 = computed(() => {
    return accentColor.value + hexAlpha.value['20'];
});

const props = defineProps({
    dropOptions: {
        type: Array,
        default: []
    },
    title: {
        type: String,
        default: ''
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
    }
})

const activeComputed = computed(() => {
    return props.dropOptions.length && navigationFocused.value;
});
const navDropOptionsStyleComputed = computed(() => {

    let dropDirection = {
        'bottom': {
            'border-top-width': '1px',
            top: 'calc(100% + 1px)',
            [props.dropAlign]: 'calc(-1px)',
        },
        'right': {
            'border-top-width': '1px',
            top: '-1px',
            left: 'calc(100% + 1px)',
        },
        'left': {
            'border-top-width': '1px',
            top: '-1px',
            right: 'calc(100% + 1px)',
        },
    };

    return dropDirection[props.dropJustify]
});

const classes = computed(() => {
    return activeComputed.value
        ? 'nav-active'
        : ''
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
    background-color: v-bind(accentColor20);
    border: 1px solid v-bind(neutralColor);
    border-bottom-width: 0px;
}

.nav{
    color: v-bind(navigationLinkColor);
    position: relative;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    border: 1px solid transparent;
}
.nav:hover{
    background-color: v-bind(accentColor20);
}

.nav-drop-options-parent{
    position: absolute;
    border: 1px solid v-bind(dropOptionsParentBorderColor);
    min-width: calc(100% + 2px);
    width: max-content;
    background-color: v-bind(dropOptionsParentBackgroundColor);
}

.nav-drop-link{
    color: v-bind(navigationLinkColor);
}

.nav-drop-link:hover{
    background-color: v-bind(accentColor20);
}
</style>