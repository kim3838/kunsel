<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <DialogModal
                    :max-width="'580px'"
                    :show="resolvedModal"
                    :closeable="false">
                    <template #title>
                        {{resolvedModalTitle}}
                    </template>
                    <template #content>

                        <div class="mt-4 space-y-2">

                            <fieldset class="neutral-border px-2 pb-2 space-y-4">
                                <legend class="font-semibold">Updated Pay Frequencies</legend>

                                <div v-for="resolved in resolvedFrequencies">
                                    <table v-if="resolved.type.value == PAY_FREQUENCY_TYPE.WEEKLY" class="border-separate font-data">
                                        <tbody>
                                            <tr><td class="font-semibold">Code</td><td class="pl-2">{{ _get(resolved, 'code', null) }}</td></tr>
                                            <tr><td class="font-semibold">Name</td><td class="pl-2">{{ _get(resolved, 'type.text', null) }}</td></tr>
                                            <tr><td class="font-semibold">Cut-off Type</td><td class="pl-2">{{ _get(resolved, 'cutoff_type.text', null) }}</td></tr>
                                            <tr><td class="font-semibold">Cut-off</td><td class="pl-2">{{ _get(resolved, 'cut_off_value.text', null) }}</td></tr>
                                            <tr><td class="font-semibold">Days Span</td><td class="pl-2">{{ _get(resolved, 'days_span', null) }}</td></tr>
                                        </tbody>
                                    </table>

                                    <div v-if="_some([PAY_FREQUENCY_TYPE.SEMI_MONTHLY, PAY_FREQUENCY_TYPE.MONTHLY],value => value == resolved.type.value)">
                                        <table class="border-separate font-data">
                                            <tbody>
                                                <tr><td class="font-semibold">Code</td><td class="pl-2">{{ _get(resolved, 'code', null) }}</td></tr>
                                                <tr><td class="font-semibold">Name</td><td class="pl-2">{{ _get(resolved, 'type.text', null) }}</td></tr>
                                                <tr><td class="font-semibold">Cut-off</td><td class="pl-2">{{ _get(resolved, 'period_preset_readable_name', null) }}</td></tr>
                                                <tr v-for="(setting, key) in resolved.period">
                                                    <td class="font-semibold">{{ setting.label }}</td><td class="pl-2">{{ setting.readable }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex space-x-2 justify-between">
                            <div></div>
                            <div class="space-x-2 inline-flex items-center">
                                <Button @click="resetResolvedModal" :label="'Okay'" />
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="space-y-2 p-[20px] flex flex-col gap-4">

                    <fieldset class="neutral-border px-2 pb-2 space-y-2">
                        <legend class="text-lg font-medium font-header">{{PAY_FREQUENCY_NAMES[dailyPayFrequenciesData.type]}}</legend>

                        <div>
                            <div class="text-base"><span class="font-semibold">Code: </span><span>{{dailyPayFrequenciesData?.code}}</span></div>
                        </div>

                    </fieldset>

                    <form @submit.prevent="weeklyPayFrequencyFormSubmit">
                        <fieldset class="neutral-border px-2 pb-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <legend class="text-lg font-medium font-header">{{PAY_FREQUENCY_NAMES[weeklyPayFrequenciesData.type]}}</legend>

                            <div>
                                <div class="text-base"><span class="font-semibold">Code: </span><span>{{weeklyPayFrequenciesData?.code}}</span></div>
                            </div>

                            <div class="md:col-span-3 space-y-2 ">
                                <div class="text-base flex flex-col justify-start">
                                    <div class="">Cut-off type: </div>
                                    <RadioGroup
                                        :disabled="weeklyPayFrequencyDisableActions"
                                        :selections="cutOffTypeSelection"
                                        :size="'md'"
                                        :orientation="'horizontal'"
                                        :radio-key="weeklyPayFrequenciesData.id + `-cut-off-type`"
                                        v-model="weeklyPayFrequenciesData.cutoff_type" />
                                </div>
                                <div class="text-base flex flex-col justify-start">
                                    <div class="">Cut-off: </div>
                                    <RadioGroup
                                        :disabled="weeklyPayFrequencyDisableActions"
                                        :selections="weekDaySelection"
                                        :size="'md'"
                                        :orientation="weekDayRadioGroupOrientation"
                                        :radio-key="weeklyPayFrequenciesData.id + `-cut-off-value`"
                                        v-model="weeklyPayFrequenciesData.cut_off_value" />
                                </div>
                                <div class="text-base flex flex-col justify-start">
                                    <div class="">Days Span: </div>
                                    <RadioGroup
                                        :disabled="weeklyPayFrequencyDisableActions"
                                        :selections="daysSpanSelection"
                                        :size="'md'"
                                        :orientation="'horizontal'"
                                        :radio-key="weeklyPayFrequenciesData.id + `-days-span`"
                                        v-model="weeklyPayFrequenciesData.days_span" />
                                </div>

                                <div>
                                    <Button
                                        type="submit"
                                        class="w-min"
                                        :disabled="weeklyPayFrequencyDisableActions"
                                        :icon="weeklyPayFrequencyDisableActions ? 'eos-icons:loading' : 'mdi:data'"
                                        :label="weeklyPayFrequencyFormSubmitLabel" />
                                </div>
                            </div>
                        </fieldset>
                    </form>

                    <form @submit.prevent="monthlySemimonthlyPayFrequencyFormSubmit">
                        <fieldset class="neutral-border px-2 pb-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <legend class="text-lg font-medium font-header">Monthly / Semimonthly</legend>
                            <div></div>
                            <div class="md:col-span-3">
                                <div class="text-base"><span>Cut-off: </span></div>

                                <RadioGroup
                                    :disabled="monthlySemimonthlyPayFrequencyDisableActions"
                                    :selections="timePeriodPresetSelection"
                                    :size="'md'"
                                    :orientation="monthlySemimonthlyCutoffRadioGroupOrientation"
                                    :radio-key="monthlyPayFrequenciesData.id + `-period-preset`"
                                    @change="monthlyTimePeriodChanged"
                                    v-model="monthlyPayFrequenciesData.time_period_preset_id" />
                            </div>

                            <div>
                                <div class="text-base"><span class="font-semibold">Code: </span><span>{{monthlyPayFrequenciesData?.code}}</span></div>
                                <div class="text-base font-semibold"><span>Monthly Period: </span></div>

                                <table class="border-separate mt-4">
                                    <tbody>
                                    <tr v-for="(setting, key) in monthlyPayFrequenciesData?.period">
                                        <td class="font-semibold">{{ setting.label }}</td><td class="pl-1">{{ setting.readable }}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="md:col-span-3">
                                <div class="text-base"><span class="font-semibold">Code: </span><span>{{semimonthlyPayFrequenciesData?.code}}</span></div>
                                <div class="text-base font-semibold"><span>Semimonthly Period: </span></div>

                                <table class="border-separate mt-4">
                                    <tbody>
                                    <tr v-for="(setting, key) in semimonthlyPayFrequenciesData?.period">
                                        <td class="font-semibold">{{ setting.label }}</td><td class="pl-1">{{ setting.readable }}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div>
                            </div>
                            <div class="md:col-span-3">
                                <Button
                                    type="submit"
                                    class="w-min"
                                    :disabled="monthlySemimonthlyPayFrequencyDisableActions"
                                    :icon="monthlySemimonthlyPayFrequencyDisableActions ? 'eos-icons:loading' : 'mdi:data'"
                                    :label="monthlySemimonthlyPayFrequencyFormSubmitLabel" />
                            </div>
                        </fieldset>
                    </form>
                </div>

                <div v-if="false">
                    <div><span class="font-semibold text-xs font-mono">dailyPayFrequenciesData: </span><div>{{dailyPayFrequenciesData}}</div></div>
                    <div><span class="font-semibold text-xs font-mono">weeklyPayFrequenciesData: </span><div>{{weeklyPayFrequenciesData}}</div></div>
                    <div><span class="font-semibold text-xs font-mono">monthlyPayFrequenciesData: </span><div>{{monthlyPayFrequenciesData}}</div></div>
                    <div><span class="font-semibold text-xs font-mono">semimonthlyPayFrequenciesData: </span><div>{{semimonthlyPayFrequenciesData}}</div></div>
                </div>

            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {TimePeriodPresetSelectionT} from "@/public/js/types/time";

definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {screenWidthBreakpoint, width: screenWidth} = useScreen();
const coreStore = useCoreStore();
const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompany
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompany.value){
        payFrequenciesExecute();
    }
});

