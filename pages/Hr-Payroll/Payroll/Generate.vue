<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <div class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <form @submit.prevent="payrollInquiriesExecute">

                        <div class="flex flex-row flex-wrap items-center gap-2">
                            <div class="flex flex-col">
                                <InputLabel :size="'sm'" value="Pay frequency" />
                                <div class="grow">
                                    <RadioGroup
                                        :disabled="disableActions"
                                        class="scaffold-border px-2"
                                        :selections="payFrequencyOptions"
                                        :size="'md'"
                                        :orientation="'horizontal'"
                                        :radio-key="`pay_frequency_options`"
                                        v-model="payFrequency" />
                                </div>
                            </div>
                            <div>
                                <InputLabel :size="'sm'" value="Recent payrolls" />
                                <Input :type="'number'" high-light-all-text-on-focus type-strict v-model="recentCount" :size="'md'" />
                            </div>
                            <div class="flex flex-col">
                                <div class="flex-none h-[1.25rem]"></div>
                                <div class="grow">
                                    <Button
                                        class="w-min"
                                        :variant="'flat'"
                                        ref="submitButton"
                                        type="submit"
                                        :disabled="disableActions"
                                        :size="'md'"
                                        :icon="disableActions ? 'eos-icons:loading' : ''"
                                        :label="disableActions ? 'Loading' : 'Load periods'"/>
                                </div>
                            </div>
                        </div>
                        <div v-if="false" class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                            <div>
                                <InputLabel :size="'sm'" value="Filter employees by group" />
                                <MultiSelect
                                    :key="employeeGroupOptionsKey"
                                    drop-shadow
                                    :selection-max-viewable-line="15"
                                    :size="'md'"
                                    :options="employeeGroupOptions"
                                    :disabled="disableActions"
                                    :icon="'tdesign:component-checkbox'"/>
                            </div>
                            <div class="flex flex-col">
                                <div class="flex-none h-[1.25rem]"></div>
                                <div class="grow">
                                    <Button
                                        class="w-min"
                                        :variant="'outline'"
                                        ref="submitButton"
                                        type="submit"
                                        :disabled="disableActions"
                                        :size="'md'"
                                        :icon="disableActions ? 'eos-icons:loading' : ''"
                                        :label="'Generate payroll'"/>
                                </div>
                            </div>
                        </div>
                    </form>

                    <DialogModal
                        :show="generatingPayroll"
                        :closeable="false">
                        <template #title>

                        </template>
                        <template #content>
                            <div class="pt-2 flex flex-row gap-4">

                                <div class="lining-shadow rounded-sm tint-background">

                                    <div class="lining-shadow rounded-t-sm text-lg font-medium font-header px-4 py-2">{{stagedPayrollPayload.summary}}</div>

                                    <div class="p-4">

                                        <div class="grid gap-2 grid-cols-4">
                                            <div class="col-span-2">
                                                <InputLabel :size="'sm'" value="Payroll period"/>
                                                <Input
                                                    :disabled="true"
                                                    :size="'md'"
                                                    v-model="stagedPayrollPayload.date_range_readable"/>
                                            </div>
                                            <div>
                                                <InputLabel :size="'sm'" value="Remarks"/>
                                                <Input
                                                    ref="remarksReference"
                                                    :disabled="modalDisableActions"
                                                    :size="'md'"
                                                    v-model="stagedPayrollPayload.remarks"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template #footer>
                            <div class="mx-auto max-w-screen-xl">
                                <div class="flex space-x-2 justify-between">
                                    <div class="space-x-2 inline-flex">
                                        <div class="space-x-2 inline-flex items-center">
                                            <UnorderedList
                                                v-if="modalDisableActions"
                                                :icon="'eos-icons:loading'"
                                                :size="'md'"
                                                :label="'Please wait...'"/>
                                        </div>
                                    </div>
                                    <div class="space-x-2 inline-flex items-center">
                                        <Button
                                            class="w-min"
                                            :variant=" 'outline'"
                                            :size="'md'"
                                            :disabled="modalDisableActions"
                                            :label="'Cancel'"
                                            @click="closeModal"/>
                                        <Button
                                            class="w-min"
                                            :variant="'default'"
                                            :icon="modalSubmitPending ? 'eos-icons:loading' : ''"
                                            :size="'md'"
                                            :disabled="modalDisableActions"
                                            :label="modalSubmitPending ? 'Generating...' : 'Submit'"
                                            @click="preGeneratePayroll"/>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </DialogModal>

                    <DialogModal
                        :show="showConfirmHasAtLeastOneFinalPay"
                        :closeable="false">
                        <template #title>

                        </template>
                        <template #content>
                            <div class="pt-4 space-y-4">

                                <div class="flex flex-row gap-6 flex-wrap">
                                    <div>
                                        <InputLabel :size="'sm'" value="Pay frequency"/>
                                        <div class="text-base font-data">
                                            {{stagedPayrollPayload.summary}}
                                        </div>
                                    </div>
                                    <div>
                                        <InputLabel :size="'sm'" value="Payroll period"/>
                                        <div class="text-base font-data">
                                            {{stagedPayrollPayload.date_range_readable}}
                                        </div>
                                    </div>
                                </div>

                                <div class="lining-shadow rounded-sm tint-background">

                                    <div class="lining-shadow rounded-t-sm text-lg font-header px-4 py-2 label-danger">Confirm Final Pay</div>

                                    <div class="p-4">

                                        <div class="grid grid-cols-1 md:gap-2 lg:grid-cols-1">
                                            <div class="space-y-2">

                                                <DataTable
                                                    :landscape="true"
                                                    :headers="employmentProfilesFinalPaySalaryStatementsHeaders"
                                                    :size="'md'"
                                                    :rows="employmentProfilesFinalPaySalaryStatementsData"
                                                    v-model="selectedEmploymentProfilesFinalPaySalaryStatements">
                                                    <template v-slot:cell.employee_number="{cell,slot}">
                                                        <div class="p-[3px]">{{cell.employee.number}}</div>
                                                    </template>
                                                    <template v-slot:cell.employee_full_name="{cell,slot}">
                                                        <div class="p-[3px]">{{cell.employee.full_name}}</div>
                                                    </template>
                                                    <template v-slot:cell.status="{cell, slot, scrollReference}">
                                                        <div class="p-[3px]">{{cell.status.text}}</div>
                                                    </template>
                                                    <template v-slot:cell.employment_type="{cell, slot, scrollReference}">
                                                        <div class="p-[3px]">{{cell.employment_type.text}}</div>
                                                    </template>
                                                    <template v-slot:cell.end_of_service_type="{cell, slot, scrollReference}">
                                                        <div class="p-[3px]">{{cell.end_of_service_type?.text}}</div>
                                                    </template>
                                                    <template v-slot:cell.start_date="{cell, slot, scrollReference}">
                                                        <div class="p-[3px]">{{cell.start_date_readable}}</div>
                                                    </template>
                                                    <template v-slot:cell.end_date="{cell, slot, scrollReference}">
                                                        <div class="p-[3px]">{{cell.end_date_readable}}</div>
                                                    </template>
                                                </DataTable>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template #footer>
                            <div class="mx-auto max-w-screen-xl">
                                <div class="flex space-x-2 justify-between">
                                    <div class="space-x-2 inline-flex items-center">

                                    </div>
                                    <div class="space-x-2 inline-flex items-center">
                                        <Button
                                            class="w-min"
                                            :variant=" 'outline'"
                                            :size="'md'"
                                            :label="'Cancel'"
                                            @click="closeConfirmHasAtLeastOneFinalPay"/>
                                        <Button
                                            class="w-min"
                                            :variant=" 'outline'"
                                            :size="'md'"
                                            :label="'Confirm & Proceed payroll generation'"
                                            @click="confirmHasAtLeastOneFinalPay"/>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </DialogModal>

                    <DialogModal
                        :show="showNoSalaryStatementToBeGenerated"
                        :closeable="false">
                        <template #title>

                        </template>
                        <template #content>
                            <div class="pt-4 space-y-4">

                                <div class="flex flex-row gap-6 flex-wrap">
                                    <div>
                                        <InputLabel :size="'sm'" value="Pay frequency"/>
                                        <div class="text-base font-data">
                                            {{stagedPayrollPayload.summary}}
                                        </div>
                                    </div>
                                    <div>
                                        <InputLabel :size="'sm'" value="Payroll period"/>
                                        <div class="text-base font-data">
                                            {{stagedPayrollPayload.date_range_readable}}
                                        </div>
                                    </div>
                                </div>

                                <div class="lining-shadow rounded-sm tint-background">

                                    <div class="lining-shadow rounded-t-sm text-lg font-header px-4 py-2 label-danger">No Salary Statement to Generate</div>

                                    <div class="p-4">

                                        <div class="grid grid-cols-1 md:gap-2 lg:grid-cols-1">
                                            <div class="space-y-2">

                                                <DataTable
                                                    :landscape="true"
                                                    :headers="noSalaryStatementToBeGeneratedCausesHeaders"
                                                    :size="'md'"
                                                    :rows="noSalaryStatementToBeGeneratedCausesData"
                                                    v-model="selectedNoSalaryStatementToBeGeneratedCauses">
                                                    <template v-slot:cell.cause="{cell,slot}">
                                                        <div class="p-[3px] label-danger">{{cell.cause}}</div>
                                                    </template>
                                                </DataTable>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template #footer>
                            <div class="mx-auto max-w-screen-xl">
                                <div class="flex space-x-2 justify-between">
                                    <div class="space-x-2 inline-flex items-center">

                                    </div>
                                    <div class="space-x-2 inline-flex items-center">
                                        <Button
                                            class="w-min"
                                            :variant=" 'outline'"
                                            :size="'md'"
                                            :label="'Okay'"
                                            @click="closeNoSalaryStatementToBeGenerated"/>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </DialogModal>

                    <div class="space-y-6">
                        <DataTable
                            :sup-headers="recentPayrollsSupHeaders"
                            :headers="payrollInquiriesHeaders"
                            :size="'lg'"
                            :rows="recentPayrollsData"
                            v-model="selectedRecentPayrolls"
                            selection>
                            <template v-slot:cell.remarks="{cell,slot}">
                                <div class="mx-0.5 flex items-center">
                                    <Input
                                        v-model="cell.remarks"
                                        in-cell
                                        :size="slot.inputSize"
                                        class="w-full" />
                                </div>
                            </template>
                            <template v-slot:cell.actions="{cell,slot}">
                                <div class="mx-0.5 space-x-0.5 flex items-center">
                                    <Button
                                        v-if="cell.isSelectable"
                                        @click="stagePayrollPayload(cell)"
                                        :size="slot.buttonSize"
                                        :variant="'flat'"
                                        :icon="cell.payroll ? 'mdi:repeat' : ''"
                                        :label="cell.payroll ? 'Regenerate payroll' : 'Run payroll'" />
                                </div>
                            </template>
                            <template v-slot:cell.payroll_status="{cell,slot}">
                                <div v-if="cell.payroll" class="flex space-x-1 px-[0.3rem] items-center">
                                    <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.payroll?.status?.text" />
                                </div>
                            </template>
                        </DataTable>

                        <div class="scaffold-border-top"></div>

                        <DataTable
                            :sup-headers="currentPayrollsSupHeaders"
                            :headers="payrollInquiriesHeaders"
                            :size="'lg'"
                            :rows="currentPayrollsData"
                            v-model="selectedLatestPayrolls"
                            selection>
                            <template v-slot:cell.remarks="{cell,slot}">
                                <div v-if="cell.payroll">
                                    <div class="p-[3px]">
                                        {{cell.remarks}}
                                    </div>
                                </div>
                                <div v-else class="mx-0.5 flex items-center">
                                    <Input
                                        v-model="cell.remarks"
                                        in-cell
                                        :size="slot.inputSize"
                                        class="w-full" />
                                </div>
                            </template>
                            <template v-slot:cell.actions="{cell,slot}">
                                <div class="mx-0.5 space-x-0.5 flex items-center">
                                    <Button
                                        v-if="cell.isSelectable"
                                        @click="stagePayrollPayload(cell)"
                                        :size="slot.buttonSize"
                                        :variant="'flat'"
                                        :icon="cell.payroll ? 'mdi:repeat' : ''"
                                        :label="cell.payroll ? 'Regenerate payroll' : 'Run payroll'" />
                                </div>
                            </template>
                            <template v-slot:cell.payroll_status="{cell,slot}">
                                <div class="p-[3px]">
                                    {{cell.payroll?.status?.text}}
                                </div>
                            </template>
                        </DataTable>

                        <div class="scaffold-border-top"></div>
                    </div>

                    <div v-if="generatedPayroll.id" class="lining-shadow rounded-sm tint-background">

                        <div class="p-4">
                            <PayrollSalaryStatements :key="generatedPayroll.id" v-model:payroll="generatedPayroll" />
                        </div>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import {useLocalStorage} from '@vueuse/core';
