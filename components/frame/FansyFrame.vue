<template>
    <div :style="frameContainerStyle">
        <HexagonFrame
            :frame-border-gradient-enable="true"
            :frame-border-primary-color="liningColor"
            :frame-border-secondary-color="shadeColor"
            :content-background="shadeColor"
            :direction="'ltr'"
            :theme="themeType"
            :text-invert-by-theme-type="false"
            :head-percentage="50"
            :top-right="55"
            :bottom-left="30"
            :opaque="true"
            :header-fade="false">
            <template #header>
                <div class="h-full w-full">
                    <div class="absolute inset-x-0 -z-10 overflow-hidden -top-40 sm:-top-80 opacity-10 blur-3xl" aria-hidden="true">
                        <div class="top-fragment relative w-[36.125rem] sm:w-[72.1875rem] left-[calc(50%-11rem)] sm:left-[calc(50%-30rem)] aspect-[1155/678] -translate-x-1/2 rotate-[30deg] opacity-30"></div>
                    </div>

                    <div class="absolute inset-x-0 -z-10 overflow-hidden top-[calc(20%)] sm:top-[calc(0%)] blur-3xl" aria-hidden="true">
                        <div class="bottom-fragment relative w-[36.125rem] sm:w-[72.1875rem] left-[calc(50%+3rem)] sm:left-[calc(50%+36rem)] aspect-[1155/678]  -translate-x-1/2  opacity-30"></div>
                    </div>
                </div>
            </template>
            <template #body>
                <div :style="contentContainerStyle" class="h-full w-[100%] overflow-hidden relative flex flex-col">
                    <div ref="contentContainerRef">
                        <slot name="content"></slot>
                    </div>
                </div>
            </template>
        </HexagonFrame>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
const {$themeStore} = useNuxtApp();
const {
    type: themeType,
    tint: tintColor,
    lining: liningColor,
    shade: shadeColor,
    primary: primaryColor,
    secondary: secondaryColor,
} = storeToRefs($themeStore);

const { height: contentHeight } = useElementSize(useTemplateRef('contentContainerRef'));
const hexagonFrameInset = ref(7);
//Align with form filter padding of 20px
//HexagonFrame container inset of 7px + 1px border = 8px
//20px - 8px = 12px
const contentContainerXAxisPadding = ref(12);
//Sync Y-Axis padding with X-Axis padding to appear centered
const contentContainerYAxisPadding = ref(12);
const contentContainerStyle = computed(() => {
    return {
        'padding-left': `${contentContainerXAxisPadding.value}px`,
        'padding-right': `${contentContainerXAxisPadding.value}px`,
        'padding-top': `${contentContainerYAxisPadding.value}px`,
        'padding-bottom': `${contentContainerYAxisPadding.value}px`,
    };
})
//Sum all Y-Axis values to get total height of frame container
const frameContainerStyle = computed(() => {
    return {
        height: `${contentHeight.value + (hexagonFrameInset.value * 2) + (contentContainerYAxisPadding.value * 2)}px`
    }
});
</script>
<style lang="scss">
.top-fragment{
    background-image: linear-gradient(to right top, v-bind(shadeColor), v-bind(secondaryColor));
    clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%);
}

.bottom-fragment{
    background-image: linear-gradient(to right top, v-bind(shadeColor), v-bind(secondaryColor));
    clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%);
}
</style>