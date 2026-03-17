<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search Payroll" type="text"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" for="month" value="From month" />
                            <InputWithIcon
                                glint
                                :icon="'mdi:calendar-cursor-outline'"
                                :size="'md'"
                                :id="'from_month'"
                                v-model="formStore.filters.fromMonthLabel"
                                readonly />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" for="month" value="To month" />
                            <InputWithIcon
                                glint
                                :icon="'mdi:calendar-cursor-outline'"
                                :size="'md'"
                                :id="'to_month'"
                                v-model="formStore.filters.toMonthLabel"
                                readonly />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Pay Frequency" />
                            <MultiSelect
                                :key="payFrequencyOptionsKey"
                                :icon="'tdesign:component-checkbox'"
                                :disabled="disableActions"
                                glint
                                drop-shadow
                                :selection-max-viewable-line="15"
                                :size="'md'"
                                :options="payFrequencyOptions"
                            />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Frequency Sequence" />
                            <MultiSelect
                                :key="payFrequencySequenceOptionsKey"
                                :icon="'tdesign:component-checkbox'"
                                :disabled="disableActions"
                                glint
                                drop-shadow
                                :selection-max-viewable-line="15"
                                :size="'md'"
                                :options="payFrequencySequenceOptions"
                            />
                        </div>
                    </div>

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        <div class="h-8 flex flex-row items-center scaffold-border px-2">
                            <label class="flex items-center">
                                <Checkbox
                                    :disabled="disableActions"
                                    name="show-statement-dates"
                                    v-model="showPayrollColumns"
                                    :size="'md'"
                                    :label="'Show payroll columns'" />
                            </label>
                        </div>
                    </div>
                </form>

                <DialogModal
                    :show="showConfirmSubmitForApproval"
                    :max-width="'680px'"
                    :closeable="false">
                    <template #title>
                        Confirm Payroll Request
                    </template>
                    <template #content>
                        <div class="pt-4 space-y-4">

                            <div class="lining-shadow rounded-sm tint-background">

                                <div class="lining-shadow rounded-t-sm text-lg font-medium font-header px-4 py-2">{{stagedPayroll.number}}</div>

                                <div class="p-4 space-y-6">

                                    <PayrollSubInfo
                                        v-if="stagedPayroll.id"
                                        :payroll="stagedPayroll"
                                        :type="PAYROLL_SUB_INFO_TYPE.ADMIN_OVERVIEW" />

                                    <div class="grid grid-cols-1 md:gap-2 lg:grid-cols-3">
                                        <div>
                                            <InputLabel :size="'sm'" value="Remarks"/>
                                            <Input
                                                ref="remarksReference"
                                                :disabled="submitForApprovalPending"
                                                :size="'md'"
                                                v-model="submitForApprovalRemarks"/>
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
                                        :disabled="submitForApprovalPending"
                                        :variant=" 'outline'"
                                        :size="'md'"
                                        :label="'Cancel'"
                                        @click="cancelSubmitForApproval"/>
                                    <Button
                                        class="w-min"
                                        :disabled="submitForApprovalPending"
                                        :variant=" 'outline'"
                                        :size="'md'"
                                        :label="submitForApprovalPending ? 'Please wait...' : 'Confirm & Proceed payroll request'"
                                        @click="submitForApproval"/>
                                </div>
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="px-[20px] space-y-2">
                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <div class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[disableActions ? 'pointer-events-none' : '']">
                            <div v-if="payrolls.successful" class="scaffold-border px-2 font-[National_Park]">
                                <span><span class="font-semibold">{{selectedPayrolls.length}}</span> Selected</span>
                            </div>
                            <Button
                                v-if="payrolls.successful"
                                :variant="'outline'"
                                :size="'sm'"
                                :icon="'tdesign:close'"
                                :disabled="disableActions"
                                :label="'Clear selection'"
                                @click="selectedPayrolls = []" />
                            <Button
                                v-if="payrolls.successful"
                                :variant="'outline'"
                                :size="'sm'"
                                :icon="'mdi:delete-outline'"
                                :disabled="disableActions"
                                :label="'Bulk delete'"
                                @click="confirmDeleteSelected()"/>
                            <Label v-if="!payrolls.successful" invert :size="'md'" :type="'danger'" :label="payrolls.message" />
                        </div>

                        <div v-if="!payrollsPending" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                            <Label :size="'md'" :type="'clear'" shade :label="`Employer Contr. Share: ${totalEmployerContributionShare}`" />
                            <Label :size="'md'" :type="'clear'" shade :label="`Taxable: ${totalTaxable}`" />
                            <Label :size="'md'" :type="'clear'" shade :label="`Tax Withheld: ${totalTaxWithheld}`" />
                            <Label :size="'md'" :type="'clear'" shade :label="`Net: ${totalNet}`" />
                        </div>
                    </div>


                    <DataTable
                        v-if="payrolls.successful"
                        :sup-headers="payrollsSupHeaders"
                        :headers="payrollsHeaders"
                        :size="'lg'"
                        :rows="payrolls.data"
                        :disabled="disableDataTable"
                        v-model="selectedPayrolls"
                        selection>
                        <template v-slot:cell.actions="{cell,slot: cellSlot}">
                            <div class="flex items-center">
                                <NavDrop
                                    class="z-20"
                                    :disabled="disableActions"
                                    :parent-icon="'ic:baseline-arrow-right'"
                                    in-horizontal-scrollable
                                    divider
                                    :size="`sm`"
                                    :drop-shadow-size="`xl`"
                                    :title="'Menu'"
                                    :drop-align="'top'"
                                    :drop-justify="'right'"
                                    :drop-options="[
                                        {type: 'link', icon: 'ix:open-external', title: 'Salary statements', to: `/hr-payroll/payroll/history/${cell.ulid}`},
                                        {type: 'action', icon: 'ic:round-send', title: 'Submit for approval',callback: () => {confirmSubmitForApproval(cell)}},
                                    ]">
                                    <template v-slot="{slot}">
                                        <div
                                            class="flex items-center pl-1 py-1 focus:outline-none">
                                            <span :class="[slot.headerFontClass, 'font-narrow-thin']">Menu</span>
                                            <Icon :class="[slot.dropDownIconClass]" :name="'ic:baseline-arrow-right'"/>
                                        </div>
                                    </template>
                                </NavDrop>
                            </div>
                        </template>
                        <template v-slot:cell.number="{cell,slot}">
                            <div class="p-[3px] font-medium hover:underline cursor-pointer" :title="cell.number" @click="copy(cell.number);">{{wordClamp(cell.number, showPayrollColumns ? 20 : 10)}}</div>
                        </template>
                        <template v-slot:cell.remarks="{cell,slot}">
                            <div v-if="cell.remarks" class="flex items-center" :title="'Show remarks'">
                                <NavDrop
                                    class="z-10 w-full"
                                    :disabled="disableActions"
                                    :parent-icon="'ic:baseline-arrow-right'"
                                    in-horizontal-scrollable
                                    divider
                                    :size="`sm`"
                                    :drop-shadow-size="`xl`"
                                    :title="'Remarks'"
                                    :drop-align="'top'"
                                    :drop-justify="'right'"
                                    :drop-options="[
                                        {type: 'action', icon: 'gg:comment', title: cell.remarks},
                                    ]">
                                    <template v-slot="{slot}">
                                        <div
                                            :class="[slot.headerFontClass]"
                                            class="h-[32px] flex items-center justify-center focus:outline-none">
                                            <Icon :class="[slot.dropDownIconClass]" :name="'gg:loadbar-alt'"/>
                                        </div>
                                    </template>
                                </NavDrop>
                            </div>
                        </template>
                        <template v-slot:cell.status="{cell,slot}">
                            <div class="flex space-x-1 px-[0.3rem] items-center">
                                <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.status?.text" />
                            </div>
                        </template>
                        <template v-slot:cell.pay_frequency="{cell,slot}">
                            <div class="p-[3px]">{{cell.pay_frequency?.text}}</div>
                        </template>
                        <template v-slot:cell.frequency_sequence="{cell,slot}">
                            <div class="p-[3px]">{{cell.frequency_sequence?.text}}</div>
                        </template>
                    </DataTable>

                    <div>
                        <PageInformation :pagination="payrolls.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="payrolls.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {StringEnumInterface} from "@/public/js/common/type";
