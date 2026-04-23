<template>
    <!-- Nuxt Wrapper -->
    <div ref="nuxtWrapper" class="nuxt-page relative">
        <AppRenderingLoading/>
        <ClientOnly>
            <div v-if="!themeIsLightSlate" class="absolute inset-x-0 -z-10 overflow-hidden -top-40 sm:-top-80 blur-3xl" aria-hidden="true">
                <div class="t-f relative w-[36.125rem] sm:w-[72.1875rem] left-[calc(50%-11rem)] sm:left-[calc(50%-30rem)] aspect-[1155/678] -translate-x-1/2 rotate-[30deg]" :class="fragmentOpacityComputed.top"></div>
            </div>
        </ClientOnly>

        <NuxtLoadingIndicator />

        <NuxtPage/>

        <ClientOnly>
            <div v-if="!themeIsLightSlate" class="absolute inset-x-0 -z-10 overflow-hidden top-[calc(20%)] sm:top-[calc(0%)] blur-3xl" aria-hidden="true">
                <div class="b-f relative w-[36.125rem] sm:w-[72.1875rem] left-[calc(50%+3rem)] sm:left-[calc(50%+36rem)] aspect-[1155/678]  -translate-x-1/2" :class="fragmentOpacityComputed.bottom"></div>
            </div>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import type {CommonColorsT} from "@/stores/theme";
import {storeToRefs} from "pinia";

const clientReadyState = useClientReadyState();
const themeType = themeTypeState();
const {$layoutStore, $themeStore} = useNuxtApp();
const route = useRoute();
const {
    type: storeThemeType,
    appTheme: appTheme,
} = storeToRefs($themeStore);

const themeIsLightSlate = computed(() => {
    return appTheme.value === 'light-slate';
})

const fragmentOpacityComputed = computed(() => {

    if (storeThemeType.value === 'dark'){
        return {
            'top': 'opacity-40',
            'bottom' : 'opacity-60'
        }
    }

    return {
        'top': 'opacity-30',
        'bottom' : 'opacity-50'
    }
})

const {
    activeSubNavigationLink,
} = useLayout();

const {
    commonColor,

    accentColor, accentColor70,

    liningColor, liningColor70, liningColor10,
    threadColor, threadColor10,
    neutralColor,

    tintColor,
    shadeColor,

    textColor,
    subtitleColor,
    textInvertColor,
    textSecondaryColor,

    dateTimePickerColor,
    dateTimePickerButtonBackground
} = useCosmetic();

const typedCommonColor = commonColor as Ref<CommonColorsT>;
const defaultPrimaryColor = computed(() => {return typedCommonColor.value.default.primary;});
const successPrimaryColor = computed(() => {return typedCommonColor.value.success.primary;});
const dangerPrimaryColor = computed(() => {return typedCommonColor.value.danger.primary;});
const warningPrimaryColor = computed(() => {return typedCommonColor.value.warning.primary;});
const infoPrimaryColor = computed(() => {return typedCommonColor.value.info.primary;});

const lightTheme = computed(() => {
    return themeType.value === 'light';
});

//Text color for full page rendering mask overlay
const textColorComputed = computed(() => {

    if(!clientReadyState.value){
        return lightTheme.value ? '#555756' : '#fdfdfd';
    } else {
        return textColor.value;
    }
})

const subtitleColorComputed = computed(() => {

    if(!clientReadyState.value){
        return lightTheme.value ? '#555756' : '#fdfdfd';
    } else {
        return subtitleColor.value;
    }
})

watch(() => route.name,() => {
    $layoutStore.setSubNavigationOptions(_get(activeSubNavigationLink.value, 'options', []));
});

</script>
<style lang="scss">
:root {
    --scrollbar-width: 7px;
    --scrollbar-height: 5px;
}

@-moz-document url-prefix() {
    :root {
        --scrollbar-width: 12px;
    }
}

::-webkit-scrollbar {
    width: var(--scrollbar-width);
    height: var(--scrollbar-height);
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
    color: v-bind(textColorComputed);
}

.subtitle-color {
    color: v-bind(subtitleColorComputed);
}

.thread-vertical-divider{
    height: 1px;
    width: 100%;
    background: linear-gradient(
            to right,
            transparent 0%,
            v-bind(threadColor) 10%,
            v-bind(threadColor) 90%,
            transparent 100%
    );
}

.thread-horizontal-divider{
    height: 100%;
    width: 1px;
    background: linear-gradient(
            to bottom,
            transparent 0%,
            v-bind(threadColor) 35%,
            v-bind(threadColor) 65%,
            transparent 100%
    );
}

