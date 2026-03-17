<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Submitted by" />
                            <MultiSelectPaginated
                                :key="companyUserSelectionsOptionsKey"
                                :icon="'tdesign:component-checkbox'"
                                :disabled="disableActions"
                                glint
                                drop-shadow
                                :size="'md'"
                                :label="'Filter submitted by'"
                                :payload="companyUserSelectionsOptions"
                            />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Status" />
                            <MultiSelect :disabled="disableActions" glint drop-shadow :size="'md'" :options="requestApprovalStatusOptions" :icon="'tdesign:component-checkbox'"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Request # Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search Number" type="text"/>
                        </div>
                    </div>

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        <div class="h-8 flex flex-row items-center scaffold-border px-2">
                            <label class="flex items-center">
                                <Checkbox
                                    :disabled="disableActions"
                                    name="show-approval-sequence"
                                    v-model="showApprovalStates"
                                    :size="'md'"
                                    :label="'Show approval sequence'" />
                            </label>
                        </div>
                    </div>
                </form>

                <ViewRequestable
                    v-model:view-requestable="showRequestable"
                    v-model:requestable-payload="requestablePayload"/>

                <div class="px-[20px] space-y-2">
                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[disableActions ? 'pointer-events-none' : '']">
                        <div v-if="payrollRequests.successful" class="scaffold-border px-2 font-[National_Park]">
                            <span><span class="font-semibold">{{selectedPayrollRequests.length}}</span> Selected</span>
                        </div>
                        <Button v-if="payrollRequests.successful" :variant="'outline'" :size="'sm'" :icon="'mdi:delete-outline'" :disabled="disableActions" :label="'Bulk delete'" @click="confirmDeleteSelected()" />
                        <Button
                            v-if="payrollRequests.successful"
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'tdesign:close'"
                            :disabled="disableActions"
                            :label="'Clear selection'"
                            @click="selectedPayrollRequests = []" />
                        <Label v-if="!payrollRequests.successful" invert :size="'md'" :type="'danger'" :label="payrollRequests.message" />
                    </div>

                    <DataTable
                        v-if="payrollRequests.successful"
                        :key="payrollRequestsKey"
                        :sup-headers="payrollRequestsSupHeaders"
                        :headers="payrollRequestsHeaders"
                        :size="'lg'"
                        :rows="payrollRequests.data"
                        :disabled="disableDataTable"
                        v-model="selectedPayrollRequests"
                        selection
                        :border-appearance="showApprovalStates"
                        :stripped="!showApprovalStates"
                        :sub-row-slug="payrollRequestSubRowSlug"
                        :sub-row-settings="{
                            type: DATATABLE_SUBROW_TYPE.TITLED,
                            containerPaddingTop: 0.75,
                            containerPaddingBottom: 1.75,
                            titleSize: 'md',
                            rowVerticalLine: true,
                            verticalBorderType: 'dashed'
                        }">
                        <template v-slot:cell.number="{cell,slot}">
                            <div class="p-[3px] font-medium hover:underline cursor-pointer" @click="viewRequestable(cell)">{{cell.number}}</div>
                        </template>
                        <template v-slot:cell.status_summary="{cell,slot}">
                            <div class="flex space-x-1 px-[0.3rem] items-center">
                                <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.status_summary?.text" />
                            </div>
                        </template>
                        <template v-slot:cell.requested_by="{cell,slot}">
                            <div class="p-[3px]">{{cell.requested_by?.username}}</div>
                        </template>
                        <template v-slot:cell.payroll_number="{cell,slot}">
                            <div class="p-[3px] font-medium">{{cell.payroll?.number}}</div>
                        </template>
                        <template v-slot:cell.payroll_period="{cell,slot}">
                            <div class="p-[3px]">{{cell.payroll?.date_range_readable}}</div>
                        </template>
                        <template v-slot:cell.total_employer_contribution_share="{cell,slot}">
                            <div class="p-[3px]">{{cell.payroll?.total_employer_contribution_share}}</div>
                        </template>
                        <template v-slot:cell.total_withholding_tax="{cell,slot}">
                            <div class="p-[3px]">{{cell.payroll?.total_withholding_tax}}</div>
                        </template>
                        <template v-slot:cell.total_net="{cell,slot}">
                            <div class="p-[3px]">{{cell.payroll?.total_net}}</div>
                        </template>
                        <template v-slot:sub_row_slot="{rowIndex, cell, slot}">
                            <div class="inline-flex items-center scaffold-border pr-2">
                                <Icon name="mdi:info-variant" :class="[slot.iconSizeClass]" /><div :class="[slot.titleSizeClass]">Approval Sequence</div>
                            </div>
                            <ApprovalStateSubRow
                                :rows="cell[slot.slug]"
                                :disabled="disableDataTable"
                            ></ApprovalStateSubRow>
                        </template>
                    </DataTable>

                    <div>
                        <PageInformation :pagination="payrollRequests.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="payrollRequests.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {StringEnumInterface} from "@/public/js/common/type";