import type {DateTimePickerPayloadT} from "@/public/js/datetimepicker/type";
import type {LabelTypeT} from "@/public/js/types/theme";
import type {PayrollT} from "@/public/js/types/payroll";
import {storeToRefs} from "pinia";
import {useClipboard } from '@vueuse/core'

useHead({titleTemplate: (titleChunk) => {return `Payrolls`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const { copy, isSupported: clipBoardSupported } = useClipboard({ legacy: true })
const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const wordClamp = nuxtApp.$wordClamp as (text: string, length: number) => string;
const {render} = dateTimePicker();
const clientReadyState = useClientReadyState();
const formStore = nuxtApp.$formStore;
const {
    fromMonthValueComputed,
    toMonthValueComputed,
} = storeToRefs(nuxtApp.$formStore);
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        paginate();
    }
});

const payFrequencySelections = [
    $enumerableOption(PAY_FREQUENCY_NAME, PAY_FREQUENCY_TYPE.SEMIMONTHLY as number),
    $enumerableOption(PAY_FREQUENCY_NAME, PAY_FREQUENCY_TYPE.MONTHLY as number),
];

const payFrequencyOptionsKey = shallowRef(0);
const payFrequencyOptions = reactive({
    search: '',
    selection: payFrequencySelections,
    selected: []
});

