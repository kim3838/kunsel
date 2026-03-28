<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <div class="flex px-[20px] pt-[20px] mb-2">
                    <NuxtLink
                        :to="`/hr-payroll/payroll/history`">
                        <Button class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'ic:sharp-keyboard-arrow-left'" :label="disableActions ? 'Please wait' : ''"></Button>
                    </NuxtLink>
                </div>

                <div class="px-[20px]">
                    <div v-if="payrollPending || !payrollSuccessful" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <UnorderedList v-if="payrollPending" :icon="'eos-icons:loading'" :size="'md'" :label="'Loading payroll...'"/>
                        <Label v-else-if="!payrollSuccessful" invert :size="'md'" :type="'danger'" :label="payrollMessage" />
                    </div>
                    <div v-else-if="payroll.id" class="lining-shadow rounded-sm tint-background">
                        <div class="p-4">
                            <PayrollSalaryStatements :key="payroll.id" v-model:payroll="payroll" />
                        </div>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">

import {storeToRefs} from "pinia";
import type {PayrollT} from "@/public/js/types/payroll";

useHead({titleTemplate: (titleChunk) => {return `Payroll`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');
const route = useRoute();
const {isAuthenticated} = useAuth();
const {$authStore, $associationStore, $moment} = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs($associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId,
    selectedAssociatedCompany
} = storeToRefs($authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        navigateTo("/hr-payroll/payroll/history", {replace: true});
    }
});

const payroll = ref<PayrollT>({} as PayrollT);
const payrollPending = ref(false);
const payrollSuccessful = ref(true);
const payrollMessage = ref('');

const salaryStatements = ref([]);

const fetchPayroll = async () => {

    if(import.meta.server){return;}

    payrollPending.value = true;

    await laraFetch(`/api/payroll/${route.params.id}`, {
        method: 'GET',
        params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value
        }
    }, {
        onRequestError: () => {
            payrollPending.value = false;
        },
        onResponse: (request, options, response) => {
            payrollPending.value = false;
            payrollSuccessful.value = _get(response, '_data.successful', false);
            payrollMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            payroll.value = _get(response, '_data.values.payroll', {}) as PayrollT;

            salaryStatements.value = _get(response, '_data.values.salary_statements', []);
        },
    }, false);
};

fetchPayroll();

const disableActions = computed(() => {
    return false;
});
</script>

<style scoped>

</style>