import type {LabelTypeT} from "@/public/js/types/theme";
import type {RequestablePayloadT} from "@/public/js/types/request-approval";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Payroll Requests`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const $moment = nuxtApp.$moment;
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const {render} = dateTimePicker();
const clientReadyState = useClientReadyState();
const common = useCommon();
const coreStore = useCoreStore();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        rebuildSelections();
        paginate();
    }
});

const rebuildSelections = (selection: string[] = []) => {
    
    if(_isEmpty(selection) || selection.indexOf('company_user') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            companyUserSelectionsOptions, companyUserSelectionsOptionsKey, SELECT.MULTI_PAGINATED, [], {
                query_params: {
                    account_id: selectedAssociatedCompanyAccountId.value,
                    company_id: selectedAssociatedCompanyId.value,
                },
                filters: {
                    account_id: selectedAssociatedCompanyAccountId.value,
                    associated_companies: [selectedAssociatedCompanyId.value],
                    search: {
                        keyword: '',
                        callback: 1
                    }
                }
            }
        );
    }
}

const showApprovalStates = ref(false);
const payrollRequestSubRowSlug = ref('');

watch(() => {return showApprovalStates.value;}, (show) => {
    if(show){
        payrollRequestSubRowSlug.value = 'approval_states';
        paginate(1, true)
    } else {
        payrollRequestSubRowSlug.value = '';
        paginate(1, true)
    }
})

const payrollRequestsSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},

    {text: ''},
    {text: ''},

    {text: 'Submitted by', colspan: 3,  alignHeader: 'left'},

    {text: 'Payroll / Totals', colspan: 5,  alignHeader: 'left'},
]);

const payrollRequestsHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},

    { text: 'Request #', value: 'number', isNumeric: true},
    { text: 'Status', value: 'status_summary'},

    { text: '', value: 'requested_by', minWidth: '33px'},
    { text: '', value: 'date_requested_diff', minWidth: '33px'},
    { text: 'Remarks', value: 'remarks', minWidth: '33px'},

    { text: '#', value: 'payroll_number', minWidth: '33px', isNumeric: true},
    { text: 'Period', value: 'payroll_period', minWidth: '33px'},
    { text: 'Employer contr. share', value: 'total_employer_contribution_share', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'Tax Withheld', value: 'total_withholding_tax', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'Net Due', value: 'total_net', isNumeric: true, alignData: 'right', alignHeader: 'right'},
]);

const payrollRequestsKey = shallowRef(0);
const payrollRequests = reactive<DataTableT>({
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
let filters = reactive<{
    page: number,
    perPage: number,
    search: {
        keyword: string,
        callback: ReturnType<typeof setTimeout> | number
    },
    employeeSearch: {
        keyword: string,
        callback: ReturnType<typeof setTimeout> | number
    },
    dateFrom: string,
    dateTo: string,
}>({
    page: 1,
    perPage: 15,
    search: {
        keyword: '',
        callback: 1
    },
    employeeSearch: {
        keyword: '',
        callback: 1
    },
    dateFrom: $moment().startOf('day').format('YYYY-MM-DD'),
    dateTo: $moment().endOf('day').format('YYYY-MM-DD'),
});

const requestApprovalStatusOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(REQUEST_APPROVAL_STATUS_NAME, REQUEST_APPROVAL_STATUS.PENDING as number),
        $enumerableOption(REQUEST_APPROVAL_STATUS_NAME, REQUEST_APPROVAL_STATUS.DECLINED as number),
        $enumerableOption(REQUEST_APPROVAL_STATUS_NAME, REQUEST_APPROVAL_STATUS.APPROVED as number),
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

//Multi select options of Submitted by
const companyUserSelectionsOptionsKey = shallowRef(0);
const companyUserSelectionsOptions = reactive({
    fetch: {
        url: '/api/company-user-selections',
        query_params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
        },
        filters: {
            account_id: selectedAssociatedCompanyAccountId.value,
            associated_companies: [selectedAssociatedCompanyId.value],
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: [],
});

let paramsComputed = computed(() => {
    return {
        page: filters.page,
        perPage: filters.perPage,
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            search: filters.search.keyword,
            employee_search: filters.employeeSearch.keyword,
            requested_by_ids: companyUserSelectionsOptions.selected,
            statuses: requestApprovalStatusOptions.selected,
        }
    };
});
const payrollRequestsPending = ref(false)
const selectedPayrollRequests = ref([]);
const deleting = ref(false);

const disableActions = computed(() => {
    return payrollRequestsPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return payrollRequestsPending.value || companyAssociationPendingState().value;
});
const payrollRequestsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    payrollRequestsPending.value = true;

    await laraFetch(`/api/payroll-requests`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            payrollRequestsPending.value = false;
        },
        onResponse: (request, options, response) => {
            payrollRequestsPending.value = false;
            payrollRequests.successful = _get(response, '_data.successful', false);
            payrollRequests.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            payrollRequests.data = _get(response, '_data.values.data', []).map((payrollRequest: TableRowT) => {

                let statusSummary = _get(payrollRequest, 'status_summary.value', 0);

                let shade = 'default';

                if(statusSummary == REQUEST_APPROVAL_STATUS.DECLINED){
                    shade = 'danger';
                } else if(statusSummary == REQUEST_APPROVAL_STATUS.APPROVED){
                    shade = 'success';
                }

                return {
                    ...payrollRequest,
                    _payload: {
                        'label_shade': {
                            'cell': ['status_summary'],
                            'value': shade
                        }
                    }
                };
            });
            payrollRequests.meta = _get(response, '_data.values.meta', {
                pagination: {
                    total: 0,
                    count: 0,
                    per_page: 0,
                    current_page: 0,
                    total_pages: 0
                }
            });
            payrollRequestsKey.value += 1;
        }
    }, false);
}
payrollRequestsExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedPayrollRequests.value = [];
    }

    if(filters.page === page){
        payrollRequestsExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

let filtersDateTimePickers = ref([
    {
        id: 'date_from',
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            filters.dateFrom = payload.value;
        }
    }, {
        id: 'date_to',
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            filters.dateTo = payload.value;
        }
    }
]);

//Render date time pickers on navigate
if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(() => {
            render(filtersDateTimePickers.value);
        });
    });
}

//Render date time pickers on load
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            render(filtersDateTimePickers.value);
        });
    }
})

const confirmDeleteSelected = () => {

    const selectedIds = selectedPayrollRequests.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected payroll request to delete.`,
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
        message: `Confirm delete selected payroll request${selectedIds.length > 1 ? 's' : ''}?`,
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

    selectedIds = selectedPayrollRequests.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/payroll-requests", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            payroll_request_ids: selectedIds,
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
                message: `Payroll request${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedPayrollRequests.value = [];
    await payrollRequestsExecute();
}

const showRequestable = ref(false);
const requestablePayload = ref<Partial<RequestablePayloadT>>({
    type: '',
    id: -1,
    number: '',
});

const viewRequestable = async (row: TableRowT) => {

    requestablePayload.value = {
        type: 'payroll_request',
        id: row.id,
        number: row.number,
    } as RequestablePayloadT;
    showRequestable.value = true;
}
</script>

<style scoped>

</style>