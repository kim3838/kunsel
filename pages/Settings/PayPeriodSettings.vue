<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <DialogModal
                    :max-width="'410px'"
                    :show="showUpdatedPayPeriod"
                    :closeable="false">
                    <template #title>
                        Pay Period Updated
                    </template>
                    <template #content>
                        <div class="space-y-2">
                            <div>
                                <div>Days to pay after cut off</div>
                                <div class="text-sm font-sub-data">{{`${payPeriodSetting.days_to_pay_after_cut_off} days`}}</div>
                            </div>
                            <div>
                                <div>Pay Period Preset</div>
                                <div class="text-sm font-sub-data">{{payPeriodSetting.preset_name}}</div>
                            </div>
                            <div>
                                <div>Monthly Pay Period</div>
                                <table class="border-separate text-sm font-sub-data">
                                    <tbody>
                                    <tr v-for="(setting, key) in payPeriodSetting.monthly_pay_period">
                                        <td>{{ setting.label }}</td><td class="pl-1">{{ setting.readable }}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <div>Semimonthly Pay Period</div>
                                <table class="border-separate text-sm font-sub-data">
                                    <tbody>
                                    <tr v-for="(setting, key) in payPeriodSetting.semimonthly_pay_period">
                                        <td>{{ setting.label }}</td><td class="pl-1">{{ setting.readable }}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex space-x-2 justify-between">
                            <div class="space-x-2 inline-flex">

                            </div>
                            <div class="space-x-2 inline-flex items-center">
                                <Button  @click="showUpdatedPayPeriod = false" :label="'Okay'" />
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div v-if="!_isEmpty(payPeriodSetting)" class="p-[20px] space-y-4">
                    <div>
                        <div>Days to pay after cut off</div>
                        <div class="text-sm font-sub-data">{{`${payPeriodSetting.days_to_pay_after_cut_off} days`}}</div>
                    </div>

                    <div>
                        <InputLabel :size="'md'" value="Monthly and Semimonthly 2nd half Cut-off Presets" />
                        <div class="flex">
                            <SingleSelect
                                :width="'220px'"
                                :searchable="false"
                                drop-shadow
                                value-persist
                                :selection-max-viewable-line="6"
                                :size="'md'"
                                :label="'Select Cut-off Presets'"
                                :options="payPeriodPresetOptions"
                                @value-change="updatePayPeriods"/>
                        </div>
                    </div>

                    <div>
                        <div>Monthly Pay Period</div>
                        <table class="border-separate text-sm font-sub-data">
                            <tbody>
                            <tr v-for="(setting, key) in payPeriodSetting.monthly_pay_period">
                                <td>{{ setting.label }}</td><td class="pl-1">{{ setting.readable }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div><div>Semimonthly Pay Period</div>
                        <table class="border-separate text-sm font-sub-data">
                            <tbody>
                            <tr v-for="(setting, key) in payPeriodSetting.semimonthly_pay_period">
                                <td>{{ setting.label }}</td><td class="pl-1">{{ setting.readable }}</td>
                            </tr>
                            </tbody>
                        </table></div>
                    <div>
                        <Button
                            class="max-w-min"
                            :disabled="submitPending"
                            :icon="submitPending ? 'eos-icons:loading' : 'mdi:data'"
                            @click="submit"
                            :label="submitPending ? 'Updating...' : 'Update'"></Button>
                    </div>
                </div>
                <div v-else class="p-[20px]">
                    Pay period setting not found.
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {PayPeriodPresetSelectionT, PayPeriodSettingT} from "@/public/js/types/company-component";

definePageMeta({middleware: ['auth', 'company-admin']});
useLayout().setNavigationMode('solid', 'PayPeriodSetting.vue');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompany
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value){
        payPeriodSettingExecute();
    }
});

const payPeriodPresetOptions = reactive<{
    search: string,
    data: PayPeriodPresetSelectionT[],
    selection: PayPeriodPresetSelectionT[],
    selected: number | string | null
}>({
    search: '',
    data: [],
    selection: [],
    selected: null
});