const weekDayRadioGroupOrientation = computed(() => {
    return screenWidth.value >= screenWidthBreakpoint['lg'] ? 'horizontal' : 'vertical';
})

const monthlySemimonthlyCutoffRadioGroupOrientation = computed(() => {
    return screenWidth.value >= screenWidthBreakpoint['sm'] ? 'horizontal' : 'vertical';
})

const cutOffTypeSelection = ref([
    {text : 'Weekday', value: 0},
]);

const daysSpanSelection = ref([
    {text : '7 Days', value: 7},
    {text : '14 Days', value: 14},
]);

const timePeriodPresetSelection = ref<TimePeriodPresetSelectionT[]>([]);
const timePeriodPresetPending = ref(false)
const timePeriodPresetExecute = async () => {

    if(import.meta.server){return;}

    timePeriodPresetPending.value = true;

    await laraFetch(`/api/time-period-preset-selections`, {
        method: 'GET',
    }, {
        onRequestError: () => {
            timePeriodPresetPending.value = false;
        },
        onResponse: () => {
            timePeriodPresetPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            timePeriodPresetSelection.value = _get(response, '_data.values.selection', []);
        }
    }, false);
}
await timePeriodPresetExecute();

const monthlyTimePeriodChanged = () => {

    const selectedTimePeriodPreset: TimePeriodPresetSelectionT | undefined = timePeriodPresetSelection.value.find((timePeriodPresetOption) => {
        return timePeriodPresetOption.value == String(monthlyPayFrequenciesData.value.time_period_preset_id);
    });

    if(!selectedTimePeriodPreset){
        let message = 'Selected time period preset is not found. Please contact the administrator.';

        coreStore.setServiceError({
            prompt: true,
            payload: { message }
        });

       return;
    }

    //Update both monthly and semimonthly period
    monthlyPayFrequenciesData.value.period = selectedTimePeriodPreset['monthly_period'];

    semimonthlyPayFrequenciesData.value.time_period_preset_id = selectedTimePeriodPreset.value;
    semimonthlyPayFrequenciesData.value.period = selectedTimePeriodPreset['semimonthly_period'];
}

