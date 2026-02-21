<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <div class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <form @submit.prevent="payrollInquiriesExecute">

                        <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                            <div>
                                <InputLabel :size="'sm'" value="Payroll group" />
                                <MultiSelect
                                    :disabled="disableActions"
                                    :searchable="false"
                                    :selection-max-viewable-line="3"
                                    drop-shadow
                                    :size="'md'"
                                    :key="payFrequencyOptionsKey"
                                    :options="payFrequencyOptions"
                                    :icon="'tdesign:component-checkbox'"/>
                            </div>
                            <div>
                                <InputLabel :size="'sm'" value="Recent payroll dates count" />
                                <Input :type="'number'" high-light-all-text-on-focus type-strict v-model="recentCount" :size="'md'" />
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
                                        :label="disableActions ? 'Loading' : 'Load payroll dates'"/>
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
                        :max-width="'780px'"
                        :closeable="false">
                        <template #title>

                        </template>
                        <template #content>
                            <div class="pt-2 flex flex-row gap-4">

                                <form @submit.prevent="generatePayroll()">
                                    <fieldset class="w-full neutral-border px-2 pb-2 space-y-2">
                                        <legend class="text-base">{{stagedPayrollPayload.summary}}</legend>

                                        <div class="grid gap-2 grid-cols-4">
                                            <div class="col-span-2">
                                                <InputLabel :size="'sm'" value="Payroll of"/>
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
                                    </fieldset>
                                </form>

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
                                            @click="generatePayroll"/>
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
                                    <Button @click="stagePayrollPayload(cell)" :size="slot.buttonSize" :variant="'outline'"  :label="cell.payroll ? 'Regenerate' : 'Generate'" />
                                </div>
                            </template>
                            <template v-slot:cell.payroll_status="{cell,slot}">
                                <div class="p-[3px]">
                                    {{cell.payroll?.status?.text}}
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
                                    <Button @click="stagePayrollPayload(cell)" :size="slot.buttonSize" :variant="'outline'" :label="cell.payroll ? 'Regenerate' : 'Generate'" />
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

                    <div v-if="generatedPayroll.id">
                        <PayrollSalaryStatements :key="generatedPayroll.id" :payroll="generatedPayroll" />
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {TableHeaderT, TableSupHeaderT} from "@/public/js/types/data";
import type {PayrollInquiryT, PayrollT} from "@/public/js/types/payroll";
import type {StringEnumInterface} from "@/public/js/common/type";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Generate Payroll`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
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
    {text: 'Recent payrolls', colspan: 5, alignHeader: 'center'},
    {text: '', colspan: 1, alignHeader: 'center'},
    {text: 'Actions', colspan: 1, alignHeader: 'left'},
    {text: 'Payroll', colspan: 1, alignHeader: 'left'},
]);

const currentPayrollsSupHeaders = reactive<TableSupHeaderT[]>([
    {text: 'Current payroll', colspan: 5, alignHeader: 'center'},
    {text: '', colspan: 1, alignHeader: 'center'},
    {text: 'Actions', colspan: 1, alignHeader: 'left'},
    {text: 'Payroll', colspan: 1, alignHeader: 'left'},
]);

const payrollInquiriesHeaders = reactive<TableHeaderT[]>([
    { text: 'Frequency', value: 'pay_frequency_readable', minWidth: '85px'},
    { text: 'Month Sequence', value: 'frequency_sequence_readable', minWidth: '85px'},
    { text: 'Year', value: 'year', alignData: 'left', minWidth: '85px'},
    { text: 'Month', value: 'month_readable', minWidth: '85px'},
    { text: 'Date', value: 'date_range_readable', minWidth: '275px'},
    { text: 'Remarks', value: 'remarks',},
    { text: '', value: 'actions',},
    { text: 'Status', value: 'payroll_status', minWidth: '85px'},
]);

const payFrequencyOptionsKey = shallowRef(0);
const payFrequencyOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(PAY_FREQUENCY_NAME, PAY_FREQUENCY_TYPE.WEEKLY as number),
        $enumerableOption(PAY_FREQUENCY_NAME, PAY_FREQUENCY_TYPE.SEMI_MONTHLY as number),
        $enumerableOption(PAY_FREQUENCY_NAME, PAY_FREQUENCY_TYPE.MONTHLY as number),
    ],
    selected: [PAY_FREQUENCY_TYPE.MONTHLY]
});
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
                pay_frequency_types: payFrequencyOptions.selected
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
            recentPayrollsData.value = _get(response, '_data.values.recent', []);
            currentPayrollsData.value = _get(response, '_data.values.current', []);
        }
    }, false);
}
await payrollInquiriesExecute();

const generatingPayroll = ref(false);
const remarksReference = useTemplateRef('remarksReference');
const stagedPayrollPayload = ref<Partial<PayrollInquiryT>>({});

const stagePayrollPayload = async (payrollInquiry: PayrollInquiryT) => {
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

const generatedPayroll = ref<PayrollT>({} as PayrollT);

const generatePayroll = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    modalSubmitPending.value = true;

    await laraFetch(`/api/payroll`, {
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
            generatedPayroll.value = _get(response, '_data.values.payroll', {}) as PayrollT;

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Payroll draft generated`,
                message: `Payroll#: ${_get(generatedPayroll.value, 'number', 'Not found')}.`,
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
</script>

<style scoped>

</style>