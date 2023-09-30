<template>
    <span
        @mouseenter="active = true"
        @mouseleave="active = false"
        tabindex="0"
        :class="[classes]"
        class="nav tw-px-4 tw-text-xl tw-font-medium focus:tw-outline-none focus:tw-ring-transparent focus:tw-ring-1">
        {{title}}
        <Icon name="ic:baseline-arrow-drop-down"/>
        <div v-if="activeComputed" class="nav-drop-options-parent tw-text-base tw-drop-shadow-2xl">
            <div v-for="link in links" :key="link" class="nav-drop-link tw-cursor-pointer">
                <NuxtLink v-if="link.to" :to="link.to" class="tw-px-4 tw-py-1 tw-w-full tw-inline-flex tw-items-center">
                    <Icon v-if="link.icon" :name="link.icon" class="tw-mr-1" /><span>{{link.label}}</span>
                </NuxtLink>
                <div @click="typeof link.callback == 'function' ? link.callback() : false;" v-else class="tw-px-4  tw-py-1 tw-w-full tw-inline-flex tw-items-center">
                    <Icon v-if="link.icon" :name="link.icon" class="tw-mr-1" /><span>{{link.label}}</span>
                </div>
            </div>
        </div>
    </span>
</template>
<script setup>
import {computed, ref} from "vue";
import {storeToRefs} from 'pinia';
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    primary: primaryColor,
    accent: accentColor,
    neutral: neutralColor,
    tint: tintColor
} = storeToRefs($themeStore);

const primaryColor50 = computed(() => {
    return primaryColor.value + hexAlpha.value['50'];
});
const accentColor10 = computed(() => {
    return accentColor.value + hexAlpha.value['10'];
});

const props = defineProps({
    links: {
        type: Array,
        default: []
    },
    title: {
        type: String,
        default: ''
    }
})

const active = ref(false);
const activeComputed = computed(() =>{
    return props.links.length && active.value;
});

const classes = computed(() => {
    return activeComputed.value
        ? 'nav-active'
        : ''
});
</script>
<style scoped>
.nav-active{
    background-color: v-bind(accentColor10);
    border: 1px solid v-bind(neutralColor);
    border-bottom-width: 0px;
}

.nav{
    position: relative;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
}

.nav-drop-options-parent{
    position: absolute;
    border: 1px solid v-bind(neutralColor);
    border-top-width: 0px;
    top: 100%;
    left: calc(-1px);
    min-width: calc(100% + 2px);
    width: max-content;
    background-color: v-bind(tintColor);
}

.nav-drop-link:hover{
    background-color: v-bind(accentColor10);
}
</style>