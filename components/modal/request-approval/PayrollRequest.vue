<template>
    <div class="font-data">
        <div class="text-lg font-medium font-sans">
            {{requestNumber}}
        </div>
        <div class="text-base">
            Payroll request
        </div>
        <div class="text-sm subtitle-color">
            Submitted by: {{requestByUsername}} {{requestByEmployeeNumberComputed}} {{requestByEmployeeFullName}}
        </div>
        <div class="text-sm subtitle-color">
            Payroll number: {{payrollNumber}}
        </div>

        <fieldset class="mt-4 neutral-border px-2 pb-2 space-y-2">
            <legend class="text-lg font-header">Payroll</legend>

            <PayrollSubInfo
                v-if="payrollRequestPayload.id"
                :payroll="payroll"
                :type="PAYROLL_SUB_INFO_TYPE.ADMIN_OVERVIEW" />
        </fieldset>

        <fieldset v-if="statusSummary == REQUEST_APPROVAL_STATUS.APPROVED" class="mt-4 neutral-border px-2 pb-2 space-y-2">

        </fieldset>
    </div>
</template>

<script setup lang="ts">

import type {PayrollT} from "@/public/js/types/payroll";

const props = defineProps({
    payrollRequestPayload: {
        type: Object,
        default: () => {
            return {};
        }
    }
});

const payroll = ref<PayrollT>(props.payrollRequestPayload.payroll as PayrollT)

const requestNumber = ref('');
const requestByUsername = ref('');
const requestByEmployeeNumber = ref('');
const requestByEmployeeFullName = ref('');
const statusSummary = ref(REQUEST_APPROVAL_STATUS.NOT_SPECIFIED);

const remarks = ref('');

const payrollNumber = ref('');

requestNumber.value = _get(props.payrollRequestPayload, 'number', '');
requestByUsername.value = _get(props.payrollRequestPayload, 'requested_by.username', '');
requestByEmployeeNumber.value = _get(props.payrollRequestPayload, 'requested_by.company_employee_number', null);
const requestByEmployeeNumberComputed = computed(() => {
    return requestByEmployeeNumber.value ? `(${requestByEmployeeNumber.value})` : '';
})
requestByEmployeeFullName.value = _get(props.payrollRequestPayload, 'requested_by.company_employee_full_name', '');
statusSummary.value = _get(props.payrollRequestPayload, 'status_summary.value', REQUEST_APPROVAL_STATUS.NOT_SPECIFIED);

remarks.value = _get(props.payrollRequestPayload, 'remarks', '');

payrollNumber.value = _get(props.payrollRequestPayload, 'payroll.number', 'Payroll # not found');
</script>

<style scoped>

</style>