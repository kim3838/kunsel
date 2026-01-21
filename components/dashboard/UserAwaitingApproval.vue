<template>
    <div>
        <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-6">
            <div v-if="approvalStates.successful" class="scaffold-border px-2 text-sm font-[National_Park]">
                <span><span class="font-semibold">{{selectedApprovalStates.length}}</span> Selected</span>
            </div>
            <Button
                v-if="approvalStates.successful"
                :variant="'outline'"
                :size="'xs'"
                :icon="'tdesign:close'"
                :disabled="disableActions"
                :label="'Clear selection'"
                @click="selectedApprovalStates = []" />
            <Button
                :variant="'outline'"
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
            :rows="approvalStates.data"
            :disabled="disableDataTable"
            v-model="selectedApprovalStates"
            selection>

            <template v-slot:cell.request_number="{cell,slot}">
                <div class="p-[3px]">{{cell.requestable.number}}</div>
            </template>

            <template v-slot:cell.status="{cell,slot}">
                <div class="flex space-x-1 px-[0.3rem] items-center">
                    <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.status?.text" />
                </div>
            </template>
            <template v-slot:cell.date_requested="{cell,slot}">
                <div class="p-[3px]">{{cell.requestable.date_requested}}</div>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type {LabelTypeT} from "@/public/js/types/theme";
import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import {storeToRefs} from "pinia";

const {isAuthenticated, userIsSuperAdmin} = useAuth();
const user = userState();
const nuxtApp = useNuxtApp();
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

    {text: 'Approval', colspan: 3,  alignHeader: 'left'},

    {text: '', colspan: 1,  alignHeader: 'left'},
]);

const approvalStatesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},

    { text: 'Request #', value: 'request_number', isNumeric: true},

    { text: 'Order', value: 'order'},
    { text: 'Status', value: 'status'},
    { text: '', value: 'current_state_message', minWidth: '60.84px'},

    { text: 'Request Date', value: 'date_requested'},
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
                            'cell': ['status'],
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
    approvalStatesExecute();
}
</script>

<style scoped>

</style>