.tint-background {
    background-color: v-bind(tintColor);
}

.label-default {
    color: v-bind(defaultPrimaryColor);
}

.label-success {
    color: v-bind(successPrimaryColor);
}

.label-danger {
    color: v-bind(dangerPrimaryColor);
}

.label-warning {
    color: v-bind(warningPrimaryColor);
}

.label-info {
    color: v-bind(infoPrimaryColor);
}

.accent-hover:hover {
    background-color: v-bind(accentColor70);
}

.neutral-border{
    border: 1px solid v-bind(neutralColor);
}

.neutral-border-bottom{
    border-bottom: 1px solid v-bind(neutralColor);
}

.lining-border{
    border: 1px solid v-bind(liningColor);
}

.thread-border{
    border: 1px solid v-bind(threadColor);
}

.lining-shadow{
    box-shadow: 0 0 1.5px v-bind(liningColor);
}

.scaffold{
    border: 1px solid v-bind(liningColor);
}

.scaffold-border-left-right{
    border-left: 1px dashed v-bind(threadColor);
    border-right: 1px dashed v-bind(threadColor);
}
.scaffold-border-left-top-right{
    border-left: 1px dashed v-bind(threadColor);
    border-top: 1px dashed v-bind(threadColor);
    border-right: 1px dashed v-bind(threadColor);
}
.scaffold-border-left-bottom-right{
    border-left: 1px dashed v-bind(threadColor);
    border-bottom: 1px dashed v-bind(threadColor);
    border-right: 1px dashed v-bind(threadColor);
}
.scaffold-border-top-bottom{
    border-top: 1px dashed v-bind(threadColor);
    border-bottom: 1px dashed v-bind(threadColor);
}
.scaffold-border-top{
    border-top: 1px dashed v-bind(threadColor);
}
.scaffold-border-bottom{
    border-bottom: 1px dashed v-bind(threadColor);
}

.scaffold-border{
    border: 1px dashed v-bind(threadColor);
}

.t-f{
    background-image: linear-gradient(to right top, v-bind(shadeColor), v-bind(accentColor));
    clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%);
}

.b-f{
    background-image: linear-gradient(to right top, v-bind(shadeColor), v-bind(accentColor));
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
    border-color: transparent;
    position: relative;
    overflow: hidden;
    font-size: 1.5rem;

    color: v-bind(dateTimePickerColor) !important;
    @extend .text-shadow;
    background: v-bind(dateTimePickerButtonBackground);
}

.daterangepicker td.active:before,
.daterangepicker td.active:hover:before,
.daterangepicker td:not(.active):hover:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -65%;
    right: 0;
    width: 165%;
    background-image: url('/images/deco/fluid-gold-top.webp');
    filter: grayscale(100%);
    background-size: cover;
    opacity: 0.3;
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

.daterangepicker .calendar-table .next, .daterangepicker .calendar-table .prev{
    position: relative;
    font-size: 0.6rem !important;
}

.daterangepicker .calendar-table .next:hover, .daterangepicker .calendar-table .prev:hover{
    background: v-bind(accentColor) !important;
}

.daterangepicker .calendar-table .next span, .daterangepicker .calendar-table .prev span {
    border: solid v-bind(textColor);
    border-width: 0 2px 2px 0;
}

.daterangepicker select.monthselect, .daterangepicker select.yearselect {
    border: 1px solid v-bind(liningColor);
}

.daterangepicker select.hourselect, .daterangepicker select.minuteselect, .daterangepicker select.secondselect, .daterangepicker select.ampmselect {
    border: 1px solid v-bind(liningColor);
    background-color: v-bind(tintColor);
}

.daterangepicker .drp-buttons .btn {
    margin-left: 8px;
    font-size: 1rem;
    font-weight: 400;
    font-family: 'Reddit Sans Condensed', sans-serif;
    padding-left: 0.6rem;
    padding-right: 0.6rem;
    letter-spacing: 0.025rem;
    height: calc(0.25rem * 7);
    border-radius: 2px;
    cursor: pointer;

    position: relative;
    z-index: 1;
    color: v-bind(dateTimePickerColor) !important;
    @extend .text-shadow;
    background: v-bind(dateTimePickerButtonBackground);
    overflow: hidden;
    @include fluid-gold-hover-before-effect($left: -45%, $opacity: 0.3, $fluidGoldBeforeLeft: -10%, $fluidGoldBeforeOpacity: 0.3);
    @include ripple-hover-after-effect();
}
</style>