const weekDaySelection = reactive([
    {text : WEEK_DAY_NAMES[WEEK_DAY.SUNDAY], value: WEEK_DAY.SUNDAY},
    {text : WEEK_DAY_NAMES[WEEK_DAY.MONDAY], value: WEEK_DAY.MONDAY},
    {text : WEEK_DAY_NAMES[WEEK_DAY.TUESDAY], value: WEEK_DAY.TUESDAY},
    {text : WEEK_DAY_NAMES[WEEK_DAY.WEDNESDAY], value: WEEK_DAY.WEDNESDAY},
    {text : WEEK_DAY_NAMES[WEEK_DAY.THURSDAY], value: WEEK_DAY.THURSDAY},
    {text : WEEK_DAY_NAMES[WEEK_DAY.FRIDAY], value: WEEK_DAY.FRIDAY},
    {text : WEEK_DAY_NAMES[WEEK_DAY.SATURDAY], value: WEEK_DAY.SATURDAY},
]);

const payFrequenciesData = ref([]);
const dailyPayFrequenciesData = ref({});
const weeklyPayFrequenciesData = ref({});
const monthlyPayFrequenciesData = ref({});
const semimonthlyPayFrequenciesData = ref({});
const payFrequenciesPending = ref(false);
const payFrequenciesExecute = async () => {

    if(import.meta.server){return;}

    payFrequenciesPending.value = true;

    await laraFetch("/api/pay-frequencies", {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompany.value,
            }
        }
    },{
        onRequestError: () => {
            payFrequenciesPending.value = false;
        },
        onResponse: () => {
            payFrequenciesPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            payFrequenciesData.value = _get(response, '_data.values.pay_frequencies', []);

            dailyPayFrequenciesData.value = _find(payFrequenciesData.value, item => item.type == PAY_FREQUENCY_TYPE.DAILY);
            weeklyPayFrequenciesData.value = _find(payFrequenciesData.value, item => item.type == PAY_FREQUENCY_TYPE.WEEKLY);
            semimonthlyPayFrequenciesData.value = _find(payFrequenciesData.value, item => item.type == PAY_FREQUENCY_TYPE.SEMI_MONTHLY);
            monthlyPayFrequenciesData.value = _find(payFrequenciesData.value, item => item.type == PAY_FREQUENCY_TYPE.MONTHLY);
        }
    });
}
await payFrequenciesExecute();

