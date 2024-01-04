<template>
    <div class="base-fragment tw-w-max">
        <div class="tw-px-1 tw-text-3xl tw-font-bold tw-text-transparent tw-bg-clip-text text-fragment">
            {{label}}
        </div>
    </div>
</template>

<script setup>
import {storeToRefs} from 'pinia';
import {computed} from "vue";

const {$themeStore} = useNuxtApp();

const props = defineProps({
    label: {
        type: String,
        default: null,
    },
    theme: {
        type: String,
        default: null,
    }
});

const {
    hexAlpha,
    palletes,
    textInvert: textInvertColor,
} = storeToRefs($themeStore);

const primaryColor = computed(() => {
    return {
        null: '#525252',
        'tulip': palletes.value.tulip.primary,
        'gold': '#a67c00',
        'strawberry': '#ffbbbb',
    }[props.theme];
});
const primaryColor30 = computed(() => {
    let primaryColor = {
        null: '#525252',
        'tulip': palletes.value.tulip.primary,
        'gold': '#ffbf00',
        'strawberry': '#ffbbbb',
    }[props.theme];

    return primaryColor + hexAlpha.value['30'];
});
const primaryColor50 = computed(() => {
    let primaryColor = {
        null: '#525252',
        'tulip': palletes.value.tulip.primary,
        'gold': '#ffbf00',
        'strawberry': '#ffe4e4',
    }[props.theme];

    return primaryColor + hexAlpha.value['50'];
});
const primaryColor70 = computed(() => {
    let primaryColor = {
        null: '#525252',
        'tulip': palletes.value.tulip.primary,
        'gold': '#a67c00',
        'strawberry': '#ffe4e4',
    }[props.theme];

    return primaryColor + hexAlpha.value['70'];
});
const textPrimary = computed(()=>{
    return {
        null: '#ffffff',
        'tulip': '#ffffff',
        'gold': '#ffffff',
        'strawberry': '#ab3030',
    }[props.theme];
});
const textAccent = computed(()=>{
    return {
        null: '#c0c0c0',
        'tulip': '#ffdab9',
        'gold': '#ffefc8',
        'strawberry': '#af4949',
    }[props.theme];
});
</script>

<style>
.base-fragment{
    background: linear-gradient(
        to right,
        v-bind(primaryColor30) 0%,
        v-bind(primaryColor70) 10%,
        v-bind(primaryColor50) 50%,
        v-bind(primaryColor) 90%,
        v-bind(primaryColor30) 100%
    );
}
.text-fragment{
    background: linear-gradient(
        to right,
        v-bind(textPrimary) 0%,
        v-bind(textAccent) 50%,
        v-bind(textPrimary) 100%
    );
}
</style>