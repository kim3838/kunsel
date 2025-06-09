<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <div v-if="!_isEmpty(payPeriodSetting)" class="p-[20px]">
                    <div>Days to pay after cut off</div>
                    <div>{{`${payPeriodSetting.days_to_pay_after_cut_off} days`}}</div>
                    <br>
                    <div>Monthly Pay Period</div>
                    <table class="border-separate text-sm font-sub-data">
                        <tbody>
                        <tr v-for="(setting, key) in payPeriodSetting.monthly_pay_period">
                            <td>{{ setting.label }}</td><td class="pl-1">{{ setting.readable }}</td>
                        </tr>
                        </tbody>
                    </table>
                    <br>
                    <div>Semimonthly Pay Period</div>
                    <table class="border-separate text-sm font-sub-data">
                        <tbody>
                        <tr v-for="(setting, key) in payPeriodSetting.semimonthly_pay_period">
                            <td>{{ setting.label }}</td><td class="pl-1">{{ setting.readable }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else>
                    Pay period setting not found.
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";

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

const payPeriodSetting = ref({});

const payPeriodSettingPending = ref(false)
const payPeriodSettingExecute = async () => {

    payPeriodSetting.value = {};
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
            const payPeriodSettingResponse = _get(response, '_data.values.pay_period_setting', {});
            payPeriodSetting.value = payPeriodSettingResponse
        }
    }, false);
}
await payPeriodSettingExecute();


</script>

<style scoped>

</style>