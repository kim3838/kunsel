<template>
    <div class="space-y-1">
        <table>
            <thead>
            <tr>
                <td class="p-[3px] font-semibold">Salary Rates</td>
                <td class="p-[3px]" v-for="(rateSetting) in rateSettings[0].value">
                    {{ rateSetting.label }}
                </td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(rateSetting) in rateSettings">
                <td class="p-[3px]">{{ rateSetting.label }}</td>
                <td class="p-[3px] text-sm" v-for="(rate) in rateSetting.value">
                    {{rate.readable}}
                </td>
            </tr>
            </tbody>
        </table>
        <FormulaSettingsSubrow :settings="nonRateSettings"/>
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
const isRateSetting = (setting) => {
    return ['regular_rates', 'night_differential_rates'].includes(setting.key);
};
const rateSettings = computed(() => {
    return props.settings.filter(setting => isRateSetting(setting));
});
const nonRateSettings = computed(() => {
    return props.settings.filter(setting => !isRateSetting(setting));
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