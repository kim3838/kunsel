<template>
    <div class="color-class">
        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>
        <div id="datetimepicker-slot"></div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const { $themeStore } = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();

let primary = ref($themeStore.primary);
let accent = ref($themeStore.accent);
let lining = ref($themeStore.lining);
let neutral = ref($themeStore.neutral);
let tint = ref($themeStore.tint);
let text = ref($themeStore.text);
let textInvert = ref($themeStore.textInvert);
let textSecondary = ref($themeStore.textSecondary);

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
.color-class {
    color: v-bind(text);
}

.daterangepicker{
    border: 1px solid v-bind(lining);
    background-color: v-bind(tint);
}

.daterangepicker .calendar-table {
    border-radius: 4px;
    background-color: v-bind(tint);
}

.daterangepicker td.off, .daterangepicker td.off.in-range, .daterangepicker td.off.start-date, .daterangepicker td.off.end-date {
    background-color: v-bind(tint);
    border-color: transparent;
    color: v-bind(textSecondary);
}

.daterangepicker td.active, .daterangepicker td.active:hover {
    background-color: v-bind(text);
    border-color: transparent;
    color: v-bind(textInvert);
}

.daterangepicker:before {
    border-bottom: 7px solid v-bind(lining);
}

.daterangepicker .calendar-table .next span, .daterangepicker .calendar-table .prev span {
    border: solid v-bind(accent);
    border-width: 0 2px 2px 0;
}

.daterangepicker select.monthselect, .daterangepicker select.yearselect {
    border: 1px solid v-bind(lining);
}

.daterangepicker select.hourselect, .daterangepicker select.minuteselect, .daterangepicker select.secondselect, .daterangepicker select.ampmselect {
    border: 1px solid v-bind(lining);
    background-color: v-bind(tint);
}
</style>