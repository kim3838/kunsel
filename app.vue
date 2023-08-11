<template>
    <div>
        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">

const { $debug, $moment, $coreStore, $formStore} = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();

// $debug('runtimeConfig',runtimeConfig);
// $debug('appConfig', appConfig);
// $debug('moment', $moment().format('YYYY-MM-DD'));
// $debug('lodash', _upperCase('lodash uppercase'));

// $coreStore.increment();
// console.log($coreStore.$state.counter);
// console.log($coreStore.doubleCounterPlusOne);

// const mountains = await $fetch('https://api.nuxtjs.dev/mountains').catch((error) => error.data)
</script>