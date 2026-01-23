<template>
    <div>
        <ViewRequestable
            v-model:view-requestable="showRequestable"
            v-model:requestable-payload="requestablePayload"/>

        <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-6">
            <div v-if="userFiledRequests.successful" class="scaffold-border px-2 text-sm font-[National_Park]">
                <span><span class="font-semibold">{{selectedUserFiledRequests.length}}</span> Selected</span>
            </div>
            <Button
                v-if="userFiledRequests.successful && selectedUserFiledRequests.length"
                :variant="'outline'"
                :size="'xs'"
                :icon="'tdesign:close'"
                :disabled="disableActions"
                :label="'Clear selection'"
                @click="selectedUserFiledRequests = []; selectedUserFiledRequestsProxy = []" />
            <Button
                v-if="userFiledRequests.successful && selectedUserFiledRequests.length"
                :variant="'outline'"
                :size="'xs'"
                :icon="'mdi:delete-outline'"
                :disabled="disableActions"
                :label="`Delete ${selectedUserFiledRequests.length}`"
                @click="confirmDeleteSelected" />
            <Button
                :variant="'outline'"
                :size="'xs'"
                :icon="'ic:sharp-restart-alt'"
                :disabled="disableActions"
                :label="'Reload'"
                @click="paginate(1, true)" />
            <Label v-if="!userFiledRequests.successful" invert :size="'md'" :type="'danger'" :label="userFiledRequests.message" />
            <label v-if="userFiledRequests.successful" class="flex items-center">
                <Checkbox
                    :disabled="disableActions"
                    name="remember"
                    v-model="showOnlyPending"
                    :size="'sm'"
                    :label="'Show Only Pending'" />
            </label>
            <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'sm'" :label="'Please wait...'"/>
        </div>

        <div class="mb-2">
            <PageInformation :pagination="userFiledRequests.meta.pagination" :pending="disableDataTable"/>
            <div class="flex items-center gap-2">
                <Pagination :size="'md'" :pagination="userFiledRequests.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
            </div>
        </div>

        <DataTable
            v-if="userFiledRequests.successful"
            :headers="userFiledRequestsHeaders"
            :size="'md'"
            :stripped="false"
            :rows="userFiledRequests.data"
            :disabled="disableDataTable"
            v-model="selectedUserFiledRequests"
            @selectionChanged="syncSelectedUserFiledRequestsProxy"
            selection>
            <template v-slot:cell.number="{cell,slot}">
                <div class="p-[3px] hover:underline cursor-pointer" @click="viewRequestable(cell)">{{cell.number}}</div>
            </template>
            <template v-slot:cell.status_summary="{cell,slot}">
                <div class="flex space-x-1 px-[0.3rem] items-center">
                    <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.status_summary?.text" />
                </div>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type {LabelTypeT} from "@/public/js/types/theme";
import type {DataTableSelectionActionT, DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {StringEnumInterface} from "@/public/js/common/type";
import type {FiledRequestT, RequestableIds, RequestablePayloadT} from "@/public/js/types/request-approval";
import {storeToRefs} from "pinia";

const {isAuthenticated} = useAuth();
const user = userState();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const {
    updatedAssociatedCompanyFlag,
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId,
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        paginate();
    }
});

const userFiledRequestsSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},

    {text: ''},
    {text: ''},
    {text: 'Status'},
]);

const userFiledRequestsHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},

    { text: 'Request #', value: 'number', isNumeric: true},

    { text: '', value: 'date_requested_diff'},
    { text: 'Status', value: 'status_summary'},
]);

const userFiledRequests = reactive<DataTableT>({
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
    attendanceSearch: {
        keyword: string,
        callback: ReturnType<typeof setTimeout> | number
    }
    search: {
        keyword: string,
        callback: ReturnType<typeof setTimeout> | number
    }
}>({
    page: 1,
    perPage: 10,
    attendanceSearch: {
        keyword: '',
        callback: 1
    },
    search: {
        keyword: '',
        callback: 1
    }
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

const requestApprovalStatusOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(REQUEST_APPROVAL_STATUS_NAME, REQUEST_APPROVAL_STATUS.PENDING as number),
        $enumerableOption(REQUEST_APPROVAL_STATUS_NAME, REQUEST_APPROVAL_STATUS.DECLINED as number),
        $enumerableOption(REQUEST_APPROVAL_STATUS_NAME, REQUEST_APPROVAL_STATUS.APPROVED as number),
    ],
    selected: []
});

const showOnlyPending = ref(true);

watch(() => {return showOnlyPending.value;}, (show) => {
    if(show){
        paginate(1, true)
    } else {
        paginate(1, true)
    }
})

