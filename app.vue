<template>
    <div>
        <div class="tw-font-sans tw-text-xl tw-text-gray-500">
            <span v-text="sansParagraph"></span>
        </div>
        <div class="tw-font-serif tw-text-xl tw-text-gray-500">
            <span v-text="serifParagraph"></span>
        </div>
        <div class="tw-font-mono tw-text-xl tw-text-gray-500">
            <span v-text="monoParagraph"></span>
        </div>

        <div class="tw-w-full tw-bg-gradient-to-r tw-from-transparent tw-via-gray-300 tw-from-transparent tw-my-1" style="height: 2px;"></div>

        <div class="tw-font-sans tw-text-base tw-text-gray-500">
            <span v-text="sansParagraph"></span>
        </div>
        <div class="tw-font-serif tw-text-base tw-text-gray-500">
            <span v-text="serifParagraph"></span>
        </div>
        <div class="tw-font-mono tw-text-base tw-text-gray-500">
            <span v-text="monoParagraph"></span>
        </div>

        <div class="tw-w-full tw-bg-gradient-to-r tw-from-transparent tw-via-gray-300 tw-from-transparent tw-my-1" style="height: 2px;"></div>

        <div class="tw-text-sm tw-text-gray-500" style="font-family: 'Gupter', 'sans-serif';">
            <span v-text="serifParagraph"></span>
        </div>

        <div class="tw-text-sm tw-text-gray-500" style="font-family: 'Kotta One', 'serif';">
            <span v-text="serifParagraph"></span>
        </div>
        {{useNuxtApp().$_.capitalize('hello world')}}
    </div>
</template>
<script setup lang="ts">
    const runtimeConfig = useRuntimeConfig();
    const appConfig = useAppConfig()
    console.log({runtimeConfig: runtimeConfig});
    console.log({appConfig: appConfig});

    let lodashValue = useNuxtApp().$_.capitalize('hello world');
    console.log(lodashValue);

    let sansParagraph: string = "Sans : The quick brown fox jumps over the lazy dog.";
    let serifParagraph: string = "Serif : The quick brown fox jumps over the lazy dog.";
    let monoParagraph: string = "Mono :The quick brown fox jumps over the lazy dog.";
</script>