<template>
    <div>
        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">

const { $debug, $moment, $storeCore, $formStore} = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();

$debug('runtimeConfig',runtimeConfig);
$debug('appConfig', appConfig);
$debug('moment', $moment().format('YYYY-MM-DD'));
$debug('lodash', _upperCase('lodash uppercase'));

$storeCore.increment();
console.log($storeCore.$state.counter);
console.log($storeCore.doubleCounterPlusOne);

console.log($formStore.formCounter);
$formStore.formIncrement();
console.log($formStore.formCounter);

// const mountains = await $fetch('https://api.nuxtjs.dev/mountains').catch((error) => error.data)
</script>