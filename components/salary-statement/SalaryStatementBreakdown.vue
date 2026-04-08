<template>
    <div class="px-[20px]">
        <div v-if="salaryStatementPending || !salaryStatementSuccessful" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
            <UnorderedList v-if="salaryStatementPending" :icon="'eos-icons:loading'" :size="'md'" :label="'Loading payroll statement...'"/>
            <Label v-else-if="!salaryStatementSuccessful" invert :size="'md'" :type="'danger'" :label="salaryStatementMessage" />
        </div>
        <div v-else class="space-y-6">
            <div class="space-y-4">
                <div class="font-header">Payroll #: {{_get(payroll, 'number', 'Payroll number not found')}}</div>

                <PayrollSubInfo :payroll="payroll" :salaryStatement="salaryStatement"/>
            </div>

            <div class="space-y-2">

                <div class="font-header">Statement totals breakdown</div>

                <SalaryStatementDetailDataTable
                    :sub-row-slug="'component_values'"
                    :rows="salaryStatementDetails"
                ></SalaryStatementDetailDataTable>
            </div>

            <div class="space-y-2">

                <div class="font-header">Per-day breakdown</div>

                <div class="flex flex-col gap-2 text-sm">
                    <div class="flex flex-row flex-wrap items-center gap-2">
                        <div><span class="font-semibold">Dur.</span> = Duration in hours</div>
                        <div><span class="font-semibold">WH</span> = Work hour</div>
                        <div><span class="font-semibold">HRT</span> = Hourly rate type</div>
                        <div><span class="font-semibold">HR</span> = Hourly rate</div>
                        <div><span class="font-semibold">AP</span> = Actual present in minutes</div>
                        <div><span class="font-semibold">RP</span> = Regular pay</div>
                    </div>
                    <div class="flex flex-row flex-wrap items-center gap-2">
                        <div><span class="font-semibold">ALL</span> = Allowance</div>
                        <div><span class="font-semibold">NSDP</span> = Night diff. pay</div>
                        <div><span class="font-semibold">RDP</span> = Rest day pay</div>
                        <div><span class="font-semibold">LP</span> = Leave pay</div>
                        <div><span class="font-semibold">HP</span> = Holiday pay</div>
                        <div><span class="font-semibold">HPF</span> = Is holiday pay forfeited?</div>
                    </div>
                </div>

                <SalaryStatementAttendanceDataTable
                    :sub-row-slug="'pay_splits'"
                    :sub-row-extension-slug="'pay_item_totals'"
                    :rows="salaryStatementAttendances"
                ></SalaryStatementAttendanceDataTable>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import type {PayrollT, SalaryStatementT} from "@/public/js/types/payroll";

const salaryStatementUlid = defineModel('salaryStatementUlid', {type: String as PropType<string>, default: ''});
const payroll = defineModel('payroll', {type: Object as PropType<PayrollT>, default: () => {return {};}});
const salaryStatement = defineModel('salaryStatement', {type: Object as PropType<SalaryStatementT>, default: () => {return {};}});
const salaryStatementPending = defineModel('salaryStatementPending', {type: Boolean as PropType<boolean>, default: true});
const salaryStatementSuccessful = ref(true);
const salaryStatementMessage = ref('');

const salaryStatementAttendances = defineModel('salaryStatementAttendances', {type: Array as PropType<any[]>, default: () => {return [];}});
const salaryStatementDetails = defineModel('salaryStatementDetails', {type: Array as PropType<any[]>, default: () => {return [];}});

const salaryStatementFetchUrl = defineModel('salaryStatementFetchUrl', {type: String as PropType<string>, default: ''});
const salaryStatementParams = defineModel('salaryStatementParams', {type: Object as PropType<any>, default: () => {return {};}});
const fetchSalaryStatement = async () => {

    if(import.meta.server){return;}

    salaryStatementPending.value = true;

    await laraFetch(`${salaryStatementFetchUrl.value}${salaryStatementUlid.value}`, {
        method: 'GET',
        params: {
            ...salaryStatementParams.value
        }
    }, {
        onRequestError: () => {
            salaryStatementPending.value = false;
        },
        onResponse: (request, options, response) => {
            salaryStatementPending.value = false;
            salaryStatementSuccessful.value = _get(response, '_data.successful', false);
            salaryStatementMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            salaryStatement.value = _get(response, '_data.values.salary_statement', {}) as SalaryStatementT;
            payroll.value = _get(response, '_data.values.salary_statement.payroll', {} as PayrollT);

            salaryStatementAttendances.value = _get(response, '_data.values.salary_statement.statement_attendances', []);
            salaryStatementDetails.value = _get(response, '_data.values.salary_statement.statement_details', []);
        },
    }, false);
};

fetchSalaryStatement();
</script>

<style scoped>

</style>