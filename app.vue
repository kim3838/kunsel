<template>
    <div>
        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">

const { $debug, $moment, $coreStore, $formStore, $themeStore } = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();

// $debug('runtimeConfig',runtimeConfig);
// $debug('appConfig', appConfig);
// $debug('themeStore', $themeStore['colors']['light']);
// $debug('moment', $moment().format('YYYY-MM-DD'));
// $debug('lodash', _upperCase('lodash uppercase'));

// console.log({'layout': $coreStore.layout});
// console.log({'layout': $coreStore.service.error.title});

// const mountains = await $fetch('https://api.nuxtjs.dev/mountains').catch((error) => error.data)
</script>