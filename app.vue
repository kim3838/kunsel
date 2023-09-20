<template>
    <div class="color-class">
        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const { $themeStore } = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();

let color = ref($themeStore.colorComputed);
let background = ref($themeStore.backgroundComputed);

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
<style scoped>
.color-class {
    color: v-bind(color);
}
</style>