import type {TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {PayrollInquiryT, PayrollT} from "@/public/js/types/payroll";
import type {StringEnumInterface} from "@/public/js/common/type";
import type {LabelTypeT} from "@/public/js/types/theme";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Generate Payroll`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const wordClamp = nuxtApp.$wordClamp as (text: string, length: number) => string;
const common = useCommon();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, async (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        await rebuildSelections();
        await payrollInquiriesExecute();
    }
});

const rebuildSelections = async (selection: string[] = []) => {

    if(_isEmpty(selection) || selection.indexOf('employee_group') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            employeeGroupOptions, employeeGroupOptionsKey, SELECT.MULTI_STATIC, companyOrganizationSelections.value.employee_groups
        );
    }
}

const recentPayrollsSupHeaders = reactive<TableSupHeaderT[]>([
    {text: 'Recent payrolls', colspan: 4, alignHeader: 'center'},
    {text: 'Period', colspan: 2, alignHeader: 'center'},
    {text: '', colspan: 1, alignHeader: 'left'},
    {text: '', colspan: 1, alignHeader: 'left'},
]);

const currentPayrollsSupHeaders = reactive<TableSupHeaderT[]>([
    {text: 'Current payroll', colspan: 4, alignHeader: 'center'},
    {text: 'Period', colspan: 2, alignHeader: 'center'},
    {text: '', colspan: 1, alignHeader: 'left'},
    {text: '', colspan: 1, alignHeader: 'left'},
]);

const payrollInquiriesHeaders = reactive<TableHeaderT[]>([
    { text: 'Frequency', value: 'pay_frequency_readable', minWidth: '85px'},
    { text: 'Sequence', value: 'frequency_sequence_readable', minWidth: '85px'},
    { text: 'Year', value: 'year', alignData: 'left', minWidth: '85px'},
    { text: 'Month', value: 'month_readable', minWidth: '85px'},
    { text: 'Start', value: 'start_readable', minWidth: '100px'},
    { text: 'End', value: 'end_readable', minWidth: '100px'},
    { text: '', value: 'actions',},
    { text: 'Status', value: 'payroll_status', minWidth: '85px'},
]);

const generateFrequency = useLocalStorage('generate-frequency', PAY_FREQUENCY_TYPE.MONTHLY)
const payFrequency = ref(generateFrequency.value);
const payFrequencyOptions = reactive([
    $enumerableOption(PAY_FREQUENCY_NAME, PAY_FREQUENCY_TYPE.SEMIMONTHLY as number),
    $enumerableOption(PAY_FREQUENCY_NAME, PAY_FREQUENCY_TYPE.MONTHLY as number),
]);
watch(payFrequency, (value) => {
    generateFrequency.value = value;
    payrollInquiriesExecute();
})

const companyOrganizationSelections = companyOrganizationSelectionsState();
const employeeGroupOptionsKey = shallowRef(0);
const employeeGroupOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.employee_groups,
    selected: []
});

const recentCount = ref(1);
const recentPayrollsData = ref<PayrollInquiryT[]>([]);
const currentPayrollsData = ref<PayrollInquiryT[]>([]);
const payrollInquiriesPending = ref(false)
const selectedRecentPayrolls = ref([]);
const selectedLatestPayrolls = ref([]);

const disableActions = computed(() => {
    return payrollInquiriesPending.value || companyAssociationPendingState().value;
});
const payrollInquiriesExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    payrollInquiriesPending.value = true;

    await laraFetch(`/api/payroll-inquiry`, {
        method: 'GET',
        params: {
            company_id: selectedAssociatedCompanyId.value,
            recent_count: recentCount.value,
            filters: {
                pay_frequency_types: [payFrequency.value]
            }
        }
    }, {
        onRequestError: () => {
            payrollInquiriesPending.value = false;
        },
        onResponse: () => {
            payrollInquiriesPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            //@ts-ignore
            recentPayrollsData.value = _get(response, '_data.values.recent', []).map((payrollPayload: TableRowT) => {

                let statusSummary = _get(payrollPayload, 'payroll.status.value', 0);

                let shade = 'clear';

                if(statusSummary == PAYROLL_STATUS.DRAFT){
                    shade = 'clear';
                } else if(statusSummary == PAYROLL_STATUS.WORKFLOW_IN_PROGRESS){
                    shade = 'info';
                } else if(statusSummary == PAYROLL_STATUS.COMPLETED){
                    shade = 'success';
                }

                let isSelectable = [PAYROLL_STATUS.DRAFT].indexOf(statusSummary) >= 0;

                return {
                    isSelectable: isSelectable || payrollPayload.payroll == null,
                    ...payrollPayload,
                    _payload: {
                        'label_shade': {
                            'cell': ['payroll_status'],
                            'value': shade
                        }
                    }
                };
            });
            //@ts-ignore
            currentPayrollsData.value = _get(response, '_data.values.current', []).map((payrollPayload: TableRowT) => {

                let statusSummary = _get(payrollPayload, 'payroll.status.value', 0);

                let shade = 'clear';

                if(statusSummary == PAYROLL_STATUS.DRAFT){
                    shade = 'clear';
                } else if(statusSummary == PAYROLL_STATUS.WORKFLOW_IN_PROGRESS){
                    shade = 'info';
                } else if(statusSummary == PAYROLL_STATUS.COMPLETED){
                    shade = 'success';
                }

                let isSelectable = [PAYROLL_STATUS.DRAFT].indexOf(statusSummary) >= 0;

                return {
                    isSelectable: isSelectable || payrollPayload.payroll == null,
                    ...payrollPayload,
                    _payload: {
                        'label_shade': {
                            'cell': ['payroll_status'],
                            'value': shade
                        }
                    }
                };
            });
        }
    }, true);
}
await payrollInquiriesExecute();

const generatingPayroll = ref(false);
const remarksReference = useTemplateRef('remarksReference');
const stagedPayrollPayload = ref<Partial<PayrollInquiryT>>({});

const stagePayrollPayload = async (tableRow: TableRowT) => {

    let payrollInquiry = tableRow as PayrollInquiryT;

    stagedPayrollPayload.value = {...payrollInquiry};

    generatingPayroll.value = true;

    await nextTick();
    //@ts-ignore
    remarksReference.value.$refs.input.focus();
}

const modalDisableActions = computed(()=>{
    return  modalLoading.value
        || modalSubmitPending.value;
});
const modalLoading = ref(false);
const modalSubmitPending = ref(false);

const resetStage = () => {
    stagedPayrollPayload.value = {};
}
const closeModal = () => {
    generatingPayroll.value = false;
    resetStage();
};

const generatePayrollOfEmployeeIds = ref([]);
const generatePayrollFormBody = computed(()=>{
    return {
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        year: stagedPayrollPayload.value.year,
        month: stagedPayrollPayload.value.month,
        pay_frequency: _get(stagedPayrollPayload.value, 'pay_frequency.value', null),
        frequency_sequence: _get(stagedPayrollPayload.value, 'frequency_sequence.value', null),
        start_date: stagedPayrollPayload.value.start,
        end_date: stagedPayrollPayload.value.end,
        remarks: stagedPayrollPayload.value.remarks,
    };
});

const showNoSalaryStatementToBeGenerated = ref(false);

const noSalaryStatementToBeGeneratedCausesHeaders = reactive<TableHeaderT[]>([
    { text: 'Causes might be...', value: 'cause'},
]);
const noSalaryStatementToBeGeneratedCausesData = ref([
    {
        id: 1,
        cause: 'Your employees payroll group does not belong to the pay frequency you want to generate.'
    },{
        id: 2,
        cause: 'Your employees are final paid.'
    },{
        id: 3,
        cause: 'Your employees dont have any active employment profile.'
    },{
        id: 4,
        cause: 'Your employees active employment profile is not within the payroll period date range.'
    },
]);
const selectedNoSalaryStatementToBeGeneratedCauses = ref([]);

const closeNoSalaryStatementToBeGenerated = () => {
    showNoSalaryStatementToBeGenerated.value = false;
}

const preGeneratePayroll = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    modalSubmitPending.value = true;

    await laraFetch(`/api/pre-generate-payroll`, {
        method: 'POST',
        body: generatePayrollFormBody.value
    }, {
        onRequestError: () => {
            modalSubmitPending.value = false;
        },
        onResponse: () => {
            modalSubmitPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            employmentProfilesFinalPaySalaryStatementsData.value = _get(response, '_data.values.employment_profiles_final_pay', []);
            generatePayrollOfEmployeeIds.value = _get(response, '_data.values.generate_payroll_employee_ids', []);

            showConfirmHasAtLeastOneFinalPay.value = employmentProfilesFinalPaySalaryStatementsData.value.length > 0;

            if(generatePayrollOfEmployeeIds.value.length <= 0){

                showNoSalaryStatementToBeGenerated.value = true;
                return;
            }

            if(generatePayrollOfEmployeeIds.value.length > 0 && !showConfirmHasAtLeastOneFinalPay.value){
                await generatePayroll();
            }
        }
    }, true);
}

const generatedPayroll = ref<PayrollT>({} as PayrollT);

const generatePayroll = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    modalSubmitPending.value = true;

    await laraFetch(`/api/payroll`, {
        method: 'POST',
        body: {
            ...generatePayrollFormBody.value,
            employee_ids: generatePayrollOfEmployeeIds.value
        }
    }, {
        onRequestError: () => {
            modalSubmitPending.value = false;
        },
        onResponse: () => {
            modalSubmitPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            generatedPayroll.value = _get(response, '_data.values.payroll', {}) as PayrollT;

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Payroll Draft Generated`,
                message: `Payroll#: ${_get(generatedPayroll.value, 'number', 'Not found')} see preview below.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            closeModal();
            await payrollInquiriesExecute();
        }
    }, true);
}

const showConfirmHasAtLeastOneFinalPay = ref(false);

const employmentProfilesFinalPaySalaryStatementsHeaders = reactive<TableHeaderT[]>([
    { text: 'Employee #', value: 'employee_number'},
    { text: 'Name', value: 'employee_full_name'},
    { text: 'Employment Type', value: 'employment_type'},
    { text: 'Start Date', value: 'start_date'},
    { text: 'End Of Service Type', value: 'end_of_service_type'},
    { text: 'End Date', value: 'end_date'},
]);
const employmentProfilesFinalPaySalaryStatementsData = ref([]);
const selectedEmploymentProfilesFinalPaySalaryStatements = ref([]);

const closeConfirmHasAtLeastOneFinalPay = () => {
    showConfirmHasAtLeastOneFinalPay.value = false;
    employmentProfilesFinalPaySalaryStatementsData.value = [];
}
const confirmHasAtLeastOneFinalPay = async() => {
    closeConfirmHasAtLeastOneFinalPay();
    await generatePayroll();

}
</script>

<style scoped>

</style>