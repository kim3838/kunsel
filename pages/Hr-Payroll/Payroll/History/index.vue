<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search Number" type="text"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" for="month" value="From month" />
                            <InputWithIcon
                                glint
                                :icon="'mdi:calendar-cursor-outline'"
                                :size="'md'"
                                :id="'from_month'"
                                v-model="filters.fromMonth.label"
                                readonly />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" for="month" value="To month" />
                            <InputWithIcon
                                glint
                                :icon="'mdi:calendar-cursor-outline'"
                                :size="'md'"
                                :id="'to_month'"
                                v-model="filters.toMonth.label"
                                readonly />
                        </div>
                        <div class="flex flex-col">
                            <div class="flex-none h-[1.25rem]"></div>
                            <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        </div>
                    </div>
                </form>

                <div class="px-[20px] space-y-2">
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
                                    class="z-10"
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
                                        {type: 'action', title: 'Submit for approval',callback: () => {}},
                                    ]">
                                </NavDrop>
                            </div>
                        </template>
                        <template v-slot:cell.number="{cell,slot}">
                            <div class="p-[3px] hover:underline cursor-pointer" :title="cell.number" @click="copy(cell.number);">{{wordClamp(cell.number, 12)}}</div>
                        </template>
                        <template v-slot:cell.copy_payroll_number_to_clipboard="{cell,slot}">
                            <div v-if="clipBoardSupported" class="text-base h-[32px]" :title="'Copy payroll number'" @click="copy(cell.number);">
                                <div class="h-full flex items-center justify-center px-2 cursor-pointer accent-hover">
                                    <Icon size="1.5rem" :name="'ph:copy-light'"/>
                                </div>
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
import type {EnumOption, EnumSelection, StringEnumInterface} from "@/public/js/common/type";
import type {DateTimePickerPayloadT} from "@/public/js/datetimepicker/type";
import type {LabelTypeT} from "@/public/js/types/theme";
import {storeToRefs} from "pinia";
import {useClipboard } from '@vueuse/core'

useHead({titleTemplate: (titleChunk) => {return `Payrolls`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const { copy, isSupported: clipBoardSupported } = useClipboard({ legacy: true })
const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const wordClamp = nuxtApp.$wordClamp as (text: string, length: number) => string;
const moment = useNuxtApp().$moment;
const {render} = dateTimePicker();
const clientReadyState = useClientReadyState();
const common = useCommon();
const coreStore = useCoreStore();
const formStore = nuxtApp.$formStore;
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

const payrollsSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},

    {text: '', colspan: 9,  alignHeader: 'left'},

    {text: 'Totals', colspan: 2,  alignHeader: 'left'},
]);

const payrollsHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions', minWidth: '33px'},

    { text: 'Payroll #', value: 'number', isNumeric: true},
    { text: 'Copy #', value: 'copy_payroll_number_to_clipboard'},
    { text: 'Status', value: 'status'},

    { text: 'Year', value: 'year'},
    { text: 'Month', value: 'month_readable'},

    { text: 'Frequency', value: 'pay_frequency'},
    { text: 'Sequence', value: 'frequency_sequence'},

    { text: 'Coverage', value: 'date_range_readable'},

    { text: 'Remarks', value: 'remarks'},

    { text: 'Salary Statement Net', value: 'total_salary_statement_net', isNumeric: true, alignData: 'right'},
    { text: 'Employer Contribution Share', value: 'total_employer_contribution_share', isNumeric: true, alignData: 'right'},
]);

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
    'successful': true,
    'message': ''
});
let filters = reactive<{
    page: number,
    perPage: number,
    search: {
        keyword: string,
        callback: ReturnType<typeof setTimeout> | number
    },
    fromMonth: {
        value: string,
        label: string
    },
    toMonth: {
        value: string,
        label: string
    }
}>({
    page: 1,
    perPage: 25,
    search: {
        keyword: '',
        callback: 1
    },
    fromMonth: {
        value: moment().startOf('year').format('YYYY-MM'),
        label: moment().startOf('year').format('YYYY MMMM')
    },
    toMonth: {
        value: moment().endOf('year').format('YYYY-MM'),
        label: moment().endOf('year').format('YYYY MMMM')
    },
});

const viewMode = reactive<{
    selection: EnumSelection;
    selected: number | null;
}>({
    selection: [
        {text : 'Flex', value: DATA_VIEW_MODE.FLEX} as EnumOption,
        {text : 'List', value: DATA_VIEW_MODE.LIST} as EnumOption,
    ],
    selected: DATA_VIEW_MODE.LIST as number
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
            from_month: filters.fromMonth.value,
            to_month: filters.toMonth.value,
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
            payrolls.data = _get(response, '_data.values.data', []).map((payroll: TableRowT) => {

                let statusSummary = _get(payroll, 'status.value', 0);

                let shade = 'info';

                if(statusSummary == PAYROLL_STATUS.DRAFT){
                    shade = 'clear';
                }

                return {
                    ...payroll,
                    _payload: {
                        'label_shade': {
                            'cell': ['number','status'],
                            'value': shade
                        }
                    }
                };
            });
            payrolls.meta = _get(response, '_data.values.meta', {
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
            filters.fromMonth.value = payload.value;
            filters.fromMonth.label = payload.label as string;
        }
    },
    {
        id: 'to_month',
        type: 'month',
        selectedCallback: (payload: DateTimePickerPayloadT) => {
            filters.toMonth.value = payload.value;
            filters.toMonth.label = payload.label as string;
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
</script>

<style scoped>

</style>