let paramsComputed = computed(() => {

    let statuses = showOnlyPending.value ? [REQUEST_APPROVAL_STATUS.PENDING] : [];

    return {
        page: filters.page,
        perPage: filters.perPage,
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        filters: {
            account_id: selectedAssociatedCompanyAccountId.value,
            associated_companies: [selectedAssociatedCompanyId.value],
            user_ids: [user.value?.id],
            statuses: statuses,
        }
    };
});
const userFiledRequestsPending = ref(false)
const selectedUserFiledRequests = ref([]);
const deleting = ref(false);

const disableActions = computed(() => {
    return userFiledRequestsPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return userFiledRequestsPending.value || deleting.value || companyAssociationPendingState().value;
});

const userFiledRequestsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyAccountId.value|| !selectedAssociatedCompanyId.value){
        return;
    }

    userFiledRequestsPending.value = true;

    await laraFetch(`/api/user-filed-requests`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            userFiledRequestsPending.value = false;
        },
        onResponse: (request, options, response) => {
            userFiledRequestsPending.value = false;
            userFiledRequests.successful = _get(response, '_data.successful', false);
            userFiledRequests.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            userFiledRequests.data = _get(response, '_data.values.data', []).map((userFiledRequest: TableRowT) => {

                let statusSummary = _get(userFiledRequest, 'status_summary.value', 0);

                let shade = 'default';

                if(statusSummary == REQUEST_APPROVAL_STATUS.DECLINED){
                    shade = 'danger';
                } else if(statusSummary == REQUEST_APPROVAL_STATUS.APPROVED){
                    shade = 'success';
                }

                return {
                    ...userFiledRequest,
                    _payload: {
                        'label_shade': {
                            'cell': ['status_summary'],
                            'value': shade
                        }
                    }
                };
            });

            userFiledRequests.meta = _get(response, '_data.values.meta', {
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
userFiledRequestsExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedUserFiledRequests.value = [];
        selectedUserFiledRequestsProxy.value = [];
    }

    if(filters.page === page){
        userFiledRequestsExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const selectedUserFiledRequestsProxy = ref<FiledRequestT[]>([]);

const syncSelectedUserFiledRequestsProxy = (selectionPayload: DataTableSelectionActionT) => {

    if(selectionPayload.action == SELECTION_ACTION.REMOVE){

        let selectionPayloadString = selectionPayload.value as string[];

        _remove(selectedUserFiledRequestsProxy.value, (pool: FiledRequestT) => selectionPayloadString.includes(pool.id as string));
    }

    if(selectionPayload.action == SELECTION_ACTION.ADD){

        let filteredUserFiledRequestsData = userFiledRequests.data.filter((userFiledRequest: TableRowT) => {

            let filedRequest = userFiledRequest as FiledRequestT;
            let selectionPayloadString = selectionPayload.value as string[];
            let filedRequestIsSelected = selectionPayloadString.includes(filedRequest.id as string);
            let filedRequestIsNotYetInSelectedPool = _isEmpty(_find(selectedUserFiledRequestsProxy.value, {id: filedRequest.id}));

            return filedRequestIsSelected && filedRequestIsNotYetInSelectedPool;
        });

        selectedUserFiledRequestsProxy.value.push(...filteredUserFiledRequestsData.map((userFiledRequest: TableRowT) => {

            let filedRequest = userFiledRequest as FiledRequestT;

            return {
                id: filedRequest.id,
                requestable_type: filedRequest.requestable_type,
                requestable_id: filedRequest.requestable_id,
            }
        }));
    }
}

const confirmDeleteSelected = () => {

    const selectedIds = selectedUserFiledRequests.value;

    useNuxtApp().$promptStore.setPrompt({
        resetable: true,
        icon: null,
        title: 'Confirm Action',
        message: `Confirm delete selected request${selectedIds.length > 1 ? 's' : ''}?`,
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

    selectedIds = selectedUserFiledRequests.value;

    const requestables = selectedUserFiledRequestsProxy.value.reduce((acc: RequestableIds, { requestable_id, requestable_type }) => {
        acc[requestable_type] ??= [];
        acc[requestable_type].push(requestable_id);
        return acc;
    }, {});

    deleting.value = true;

    await laraFetch("/api/user-filed-requests", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            requestables: requestables,
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
                message: `Request${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedUserFiledRequests.value = [];
    await userFiledRequestsExecute();
}

const showRequestable = ref(false);
const requestablePayload = ref<RequestablePayloadT>({
    type: '',
    id: -1,
    number: '',
});

const viewRequestable = async (row: TableRowT) => {

    requestablePayload.value = {
        type: row.requestable_type,
        id: row.requestable_id,
        number: row.number,
    } as RequestablePayloadT;
    showRequestable.value = true;
}
</script>

<style scoped>

</style>