const payFrequencySequenceSelections = [
    $enumerableOption(PAY_FREQUENCY_SEQUENCE_NAME, PAY_FREQUENCY_SEQUENCE_TYPE.FIRST_HALF as number),
    $enumerableOption(PAY_FREQUENCY_SEQUENCE_NAME, PAY_FREQUENCY_SEQUENCE_TYPE.SECOND_HALF as number),
];

const payFrequencySequenceOptionsKey = shallowRef(0);
const payFrequencySequenceOptions = reactive({
    search: '',
    selection: payFrequencySequenceSelections,
    selected: []
});

const showPayrollColumns = ref(true);

const {asDetailTotalsHeaderSupFields, asDetailTotalsHeaderFields} = useSalaryStatement();

const payrollsSupHeaders = computed<TableSupHeaderT[]>(() => {
    return [
        {text: ''},
        {text: ''},

        ...(showPayrollColumns.value ? [
            {text: 'Payroll', colspan: 8,  alignHeader: 'center'},
        ] : [
            {text: '', colspan: 1,  alignHeader: 'center'},
        ]),

        ...asDetailTotalsHeaderSupFields.value
    ] as TableSupHeaderT[];
});

const payrollsHeaders = computed<TableHeaderT[]>(() => {
    return [
        { text: '#', value: 'row_number'},
        { text: '', value: 'actions', minWidth: '33px'},

        ...(showPayrollColumns.value ? [
            { text: '#', value: 'number', isNumeric: true},
            { text: 'Rmrks', value: 'remarks'},
            { text: 'Status', value: 'status'},

            { text: 'Year', value: 'year'},
            { text: 'Month', value: 'month_readable'},

            { text: 'Frequency', value: 'pay_frequency'},
            { text: 'Seq.', value: 'frequency_sequence', alignData: 'right'},

            { text: 'Period', value: 'date_range_readable'},
        ] : [
            { text: 'Payroll #', value: 'number', isNumeric: true},
        ]),

        ...asDetailTotalsHeaderFields.value

    ] as TableHeaderT[];
});