const selectedPayPeriodPreset = computed(() => {
    return payPeriodPresetOptions.selection.find((payPeriodPresetOption) => {
        return payPeriodPresetOption.value == String(payPeriodPresetOptions.selected);
    });
});

const payPeriodPresetPending = ref(false)
const payPeriodPresetExecute = async () => {

    payPeriodPresetPending.value = true;

    await laraFetch(`/api/pay-period-preset-selections`, {
        method: 'GET',
    }, {
        onRequestError: () => {
            payPeriodPresetPending.value = false;
        },
        onResponse: () => {
            payPeriodPresetPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            const payPeriodPresetSelection = _get(response, '_data.values.selection', []);
            payPeriodPresetOptions.data = payPeriodPresetSelection;
            payPeriodPresetOptions.selection = payPeriodPresetSelection;
        }
    }, false);
}
await payPeriodPresetExecute();

const payPeriodSetting = ref<PayPeriodSettingT>({} as PayPeriodSettingT);

const payPeriodSettingPending = ref(false)
const payPeriodSettingExecute = async () => {

    if(!selectedAssociatedCompany.value){
        return;
    }

    payPeriodSetting.value = {} as PayPeriodSettingT;
    payPeriodSettingPending.value = true;

    await laraFetch(`/api/company-pay-period-setting/${selectedAssociatedCompany.value}`, {
        method: 'GET',
    }, {
        onRequestError: () => {
            payPeriodSettingPending.value = false;
        },
        onResponse: () => {
            payPeriodSettingPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            const payPeriodSettingResponse: PayPeriodSettingT = _get(response, '_data.values.pay_period_setting', {} as PayPeriodSettingT);
            const timePeriodPreset = _get(response, '_data.values.pay_period_setting.time_period_preset_reference', null);

            payPeriodSetting.value = payPeriodSettingResponse;
            payPeriodPresetOptions.selected = timePeriodPreset;

            if(selectedPayPeriodPreset.value){
                payPeriodSetting.value.preset_name = String(selectedPayPeriodPreset.value.text);
            }
        }
    }, false);
}
await payPeriodSettingExecute();

const updatePayPeriods = () => {

    if (!selectedPayPeriodPreset.value) {
        return;
    }

    payPeriodSetting.value.preset_name = String(selectedPayPeriodPreset.value.text);
    payPeriodSetting.value.time_period_preset_reference = selectedPayPeriodPreset.value.value;
    payPeriodSetting.value.monthly_pay_period = selectedPayPeriodPreset.value.monthly_period;
    payPeriodSetting.value.semimonthly_pay_period = selectedPayPeriodPreset.value.semimonthly_period;
};

const submitPending = ref(false);
const submit = async() => {

    if(!payPeriodSetting.value.id){
        return;
    }

    submitPending.value = true;

    await laraFetch(`/api/pay-period-setting/${payPeriodSetting.value.id}`, {
        method: 'PATCH',
        body: payPeriodSetting.value
    }, {
        onRequestError: () => {
            submitPending.value = false;
        },
        onResponse: () => {
            submitPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            const payPeriodSettingResponse: PayPeriodSettingT = _get(response, '_data.values.pay_period_setting', {} as PayPeriodSettingT);

            payPeriodSetting.value = Object.assign(
                payPeriodSetting.value, {
                    days_to_pay_after_cut_off: payPeriodSettingResponse.days_to_pay_after_cut_off,
                    time_period_preset_reference: payPeriodSettingResponse.time_period_preset_reference,
                    monthly_pay_period: payPeriodSettingResponse.monthly_pay_period,
                    semimonthly_pay_period: payPeriodSettingResponse.semimonthly_pay_period,
                }
            );

            showUpdatedPayPeriod.value = true;
        },
    });
}

const showUpdatedPayPeriod = ref(false);
</script>

<style scoped>

</style>