<template>
    <div>

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

        <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-6">
            <div v-if="approvalStates.successful" class="scaffold-border px-2 text-sm font-[National_Park]">
                <span><span class="font-semibold">{{selectedApprovalStates.length}}</span> Selected</span>
            </div>
            <Button
                v-if="approvalStates.successful && selectedApprovalStates.length"
                :variant="'outline'"
                :withBorder="false"
                :size="'xs'"
                :icon="'ph:backspace'"
                :disabled="disableActions"
                :label="'Clear selection'"
                @click="selectedApprovalStates = []; selectedApprovalStatesProxy = []" />
            <Button
                v-if="approvalStates.successful && selectedApprovalStatesProxy.length"
                :size="'xs'"
                :disabled="disableActions"
                :label="`Approve ${selectedApprovalStatesProxy.length}`"
                @click="applyApprovalWorkFlow(APPROVAL_ACTION.APPROVE as number)" />
            <Button
                v-if="approvalStates.successful && selectedApprovalStatesProxy.length"
                :size="'xs'"
                :disabled="disableActions"
                :label="`Decline ${selectedApprovalStatesProxy.length}`"
                @click="applyApprovalWorkFlow(APPROVAL_ACTION.DECLINE as number)" />
            <Button
                :variant="'outline'"
                :withBorder="false"
                :size="'xs'"
                :icon="'ic:sharp-restart-alt'"
                :disabled="disableActions"
                :label="'Reload'"
                @click="listApprovalStates" />
            <Label v-if="!approvalStates.successful" invert :size="'md'" :type="'danger'" :label="approvalStates.message" />
            <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'sm'" :label="'Please wait...'"/>
        </div>

        <DataTable
            v-if="approvalStates.successful"
            :sup-headers="approvalStatesSupHeaders"
            :headers="approvalStatesHeaders"
            :size="'md'"
            :stripped="true"
            :landscape="true"
            :rows="approvalStates.data"
            :disabled="disableDataTable"
            v-model="selectedApprovalStates"
            @selectionChanged="syncSelectedApprovalStatesProxy"
            selection>
            <template v-slot:cell.requestable_type_readable="{cell,slot}">
                <div class="p-[3px]" :title="cell.requestable.type_readable">{{wordClamp(cell.requestable.type_readable, 20)}}</div>
            </template>
            <template v-slot:cell.request_number="{cell,slot}">
                <div class="p-[3px] hover:underline cursor-pointer" @click="viewRequestable(cell)">{{cell.requestable.number}}</div>
            </template>
            <template v-slot:cell.order="{cell,slot}">
                <div class="p-[3px]">{{ordinal(cell.order)}}</div>
            </template>
            <template v-slot:cell.status="{cell,slot}">
                <div class="flex space-x-1 px-[0.3rem] items-center">
                    <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.status?.text" />
                </div>
            </template>
            <template v-slot:cell.date_requested_diff="{cell,slot}">
                <div class="p-[3px]">{{cell.requestable.date_requested_diff}}</div>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type {LabelTypeT} from "@/public/js/types/theme";
import type {DataTableSelectionActionT, DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {ApprovalStateT, ApprovalStateWorkFlowPayloadT, RequestablePayloadT} from "@/public/js/types/request-approval";
import {storeToRefs} from "pinia";

const {isAuthenticated, userIsSuperAdmin} = useAuth();
const user = userState();
const nuxtApp = useNuxtApp();
const wordClamp = nuxtApp.$wordClamp as (text: string, length: number) => string;
const ordinal = nuxtApp.$ordinal as (num: number | string) => string;
const {
    updatedAssociatedCompanyFlag,
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId,
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        listApprovalStates();
    }
});

const approvalStatesSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},

    {text: '', colspan: 1,  alignHeader: 'left'},
    {text: '', colspan: 1,  alignHeader: 'left'},

    {text: 'Approval', colspan: 3,  alignHeader: 'left'},

    {text: '', colspan: 1,  alignHeader: 'left'},
]);

const approvalStatesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},

    { text: '', value: 'requestable_type_readable'},
    { text: 'Request #', value: 'request_number', isNumeric: true},

    { text: 'Status', value: 'status'},
    { text: '', value: 'current_state_message', minWidth: '33.5px'},
    { text: 'Order', value: 'order'},

    { text: '', value: 'date_requested_diff'},
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
    'successful': false,
    'message': ''
});

let paramsComputed = computed(() => {
    return {
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        filters: {
            account_id: selectedAssociatedCompanyAccountId.value,
            associated_companies: [selectedAssociatedCompanyId.value],
            user_ids: [user.value?.id],
            show_only_current_state: true
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

const approvalStatesExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyAccountId.value|| !selectedAssociatedCompanyId.value){
        return;
    }

    approvalStatesPending.value = true;

    await laraFetch(`/api/user-approval-states`, {
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

                return {
                    ...approvalState,
                    isSelectable: isAwaitingForApproval && (selfIsApprover)
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
                            'cell': ['request_number', 'status'],
                            'value': shade
                        }
                    }
                };
            });
        }
    }, false);
}
approvalStatesExecute();

const listApprovalStates = () => {
    selectedApprovalStates.value = [];
    selectedApprovalStatesProxy.value = [];
    approvalStatesExecute();
}

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
    requestableIsApprovable.value = true;
    showRequestable.value = true;
}

const createRequestableWorkFlow = ref(false);
const requestableWorkFlowAction = ref(APPROVAL_ACTION.NOT_SPECIFIED);

const applyApprovalWorkFlow = (action: number) => {

    if(action == APPROVAL_ACTION.NOT_SPECIFIED) return;

    requestableWorkFlowAction.value = action;
    createRequestableWorkFlow.value = true;
}

const applyApprovalWorkFlowFromViewable = (action: number, preSelectedApprovalStates: ApprovalStateWorkFlowPayloadT[]) => {

    selectedApprovalStatesProxy.value = preSelectedApprovalStates;
    requestableWorkFlowAction.value = action;
    createRequestableWorkFlow.value = true;
}


const requestableWorkFlowResolved = () => {

    listApprovalStates();
}
</script>

<style scoped>

</style>