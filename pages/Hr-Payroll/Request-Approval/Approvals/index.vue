<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Request # Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search Number" type="text"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Filter approver" />
                            <MultiSelectPaginated
                                :key="companyUserSelectionsOptionsKey"
                                :icon="'tdesign:component-checkbox'"
                                :disabled="disableActions"
                                glint
                                drop-shadow
                                :size="'md'"
                                :label="'Filter approver'"
                                :payload="companyUserSelectionsOptions"
                            />
                        </div>
                    </div>

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        <RadioGroup
                            class="scaffold-border px-2"
                            :disabled="disableActions"
                            :selections="viewMode.selection"
                            :size="'md'"
                            :orientation="'horizontal'"
                            v-model="viewMode.selected" />
                        <label class="flex items-center">
                            <Checkbox
                                :disabled="disableActions"
                                name="remember"
                                v-model="showOnlyAwaitingApproval"
                                :size="'md'"
                                :label="'Show Only Awaiting Approval'" />
                        </label>
                    </div>

                    <div>
                        <PageInformation :pagination="approvalStates.meta.pagination" :pending="disableDataTable"/>
                        <div class="flex items-center gap-2">
                            <Pagination :size="'lg'" :pagination="approvalStates.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                        </div>
                    </div>
                </form>

                <SetRequestableApprovalWorkFlow
                    v-model:create-requestable-work-flow="createRequestableWorkFlow"
                    v-model:approval-state-work-flow-payload="selectedApprovalStatesProxy"
                    v-model:requestable-work-flow-action="requestableWorkFlowAction"
                    @resolved="requestableWorkFlowResolved"/>

                <ViewRequestable
                    v-model:view-requestable="showRequestable"
                    v-model:approval-state-payload="approvalStatePayload"
                    v-model:requestable-is-approvable="requestableIsApprovable"
                    @applyApprovalWorkFlowFromViewable="applyApprovalWorkFlowFromViewable"/>

                <div class="px-[20px]">
                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                        <div v-if="approvalStates.successful" class="scaffold-border px-2 font-[National_Park]">
                            <span><span class="font-semibold">{{selectedApprovalStates.length}}</span> Selected</span>
                        </div>
                        <Button
                            v-if="approvalStates.successful"
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'tdesign:close'"
                            :disabled="disableActions"
                            :label="'Clear selection'"
                            @click="selectedApprovalStates = []; selectedApprovalStatesProxy = []" />
                        <Button
                            v-if="approvalStates.successful && selectedApprovalStatesProxy.length"
                            :size="'sm'"
                            :disabled="disableActions"
                            :label="`Approve ${selectedApprovalStatesProxy.length}`"
                            @click="applyApprovalWorkFlow(APPROVAL_ACTION.APPROVE as number)" />
                        <Button
                            v-if="approvalStates.successful && selectedApprovalStatesProxy.length"
                            :size="'sm'"
                            :disabled="disableActions"
                            :label="`Decline ${selectedApprovalStatesProxy.length}`"
                            @click="applyApprovalWorkFlow(APPROVAL_ACTION.DECLINE as number)" />
                        <Label v-if="!approvalStates.successful" invert :size="'md'" :type="'danger'" :label="approvalStates.message" />
                    </div>

                    <DataTable
                        v-if="approvalStates.successful"
                        :sup-headers="approvalStatesSupHeaders"
                        :headers="approvalStatesHeaders"
                        :size="'lg'"
                        :rows="approvalStates.data"
                        :disabled="disableDataTable"
                        v-model="selectedApprovalStates"
                        @selectionChanged="syncSelectedApprovalStatesProxy"
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
                                        {type: 'action', title: 'No action',callback: () => {}},
                                    ]">
                                </NavDrop>
                            </div>
                        </template>

                        <template v-slot:cell.request_number="{cell,slot}">
                            <div class="p-[3px] hover:underline cursor-pointer" @click="viewRequestable(cell)">{{cell.requestable.number}}</div>
                        </template>
                        <template v-slot:cell.date_requested_diff="{cell,slot}">
                            <div class="p-[3px]">{{cell.requestable.date_requested_diff}}</div>
                        </template>

                        <template v-slot:cell.status="{cell,slot}">
                            <div class="flex space-x-1 px-[0.3rem] items-center">
                                <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.status?.text" />
                            </div>
                        </template>
                        <template v-slot:cell.order="{cell,slot}">
                            <div class="p-[3px]">{{ordinal(cell.order)}}</div>
                        </template>
                        <template v-slot:cell.user_status="{cell,slot}">
                            <div class="p-[3px]">{{cell.approver.status?.text}}</div>
                        </template>
                        <template v-slot:cell.company_timezone="{cell,slot}">
                            <div class="p-[3px]">{{cell.requestable.company_timezone}}</div>
                        </template>
                        <template v-slot:cell.username="{cell,slot}">
                            <div class="p-[3px]">{{cell.approver.username}}</div>
                        </template>
                        <template v-slot:cell.company_employee_number="{cell,slot}">
                            <div class="p-[3px]">{{cell.approver.company_employee_number}}</div>
                        </template>
                        <template v-slot:cell.company_employee_full_name="{cell,slot}">
                            <div class="p-[3px]">{{cell.approver.company_employee_full_name}}</div>
                        </template>
                        <template v-slot:cell.company_assignment_type="{cell,slot}">
                            <div class="px-[3px]">
                                <span v-if="cell.approver.company_assignment_type?.value">{{cell.approver.company_assignment_type?.text}}</span>
                            </div>
                        </template>
                        <template v-slot:cell.approved_by_username="{cell,slot}">
                            <div class="p-[3px]">{{cell.approved_by.username}}</div>
                        </template>
                        <template v-slot:cell.approved_at_diff="{cell,slot}">
                            <div class="p-[3px]">{{cell.approved_by.approved_at_diff}}</div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableSelectionActionT, DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection, StringEnumInterface} from "@/public/js/common/type";
