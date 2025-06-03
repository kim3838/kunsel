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
                    <div class="h-full w-full bg-cover bg-center bg-no-repeat blur-sm grayscale opacity-50" :style="{'background':'url(/images/deco/fluid-gold-top.jpg)'}"/>
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