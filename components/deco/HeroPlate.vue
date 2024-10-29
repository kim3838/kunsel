<template>
    <div class="tw-relative tw-w-max">

        <div v-if="bookmark?.trim()" class="tw-relative tw-z-20 tw-w-full tw-flex tw-justify-end tw-font-data">
            <div class="bookmark tw-w-max tw-text-sm tw-leading-4">
                {{bookmark}}
            </div>
        </div>

        <div class="border-fragment tw-relative tw-z-30 tw-w-max">
            <div class="base-fragment tw-w-max">
                <div :class="[textClass]" class="tw-px-1.5 tw-py-1 tw-text-transparent tw-bg-clip-text text-fragment">
                    {{label}}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {storeToRefs} from 'pinia';

const {$themeStore} = useNuxtApp();

const props = defineProps({
    label: {
        type: String,
        default: null,
    },
    bookmark: {
        type: String,
        default: null,
    },
    size: {
        type: String,
        default: 'md',
    },
    theme: {
        type: String,
        default: null,
    }
});

const textClass = computed(()=>{
    return {
        'sm': 'tw-text-xl tw-font-bold',
        'md': 'tw-text-2xl tw-font-bold',
        'lg': 'tw-text-3xl tw-font-bold',
    }[props.size];
})

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
        'emerald': '#058743',
    }[props.theme];
});
const primaryColor30 = computed(() => {
    let primaryColor = {
        null: '#525252',
        'tulip': palletes.value.tulip.primary,
        'gold': '#ffbf00',
        'strawberry': '#ffbbbb',
        'emerald': '#00d062',
    }[props.theme];

    return primaryColor + hexAlpha.value['30'];
});
const primaryColor50 = computed(() => {
    let primaryColor = {
        null: '#525252',
        'tulip': palletes.value.tulip.primary,
        'gold': '#ffbf00',
        'strawberry': '#ffe4e4',
        'emerald': '#00d062',
    }[props.theme];

    return primaryColor + hexAlpha.value['50'];
});
const primaryColor70 = computed(() => {
    let primaryColor = {
        null: '#525252',
        'tulip': palletes.value.tulip.primary,
        'gold': '#a67c00',
        'strawberry': '#ffe4e4',
        'emerald': '#009c4a',
    }[props.theme];

    return primaryColor + hexAlpha.value['70'];
});
const bookmarkText = computed(()=>{
    return {
        null: '#ffffff',
        'tulip': '#ffffff',
        'gold': '#ffffff',
        'strawberry': '#ffffff',
        'emerald': '#ffffff',
    }[props.theme];
});
const textPrimary = computed(()=>{
    return {
        null: '#ffffff',
        'tulip': '#ffffff',
        'gold': '#ffffff',
        'strawberry': '#ab3030',
        'emerald': '#ffffff',
    }[props.theme];
});
</script>

<style scoped lang="scss">

.bookmark{
    padding-right: 0.3rem;
    padding-left: 0.4rem;
    background:v-bind(primaryColor);
    color: v-bind(bookmarkText);
    clip-path: polygon(0.4rem 0, 100% 0, 100% 100%, 0 100%, 0 0.4rem);
    margin-bottom: -1px;
    border-bottom: 1px solid transparent;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.4);
}

.border-fragment{
    box-sizing: border-box;
    border-image-slice: 1;
    border-width: 1px;
    border-image-source: linear-gradient(180deg, v-bind(primaryColor), transparent);
}

.base-fragment{
    background:
        linear-gradient(
                to right,
                v-bind(primaryColor50) 0%,
                v-bind(primaryColor) 10%,
                v-bind(primaryColor70) 50%,
                v-bind(primaryColor) 90%,
                v-bind(primaryColor50) 100%
        );
}

.base-fragment::before{
    content: '';
    position: absolute;
    top:0;
    bottom: 0;
    left:0;
    right:0;
    width: 100%;
    height: 100%;
    opacity: 0.4;
    background-image: url('/images/deco/ripple_texture.png'), linear-gradient(to right, transparent, v-bind(primaryColor));
    background-size: cover;
}
.text-fragment{
    background: linear-gradient(
        to right,
        v-bind(textPrimary) 0%,
        v-bind(textPrimary) 50%,
        v-bind(textPrimary) 100%
    );
}
</style>