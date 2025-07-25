<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Account Type" />
                            <MultiSelect glint drop-shadow :selection-max-viewable-line="5" :size="'md'" :options="accountTypeOptions" :icon="'mdi:checkbook'"/>
                        </div>
                    </div>

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                    </div>

                    <div>
                        <PageInformation v-if="accounts.meta.pagination.total > 0" :pagination="accounts.meta.pagination" :no-record-label="'No Record Found'"/>
                        <Pagination :size="'lg'" :pagination="accounts.meta.pagination" :pending="accountsPending" v-model="pageComputed"/>
                    </div>
                </form>

                <FansyFrame>
                    <template v-slot:content>
                        <UnorderedList
                            v-if="disableActions"
                            :icon="'eos-icons:loading'"
                            :size="'md'"
                            :label="'Please wait...'"/>
                        <DataTable
                            :headers="accountsHeaders"
                            :size="'lg'"
                            :rows="accounts.data"
                            :disabled="disableDataTable"
                            v-model="selectedAccounts"
                            selection>
                            <template v-slot:cell.type="{cell,slot}">
                                <div class="p-[3px]">{{cell.type.text}}</div>
                            </template>
                        </DataTable>
                    </template>
                </FansyFrame>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableMeta, TableHeaderT, TableRowT} from "@/public/js/types/data";

definePageMeta({middleware: ['auth', 'admin-in-any-company']});
useLayout().setNavigationMode('solid');
const user = userState();

const accountsHeaders = reactive<TableHeaderT[]>([
    { text: 'Account #', value: 'number', alignData: 'left'},
    { text: 'Type', value: 'type', alignData: 'left'},
    { text: 'Date Registered', value: 'date_registered', alignData: 'left'},
]);

const accountTypeOptions = reactive({
    search: '',
    selection: [
        {text : 'Standard', value: ACCOUNT_TYPE.STANDARD},
        {text : 'Corporate', value: ACCOUNT_TYPE.CORPORATE},
    ],
    selected: []
});

const accounts = reactive<{
    data: TableRowT[];
    meta: DataTableMeta
}>({
    'data': [],
    'meta': {
        pagination: {
            total: 0,
            count: 0,
            per_page: 0,
            current_page: 0,
            total_pages: 0
        }
    }
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
    perPage: 10,
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
let paramsComputed = computed(() => {
    return {
        page: filters.page,
        perPage: filters.perPage,
        filters: {
            'user_id': user?.value?.id,
            'assignment_type': [COMPANY_ASSIGNMENT_TYPE.ADMIN],
            'account_type': accountTypeOptions.selected
        }
    };
});

const accountsPending = ref(false);
const selectedAccounts = ref([]);
const accountsExecute = async () => {
    accountsPending.value = true;

    await laraFetch("/api/associated-accounts", {
        method: 'GET',
        params: paramsComputed.value
    },{
        onRequestError: () => {
            accountsPending.value = false;
        },
        onResponse: () => {
            accountsPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            accounts.data = _get(response, '_data.values.data', []);
            accounts.meta = _get(response, '_data.values.meta', {
                pagination: {
                    total: 0,
                    count: 0,
                    per_page: 0,
                    current_page: 0,
                    total_pages: 0
                }
            });
        }
    });
}
await accountsExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedAccounts.value = [];
    }

    if(filters.page === page){
        accountsExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const disableActions = computed(() => {
    return accountsPending.value;
});
const disableDataTable = computed(() => {
    return accountsPending.value;
});
</script>

<style scoped>

</style>