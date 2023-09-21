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

let color = ref($themeStore.colorComputed);
let background = ref($themeStore.backgroundComputed);
let accent = ref($themeStore.accentComputed);
let light = ref($themeStore.lightComputed);
let lighter = ref($themeStore.lighterComputed);
// let backgroundColor = palletes['background'];
// $debug('backgroundColor', backgroundColor);
// let color = ref($themeStore.colors[theme.value][$themeStore.blueprint.color]);
// $debug('color', color.value);
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
    color: v-bind(color);
}

.daterangepicker{
    border: 1px solid v-bind(lighter);
    background-color: v-bind(background);
}

.daterangepicker .calendar-table {
    border-radius: 4px;
    background-color: v-bind(background);
}

.daterangepicker td.off, .daterangepicker td.off.in-range, .daterangepicker td.off.start-date, .daterangepicker td.off.end-date {
    background-color: v-bind(background);
    border-color: transparent;
    color: v-bind(light);
}

.daterangepicker td.active, .daterangepicker td.active:hover {
    background-color: v-bind(accent);
    border-color: transparent;
    color: #fff;
}

.daterangepicker:before {
    border-bottom: 7px solid v-bind(lighter);
}

.daterangepicker .calendar-table .next span, .daterangepicker .calendar-table .prev span {
    border: solid v-bind(accent);
    border-width: 0 2px 2px 0;
}

.daterangepicker select.monthselect, .daterangepicker select.yearselect {
    border: 1px solid v-bind(lighter);
}

.daterangepicker select.hourselect, .daterangepicker select.minuteselect, .daterangepicker select.secondselect, .daterangepicker select.ampmselect {
    border: 1px solid v-bind(lighter);
    background-color: v-bind(background);
}
</style>