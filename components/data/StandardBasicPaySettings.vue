<template>
    <div class="space-y-4">
        <FormulaSettingsCaster :settings="descriptions"/>
        <table v-if="rateSettings.length > 0">
            <thead>
            <tr>
                <td class="p-[3px] font-semibold">Basic Pay Rates</td>
                <td class="p-[3px]" v-for="(rateSetting) in rateSettings[0].value">
                    {{ rateSetting.label }}
                </td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(rateSetting) in rateSettings">
                <td class="p-[3px]">{{ rateSetting.label }}</td>
                <td class="p-[3px]" v-for="(rate) in rateSetting.value">
                    {{ rate.readable }}
                </td>
            </tr>
            </tbody>
        </table>
        <FormulaSettingsCaster :settings="nonRateSettings"/>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";

const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    lining: liningColor,
} = storeToRefs($themeStore);

const liningColor70 = computed(() => {
    return liningColor.value + hexAlpha.value['70'];
});

const props = defineProps({
    settings: {
        type: Array,
        default: () => [],
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});
const isDescription = (setting) => {
    return ['description'].includes(setting.key);
};
const isRateSetting = (setting) => {
    return ['regular_rates', 'night_differential_rates'].includes(setting.key);
};
const descriptions = computed(() => {
    if(!props.settings){
        return [];
    }

    return props.settings.filter(setting => isDescription(setting));
});
const rateSettings = computed(() => {
    if(!props.settings){
        return [];
    }

    return props.settings.filter(setting => isRateSetting(setting) && !isDescription(setting));
});
const nonRateSettings = computed(() => {
    if(!props.settings){
        return [];
    }

    return props.settings.filter(setting => !isRateSetting(setting) && !isDescription(setting));
});
</script>

<style scoped>
table{
    white-space: nowrap;
    border: 0;
}

table thead tr td,tbody tr td {
    border: 1px dashed v-bind(liningColor70);
}

</style>