const payrolls = reactive<DataTableT>({
    'data': [],
    'meta': {
        pagination: {
            total: 0,
            count: 0,
            per_page: 0,
            current_page: 0,
            total_pages: 0
        }
    },
    'successful': false,
    'message': ''
});
const totalEmployerContributionShare = ref(0);
const totalTaxable = ref(0);
const totalTaxWithheld = ref(0);
const totalNet = ref(0);

let filters = reactive<{
    page: number,
    perPage: number,
    search: {
        keyword: string,
        callback: ReturnType<typeof setTimeout> | number
    }
}>({
    page: 1,
    perPage: 10,
    search: {
        keyword: '',
        callback: 1
    }
});

const payrollStatusOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(PAYROLL_STATUS_NAME, PAYROLL_STATUS.DRAFT as number),
    ],
    selected: []
});

let pageComputed = computed({
    get() {
        return {
            page: filters.page,
            perPage: filters.perPage,
        }
    },
    set(payload: { key: 'page' | 'perPage', value: number }) {
        filters[payload.key] = payload.value;
    }
});

watch(fromMonthValueComputed, (newValue) => {
    paginate(1);
})

watch(toMonthValueComputed, (newValue) => {
    paginate(1);
})

const showStatements = ref(true);

watch(() => {return showStatements.value;}, (show) => {
    if(show){
        paginate(1, true)
    } else {
        paginate(1, true)
    }
})

let paramsComputed = computed(() => {
    return {
        page: filters.page,
        perPage: filters.perPage,
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        filters: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_ids: [selectedAssociatedCompanyId.value],
            search: filters.search.keyword,
            from_month: formStore.filters.fromMonthValue,
            to_month: formStore.filters.toMonthValue,
            pay_frequencies: payFrequencyOptions.selected,
            frequency_sequences: payFrequencySequenceOptions.selected,
        }
    };
});
const payrollsPending = ref(false)
const deleting = ref(false);
const selectedPayrolls = ref([]);

const disableActions = computed(() => {
    return payrollsPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return payrollsPending.value || companyAssociationPendingState().value;
});

const payrollsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyAccountId.value|| !selectedAssociatedCompanyId.value){
        return;
    }

    totalEmployerContributionShare.value = 0;
    totalTaxable.value = 0;
    totalTaxWithheld.value = 0;
    totalNet.value = 0;
    payrollsPending.value = true;

    await laraFetch(`/api/payrolls`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            payrollsPending.value = false;
        },
        onResponse: (request, options, response) => {
            payrollsPending.value = false;
            payrolls.successful = _get(response, '_data.successful', false);
            payrolls.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {

            let payrollTotalsResponse = _get(response, '_data.values.payroll_totals', {});

            totalEmployerContributionShare.value = _get(payrollTotalsResponse, 'employer_contribution_share', 0);
            totalTaxable.value = _get(payrollTotalsResponse, 'taxable', 0);
            totalTaxWithheld.value = _get(payrollTotalsResponse, 'withholding_tax', 0);
            totalNet.value = _get(payrollTotalsResponse, 'net', 0);

            let payrollsResponse = _get(response, '_data.values.payrolls', {});

            payrolls.data = _get(payrollsResponse, 'data', []).map((payroll: TableRowT) => {

                let statusSummary = _get(payroll, 'status.value', 0);

                let shade = 'clear';

                if(statusSummary == PAYROLL_STATUS.DRAFT){
                    shade = 'clear';
                } else if(statusSummary == PAYROLL_STATUS.WORKFLOW_IN_PROGRESS){
                    shade = 'info';
                } else if(statusSummary == PAYROLL_STATUS.COMPLETED){
                    shade = 'success';
                }

                return {
                    isSelectable: statusSummary == PAYROLL_STATUS.DRAFT,
                    ...payroll,
                    _payload: {
                        'label_shade': {
                            'cell': ['number', 'remarks', 'status', 'year', 'month_readable'],
                            'value': shade
                        }
                    }
                };
            });
            payrolls.meta = _get(payrollsResponse, 'meta', {
                pagination: {
                    total: 0,
                    count: 0,
                    per_page: 0,
                    current_page: 0,
                    total_pages: 0
                }
            });
        }
    }, false);
}
payrollsExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedPayrolls.value = [];
    }

    if(filters.page === page){
        payrollsExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

let datePickers = ref([
    {
        id: 'from_month',
        type: 'month',
        selectedCallback: (payload: DateTimePickerPayloadT) => {

            formStore.setFormFilterValue({
                key: 'fromMonthValue',
                value: payload.value
            });
            formStore.setFormFilterValue({
                key: 'fromMonthLabel',
                value: payload.label as string
            });
        }
    },
    {
        id: 'to_month',
        type: 'month',
        selectedCallback: (payload: DateTimePickerPayloadT) => {

            formStore.setFormFilterValue({
                key: 'toMonthValue',
                value: payload.value
            });
            formStore.setFormFilterValue({
                key: 'toMonthLabel',
                value: payload.label as string
            });
        }
    },
]);

const renderDatePickers = () => {
    render(datePickers.value);
}

//Render date time pickers on navigate
if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(() => {
            renderDatePickers();
        });
    });
}

