<template>
    <div>
        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">

const { $debug, $moment} = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();

$debug('runtimeConfig',runtimeConfig);
$debug('appConfig', appConfig);
$debug('moment', $moment().format('YYYY-MM-DD'));
$debug('lodash', _upperCase('lodash uppercase'));

// const mountains = await $fetch('https://api.nuxtjs.dev/mountains').catch((error) => error.data)
</script>