<template>
    <div class="nuxt-page">
        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>
        <div id="datetimepicker-slot"></div>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia';

const {$debug, $moment, $themeStore} = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();

const {
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

.scaffold{
    border: 1px solid v-bind(liningColor);
}

.daterangepicker{
    border: 1px solid v-bind(liningColor);
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

.daterangepicker td.active, .daterangepicker td.active:hover {
    background-color: v-bind(textColor);
    border-color: transparent;
    color: v-bind(textInvertColor);
}

.daterangepicker:before {
    border-bottom: 7px solid v-bind(liningColor);
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