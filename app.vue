<template>
    <div class="nuxt-page">
        <div class="tw-absolute tw-inset-x-0 tw--top-40 tw--z-10 tw-transform-gpu tw-overflow-hidden tw-blur-3xl sm:tw--top-80" aria-hidden="true">
            <div class="top-fragment tw-relative tw-left-[calc(50%-11rem)] tw-aspect-[1155/678] tw-w-[36.125rem] tw--translate-x-1/2 tw-rotate-[30deg] tw-opacity-30 sm:tw-left-[calc(50%-30rem)] sm:tw-w-[72.1875rem]"></div>
        </div>
        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>
        <div id="datetimepicker-slot"></div>
        <div class="tw-absolute tw-inset-x-0 tw-top-[calc(100%-13rem)] tw--z-10 tw-transform-gpu tw-overflow-hidden tw-blur-3xl sm:tw-top-[calc(100%-30rem)]" aria-hidden="true">
            <div class="bottom-fragment tw-relative tw-left-[calc(50%+3rem)] tw-aspect-[1155/678] tw-w-[36.125rem] tw--translate-x-1/2  tw-opacity-30 sm:tw-left-[calc(50%+36rem)] sm:tw-w-[72.1875rem]"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia';

const {$debug, $moment, $themeStore} = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();

const {
    primary: primaryColor,
    shade: shadeColor,
    accent: accentColor,
    lining: liningColor,
    tint: tintColor,
    text: textColor,
    textInvert: textInvertColor,
    textSecondary: textSecondaryColor,
} = storeToRefs($themeStore);

// $debug('runtimeConfig',runtimeConfig);
// $debug('appConfig', appConfig);
// $debug('themeStore', $themeStore['colors']['light']);
// $debug('moment', $moment().format('YYYY-MM-DD'));
// $debug('lodash', _upperCase('lodash uppercase'));
// console.log({'layout': $coreStore.layout});
// console.log({'layout': $coreStore.service.error.title});

// const mountains = await $fetch('https://api.nuxtjs.dev/mountains').catch((error) => error.data)
</script>
<style>
.nuxt-page {
    color: v-bind(textColor);
}

.top-fragment{
    background-image: linear-gradient(to right top, v-bind(shadeColor), v-bind(primaryColor));
    clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%);
}

.bottom-fragment{
    background-image: linear-gradient(to right top, v-bind(shadeColor), v-bind(primaryColor));
    clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%);
}

.scaffold{
    border: 1px solid v-bind(liningColor);
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