const weeklyPayFrequencyFormPending = ref(false);
const weeklyPayFrequencyDisableActions = computed(() => {
    return weeklyPayFrequencyFormPending.value;
});
const weeklyPayFrequencyFormSubmitLabel = computed(() => {
    return weeklyPayFrequencyFormPending.value ? 'Saving...' : 'Save';
});
const weeklyPayFrequencyFormSubmit = async () => {
    weeklyPayFrequencyFormPending.value = true;

    await laraFetch(`/api/pay-frequency/${weeklyPayFrequenciesData.value.id}`, {
        method: 'PATCH',
        body: weeklyPayFrequenciesData.value,
    }, {
        onRequestError: () => {
            weeklyPayFrequencyFormPending.value = false;
        },
        onResponse: () => {
            weeklyPayFrequencyFormPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            const payFrequency = _get(response, '_data.values.pay_frequency', null);
            resolvedFrequencies.value = [payFrequency];
            resolvedModal.value = true;
        },
    });
};

const monthlySemimonthlyPayFrequencyFormPending = ref(false);
const monthlySemimonthlyPayFrequencyDisableActions = computed(() => {
    return monthlySemimonthlyPayFrequencyFormPending.value;
});
const monthlySemimonthlyPayFrequencyFormSubmitLabel = computed(() => {
    return monthlySemimonthlyPayFrequencyFormPending.value ? 'Saving...' : 'Save';
});
const monthlySemimonthlyPayFrequencyFormSubmit = async () => {
    monthlySemimonthlyPayFrequencyFormPending.value = true;
    let monthlyPayFrequency = null;
    let semimonthlyPayFrequency = null;

    await laraFetch(`/api/pay-frequency/${monthlyPayFrequenciesData.value.id}`, {
        method: 'PATCH',
        body: monthlyPayFrequenciesData.value,
    }, {
        onSuccessResponse: async (request, options, response) => {
            monthlyPayFrequency = _get(response, '_data.values.pay_frequency', null);
        },
    });

    await laraFetch(`/api/pay-frequency/${semimonthlyPayFrequenciesData.value.id}`, {
        method: 'PATCH',
        body: semimonthlyPayFrequenciesData.value,
    }, {
        onRequestError: () => {
            monthlySemimonthlyPayFrequencyFormPending.value = false;
        },
        onResponse: () => {
            monthlySemimonthlyPayFrequencyFormPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            semimonthlyPayFrequency = _get(response, '_data.values.pay_frequency', null);

            resolvedFrequencies.value = [monthlyPayFrequency, semimonthlyPayFrequency];
            resolvedModal.value = true;
        },
    });
};

const resolvedModal = ref(false);
const resolvedModalTitle = ref('Request Finished');
const resolvedFrequencies = ref([]);
const resetResolvedModal = () => {
    resolvedModal.value = false;
    resolvedFrequencies.value = [];
}
</script>

<style scoped>

</style>