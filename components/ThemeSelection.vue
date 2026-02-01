<template>
    <SingleSelect
        class="w-min"
        drop-shadow
        :searchable="false"
        :always-active="false"
        value-persist
        disable-header-border
        navigation-mode
        :summary-prefix="selectedSummaryPrefix"
        :icon="`solar:palette-bold-duotone`"
        :size="size"
        :label="'Select Theme'"
        :options="themeOption"
        :override="overrides"
        @valueChange="selectedThemeChanged"
    />
</template>

<script setup lang="ts">

import {storeToRefs} from "pinia";
import type {PaletteName} from "@/public/js/types/theme";

const {$themeStore} = useNuxtApp();

const {
    appTheme,
} = storeToRefs($themeStore);

const props = defineProps({
    size: {
        default: 'sm'
    },
    fontFamilyClass: {
        type: String,
        default: null
    },
    selectedSummaryPrefix: {
        type: String,
        default: 'Theme: '
    }
});

const {sessionDomain} = useRuntimeConfig().public;

const storedTheme = useCookie<PaletteName>($themeStore.SELECTED_THEME_STORAGE_KEY,{
    domain: sessionDomain,
    sameSite: 'lax',
});

const themeOption = reactive({
    search: '',
    selection: [{
        text: 'Light Slate',
        value: 'light-slate',
    },{
        text: 'Default Blue',
        value: 'default-blue',
    },{
        text: 'Light Green',
        value: 'light-green',
    },{
        text: 'Light Tulip',
        value: 'light-tulip',
    },{
        text: 'Dark Silver',
        value: 'dark-silver',
    },{
        text: 'Dark Emerald',
        value: 'dark-emerald',
    },],
    selected: appTheme.value
});

const overrides = computed(() => {
    return {
        'height': 'h-full',
        ...(props.fontFamilyClass ? {
            'font_family_class': props.fontFamilyClass
        } : {})
    };
})

const selectedThemeChanged = (value: PaletteName) => {
    $themeStore.setTheme(value);
    storedTheme.value = value;
}
</script>

<style scoped>

</style>