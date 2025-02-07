<template>
    <!-- Nuxt Wrapper -->
    <div ref="nuxtWrapper" class="nuxt-page relative">
        <AppRenderingLoading/>
        <div v-if="false" class="absolute inset-x-0 -z-10 overflow-hidden -top-40 sm:-top-80 blur-3xl" aria-hidden="true">
            <div class="top-fragment relative w-[36.125rem] sm:w-[72.1875rem] left-[calc(50%-11rem)] sm:left-[calc(50%-30rem)] aspect-[1155/678] -translate-x-1/2 rotate-[30deg] opacity-30"></div>
        </div>
        <NuxtLoadingIndicator />
        <NuxtPage/>
        <div v-if="false" class="absolute inset-x-0 -z-10 overflow-hidden top-[calc(20%)] sm:top-[calc(0%)] blur-3xl" aria-hidden="true">
            <div class="bottom-fragment relative w-[36.125rem] sm:w-[72.1875rem] left-[calc(50%+3rem)] sm:left-[calc(50%+36rem)] aspect-[1155/678]  -translate-x-1/2  opacity-30"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia';

const {$debug, $moment, $themeStore, $coreStore} = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();

const {
    hexAlpha,
    primary: primaryColor,
    shade: shadeColor,
    accent: accentColor,
    lining: liningColor,
    thread: threadColor,
    tint: tintColor,
    text: textColor,
    neutral: neutralColor,
    textInvert: textInvertColor,
    textSecondary: textSecondaryColor,
} = storeToRefs($themeStore);

const threadColor10 = computed(() => {
    return threadColor.value + hexAlpha.value['10'];
});
const liningColor10 = computed(() => {
    return liningColor.value + hexAlpha.value['10'];
});
const liningColor70 = computed(() => {
    return liningColor.value + hexAlpha.value['70'];
});

//const nuxtWrapper = ref(null);
//const {x: nuxtWrapperXScroll,y: nuxtWrapperYScroll,arrivedState: nuxtWrapperArrivedState } = useScroll(nuxtWrapper)
//const {top: nuxtWrapperTopReached} = toRefs(nuxtWrapperArrivedState);

// $debug('runtimeConfig',runtimeConfig);
// $debug('appConfig', appConfig);
// $debug('NODE_ENV', process.env.NODE_ENV);
// $debug('themeStore', $themeStore['colors']['light']);
// $debug('moment', $moment().format('YYYY-MM-DD'));
// $debug('lodash', _upperCase('lodash uppercase'));

// const mountains = await $fetch('https://api.nuxtjs.dev/mountains').catch((error) => error.data)
</script>
<style>
::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}

::-webkit-scrollbar-track {
    background: v-bind(threadColor10);
    box-shadow: inset 0 0 4px v-bind(liningColor10);
}

::-webkit-scrollbar-thumb {
    background: v-bind(liningColor70);
}

::-webkit-scrollbar-thumb:hover {
    background: v-bind(liningColor);
}

.nuxt-page {
    color: v-bind(textColor);
}

.tint-background {
    background-color: v-bind(tintColor);
}

.neutral-border{
    border: 1px solid v-bind(neutralColor);
}

.neutral-border-top{
    border-top: 1px solid v-bind(neutralColor);
}

.lining-border{
    border: 1px solid v-bind(liningColor);
}

.thread-border{
    border: 1px solid v-bind(threadColor);
}

.scaffold{
    border: 1px solid v-bind(liningColor);
}

.top-fragment{
    background-image: linear-gradient(to right top, v-bind(shadeColor), v-bind(primaryColor));
    clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%);
}

.bottom-fragment{
    background-image: linear-gradient(to right top, v-bind(shadeColor), v-bind(primaryColor));
    clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%);
}

::placeholder { /* Firefox */
    color: v-bind(textColor) !important;
    opacity: 1;
}

::-ms-input-placeholder { /* Edge 12-18 */
    color: v-bind(textColor) !important;
}

.daterangepicker{
    border: 1px solid v-bind(liningColor);
    background-color: v-bind(tintColor);
}

.daterangepicker select.monthselect, .daterangepicker select.yearselect{
    background-color: v-bind(tintColor);
}

.daterangepicker .calendar-table {
    border-radius: 4px;
    background-color: v-bind(tintColor);
}

.daterangepicker td.off, .daterangepicker td.off.in-range, .daterangepicker td.off.start-date, .daterangepicker td.off.end-date {
    background-color: v-bind(tintColor);
    border-color: transparent;
    color: v-bind(textSecondaryColor);
}

.daterangepicker td.active,
.daterangepicker td.active:hover,
.daterangepicker td:not(.active):hover {
    background-color: v-bind(textColor);
    border-color: transparent;
    color: v-bind(textInvertColor);
}

.daterangepicker th.available:hover {
    background-color: v-bind(textColor);
    color: v-bind(textInvertColor);
}

.daterangepicker::before {
    border-bottom: 7px solid v-bind(liningColor);
}

.daterangepicker::after{
    border-bottom: 6px solid v-bind(tintColor);
}

.daterangepicker .calendar-table .next span, .daterangepicker .calendar-table .prev span {
    border: solid v-bind(accentColor);
    border-width: 0 2px 2px 0;
}

.daterangepicker select.monthselect, .daterangepicker select.yearselect {
    border: 1px solid v-bind(liningColor);
}

.daterangepicker select.hourselect, .daterangepicker select.minuteselect, .daterangepicker select.secondselect, .daterangepicker select.ampmselect {
    border: 1px solid v-bind(liningColor);
    background-color: v-bind(tintColor);
}
</style>