import type {LabelTypeT} from "@/public/js/types/theme";
import type {CompanyUserRolePermissionT} from "@/public/js/types/role-permission";
import type {ApprovalStateT, ApprovalStateWorkFlowPayloadT} from "@/public/js/types/request-approval";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Approval States`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const user = userState();
const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const ordinal = nuxtApp.$ordinal as (num: number | string) => string;
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
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

const approvalStatesSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},

    {text: '', colspan: 2,  alignHeader: 'left'},

    {text: 'Approval', colspan: 4,  alignHeader: 'left'},

    {text: 'Approver', colspan: 5,  alignHeader: 'left'},

    {text: 'Approved by', colspan: 3,  alignHeader: 'left'},
]);

const approvalStatesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions', minWidth: '33px'},

    { text: 'Request #', value: 'request_number', isNumeric: true},
    { text: '', value: 'date_requested_diff'},

    { text: 'Order', value: 'order'},
    { text: 'Status', value: 'status'},
    { text: '', value: 'current_state_message', minWidth: '33px'},
    { text: 'Remarks', value: 'remarks'},

    { text: 'Status', value: 'user_status'},
    { text: 'Username', value: 'username'},
    { text: 'Employee #', value: 'company_employee_number'},
    { text: 'Name', value: 'company_employee_full_name'},
    { text: 'Company Assignment', value: 'company_assignment_type'},

    { text: '', value: 'approved_by_username', minWidth: '33px'},
    { text: '', value: 'approved_at_diff', minWidth: '33px'},
]);

const approvalStates = reactive<DataTableT>({
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
    }
}>({
    page: 1,
    perPage: 25,
    search: {
        keyword: '',
        callback: 1
    }
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

const showOnlyAwaitingApproval = ref(true);

watch(() => {return showOnlyAwaitingApproval.value;}, (show) => {
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
            associated_companies: [selectedAssociatedCompanyId.value],
            search: filters.search.keyword,
            user_ids: companyUserSelectionsOptions.selected,
            show_only_current_state: showOnlyAwaitingApproval.value
        }
    };
});
const approvalStatesPending = ref(false)
const selectedApprovalStates = ref([]);

const disableActions = computed(() => {
    return approvalStatesPending.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return approvalStatesPending.value || companyAssociationPendingState().value;
});

const hasPermissionToApproveAnyRequest = ref(false);
const hasPermissionToDeclineAnyRequest = ref(false);
const companyUserRolePermissionsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyAccountId.value|| !selectedAssociatedCompanyId.value){
        return;
    }

    await laraFetch(`/api/company-user-role-permissions`, {
        method: 'GET',
        params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            filters: {
                account_id: selectedAssociatedCompanyAccountId.value,
                associated_company: selectedAssociatedCompanyId.value,
                user_id: user.value?.id,
                permission_keys: ['approve-any-request','decline-any-request',]
            }
        }
    }, {
        onSuccessResponse: async (request, options, response) => {
            let permissions = _get(response, '_data.values.data', []) as CompanyUserRolePermissionT[];

            let approveAnyRequest = _find(permissions, {permission: 'approve-any-request'}) as CompanyUserRolePermissionT;
            let declineAnyRequest = _find(permissions, {permission: 'decline-any-request'}) as CompanyUserRolePermissionT;

            hasPermissionToApproveAnyRequest.value = approveAnyRequest.permitted;
            hasPermissionToDeclineAnyRequest.value = declineAnyRequest.permitted;
        }
    }, false);
}
await companyUserRolePermissionsExecute();

const approvalStatesExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyAccountId.value|| !selectedAssociatedCompanyId.value){
        return;
    }

    approvalStatesPending.value = true;

    await laraFetch(`/api/approval-states`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            approvalStatesPending.value = false;
        },
        onResponse: (request, options, response) => {
            approvalStatesPending.value = false;
            approvalStates.successful = _get(response, '_data.successful', false);
            approvalStates.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            approvalStates.data = _get(response, '_data.values.data', []).map((approvalState: TableRowT) => {

                let selfIsApprover = approvalState.approver.user_id == user.value?.id;
                let isAwaitingForApproval = approvalState.current_state_flag == 1;
                let permittedToApproveOrDeclineAnyRequest = hasPermissionToApproveAnyRequest.value || hasPermissionToDeclineAnyRequest.value;

                return {
                    ...approvalState,
                    isSelectable: isAwaitingForApproval && (permittedToApproveOrDeclineAnyRequest || selfIsApprover)
                };
            }).map((approvalState: TableRowT) => {

                let statusSummary = _get(approvalState, 'status.value', 0);

                let shade = 'default';

                if(statusSummary == REQUEST_APPROVAL_STATUS.DECLINED){
                    shade = 'danger';
                } else if(statusSummary == REQUEST_APPROVAL_STATUS.APPROVED){
                    shade = 'success';
                }

                return {
                    ...approvalState,
                    _payload: {
                        'label_shade': {
                            'cell': ['status'],
                            'value': shade
                        }
                    }
                };
            });
            approvalStates.meta = _get(response, '_data.values.meta', {
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
await approvalStatesExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedApprovalStates.value = [];
        selectedApprovalStatesProxy.value = [];
    }

    if(filters.page === page){
        approvalStatesExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});


const selectedApprovalStatesProxy = ref<ApprovalStateWorkFlowPayloadT[]>([]);

const syncSelectedApprovalStatesProxy = (selectionPayload: DataTableSelectionActionT) => {

    if(selectionPayload.action == SELECTION_ACTION.REMOVE){

        let selectionPayloadNumber = selectionPayload.value as number[];

        _remove(selectedApprovalStatesProxy.value, (pool: ApprovalStateWorkFlowPayloadT) => selectionPayloadNumber.includes(pool.id as number));
    }

    if(selectionPayload.action == SELECTION_ACTION.ADD){

        let filteredApprovalStatesData = approvalStates.data.filter((approvalStateRow: TableRowT) => {

            let approvalState = approvalStateRow as ApprovalStateT;
            let selectionPayloadNumber = selectionPayload.value as number[];
            let approvalStateIsSelected = selectionPayloadNumber.includes(approvalState.id as number);
            let approvalStateIsNotYetInSelectedPool = _isEmpty(_find(selectedApprovalStatesProxy.value, {id: approvalState.id}));

            return approvalStateIsSelected && approvalStateIsNotYetInSelectedPool;
        });

        selectedApprovalStatesProxy.value.push(...filteredApprovalStatesData.map((approvalStateRow: TableRowT) => {

            let approvalState = approvalStateRow as ApprovalStateT;

            return {
                id: approvalState.id,
                order: approvalState.order,
                number: approvalState.requestable.number,
            }
        }));
    }
}

const showRequestable = ref(false);
const requestableIsApprovable = ref(false);
const approvalStatePayload = ref<ApprovalStateT>({} as ApprovalStateT);

const viewRequestable = async (row: TableRowT) => {

    approvalStatePayload.value = row as ApprovalStateT;
    requestableIsApprovable.value = row?.isSelectable as boolean;
    showRequestable.value = true;
}

const createRequestableWorkFlow = ref(false);
const requestableWorkFlowAction = ref(APPROVAL_ACTION.NOT_SPECIFIED);

const applyApprovalWorkFlow = (action: number) => {

    if(action == APPROVAL_ACTION.NOT_SPECIFIED || !(selectedApprovalStatesProxy.value.length)) return;

    requestableWorkFlowAction.value = action;
    createRequestableWorkFlow.value = true;
}

const applyApprovalWorkFlowFromViewable = (action: number, preSelectedApprovalStates: ApprovalStateWorkFlowPayloadT[]) => {

    selectedApprovalStatesProxy.value = preSelectedApprovalStates;
    requestableWorkFlowAction.value = action;
    createRequestableWorkFlow.value = true;
}

const requestableWorkFlowResolved = () => {

    paginate(1, true);
}
</script>

<style scoped>

</style>