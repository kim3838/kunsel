<template>
    <div>
        <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-6">
            <div v-if="userFiledRequests.successful" class="scaffold-border px-2 text-sm font-[National_Park]">
                <span><span class="font-semibold">{{selectedUserFiledRequests.length}}</span> Selected</span>
            </div>
            <Button
                v-if="userFiledRequests.successful"
                :variant="'outline'"
                :size="'xs'"
                :icon="'tdesign:close'"
                :disabled="disableActions"
                :label="'Clear selection'"
                @click="selectedUserFiledRequests = []" />
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
            selection>

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
import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {StringEnumInterface} from "@/public/js/common/type";
import {storeToRefs} from "pinia";

const {isAuthenticated, userIsSuperAdmin} = useAuth();
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
    {text: 'Status'},
    {text: ''},
    {text: ''},
]);

const userFiledRequestsHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},

    { text: 'Request #', value: 'number', isNumeric: true},

    { text: 'Status', value: 'status_summary'},
    { text: 'Request Date', value: 'date_requested'},
    { text: '', value: 'company_timezone'},
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

const disableActions = computed(() => {
    return userFiledRequestsPending.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return userFiledRequestsPending.value || companyAssociationPendingState().value;
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
    }

    if(filters.page === page){
        userFiledRequestsExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});
</script>

<style scoped>

</style>