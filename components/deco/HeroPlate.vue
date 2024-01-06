<template>
    <div class="tw-relative tw-w-max">

        <div v-if="bookmark?.trim()" class="tw-relative tw-z-20 tw-w-full tw-flex tw-justify-end">
            <div class="bookmark tw-w-max tw-text-sm">
                {{bookmark}}
            </div>
        </div>

        <div class="border-fragment tw-relative tw-z-30 tw-w-max">
            <div class="base-fragment tw-w-max">
                <div :class="[textClass]" class="tw-px-1.5 tw-py-1.5 tw-text-transparent tw-bg-clip-text text-fragment">
                    {{label}}
                </div>
            </div>
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
        'sm': 'tw-text-lg tw-font-medium',
        'md': 'tw-text-xl tw-font-semibold',
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
const bookmarkText = computed(()=>{
    return {
        null: '#ffffff',
        'tulip': '#ffffff',
        'gold': '#ffffff',
        'strawberry': '#ffffff',
    }[props.theme];
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

<style scoped lang="scss">

.bookmark{
    padding-right: 0.3rem;
    padding-left: 0.4rem;
    background:v-bind(primaryColor);
    color: v-bind(bookmarkText);
    clip-path: polygon(0.4rem 0, 100% 0, 100% 100%, 0 100%, 0 0.4rem);
    margin-bottom: -1px;
    border-bottom: 1px solid transparent;
}

@for $i from 1 through 20 {
    .border-fragment:nth-child(#{$i}) {
        animation-delay: #{random(5) * 0.5}s !important;
    }
}

@keyframes shimmer-border {
    0% { border-image-source: linear-gradient(360deg,   v-bind(primaryColor),   transparent); }
    25% { border-image-source: linear-gradient(90deg,   v-bind(primaryColor),   transparent); }
    50% { border-image-source: linear-gradient(270deg,  v-bind(primaryColor),   transparent); }
    75% { border-image-source: linear-gradient(180deg,  v-bind(primaryColor),   transparent); }
    100% { border-image-source: linear-gradient(360deg, v-bind(primaryColor),   transparent); }
}

.border-fragment{
    box-sizing: border-box;
    border-image-slice: 1;
    border-width: 1px;
    border-image-source: linear-gradient(360deg, v-bind(primaryColor), transparent);
    animation: shimmer-border 3s ease-in infinite;
}
.base-fragment{
    background:
        linear-gradient(
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