//Render date time pickers on load
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            renderDatePickers();
        });
    }
})

const confirmDeleteSelected = () => {

    const selectedIds = selectedPayrolls.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected payroll to delete.`,
            action: {
                callback: () => {},
                label: 'Okay'
            }
        });

        return false;
    }

    useNuxtApp().$promptStore.setPrompt({
        resetable: true,
        icon: null,
        title: 'Confirm Action',
        message: `Confirm delete payroll${selectedIds.length > 1 ? 's' : ''}?`,
        action: {
            callback: async () => {
                await deleteSelected();
            },
            label: 'Yes'
        }
    });
}
const deleteSelected = async () => {

    let selectedIds: number[] = [];

    selectedIds = selectedPayrolls.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/payrolls", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            payroll_ids: selectedIds,
        },
    },{
        onRequestError: (request, options, error) => {
            deleting.value = false;
        },
        onResponse: () => {
            deleting.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: `Payroll${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedPayrolls.value = [];
    await payrollsExecute();
}

const stagedPayroll = ref<PayrollT>({} as PayrollT);

const showConfirmSubmitForApproval = ref(false);
const confirmSubmitForApproval = (cell: TableRowT) => {

    stagedPayroll.value = cell as PayrollT;

    showConfirmSubmitForApproval.value = true;
}

const cancelSubmitForApproval = () => {
    showConfirmSubmitForApproval.value = false;
}

const submitForApprovalRemarks = ref('');
const submitForApprovalPending = ref(false);

const resetSubmitApproval = () => {
    stagedPayroll.value = {} as PayrollT;
    submitForApprovalRemarks.value = '';
    showConfirmSubmitForApproval.value = false;
    submitForApprovalPending.value = false;
}

const submitForApproval = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyAccountId.value|| !selectedAssociatedCompanyId.value || !stagedPayroll.value.id){
        return;
    }

    submitForApprovalPending.value = true;

    await laraFetch(`/api/payroll-request`, {
        method: 'POST',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            payroll_id: stagedPayroll.value.id,
            remarks: submitForApprovalRemarks.value,
        }
    }, {
        onRequestError: () => {
            submitForApprovalPending.value = false;
        },
        onResponse: (request, options, response) => {
            submitForApprovalPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            let payrollRequest = _get(response, '_data.values.payroll_request', {});

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Payroll request submitted`,
                message: `Request #: ${_get(payrollRequest, 'number', 'Not found')}.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            resetSubmitApproval();
            await payrollsExecute();
        }
    }, true);
}
</script>

<style scoped>

</style>