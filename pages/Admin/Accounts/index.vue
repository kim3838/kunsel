<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Account Type" />
                            <MultiSelect glint drop-shadow :selection-max-viewable-line="5" :size="'md'" :options="accountPlanOptions" :icon="'tdesign:component-checkbox'"/>
                        </div>
                    </div>

                    <div class="flex flex-row flex-wrap gap-2">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        <RadioGroup
                            class="scaffold-border px-2"
                            :disabled="disableActions"
                            :selections="viewMode.selection"
                            :size="'md'"
                            :orientation="'horizontal'"
                            v-model="viewMode.selected" />
                    </div>

                    <div>
                        <PageInformation :pagination="accounts.meta.pagination" :pending="accountsPending"/>
                        <Pagination :size="'lg'" :pagination="accounts.meta.pagination" :pending="accountsPending" v-model="pageComputed"/>
                    </div>
                </form>

                <div class="px-[20px]">
                    <div class="mb-2 flex items-center min-h-8">
                        <UnorderedList
                            v-if="disableActions"
                            :icon="'eos-icons:loading'"
                            :size="'md'"
                            :label="'Please wait...'"/>
                        <NuxtLink
                            v-else
                            :to="`/admin/accounts/create-account`">
                            <Button class="w-min" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="disableActions ? 'Please wait' : ''"></Button>
                        </NuxtLink>
                    </div>

                    <div v-if="viewMode.selected == DATA_VIEW_MODE.FLEX" class="flex flex-row flex-wrap gap-4">

                        <div v-for="account in accounts.data" :key="account.id" class="scaffold-border p-4 space-y-2">

                            <div class="font-sans">
                                <div>
                                    Account ID:
                                </div>
                                <div class="text-lg font-header cursor-pointer hover:underline">
                                    <NuxtLink :to="`/admin/accounts/${account.ulid}`">
                                        <span>{{account.number}}</span>
                                    </NuxtLink>
                                </div>
                            </div>

                            <div class="space-y-2 font-sans">

                                <table class="border-separate font-sans">
                                    <tbody>
                                        <tr><td>Plan:</td><td class="pl-2">{{account.plan.text}}</td></tr>
                                        <tr><td>Date registered:</td><td class="pl-2">{{account.date_registered}}</td></tr>
                                    </tbody>
                                </table>

                                <div>
                                    <div class="mb-2">Subscriptions:</div>
                                    <UnorderedList
                                        v-for="subscription in account.subscriptions"
                                        :icon="'ic:sharp-radio-button-checked'"
                                        :label="subscription.module.text" />
                                </div>
                            </div>
                        </div>

                        <div v-if="noAccountRecords">
                            No Record Found.
                        </div>
                    </div>

                    <DataTable
                        v-if="viewMode.selected == DATA_VIEW_MODE.LIST"
                        :headers="accountsHeaders"
                        :size="'lg'"
                        :rows="accounts.data"
                        :disabled="disableDataTable"
                        v-model="selectedAccounts"
                        selection>
                        <template v-slot:cell.actions="{cell,slot}">
                            <div class="h-full mx-0.5 space-x-0.5 w-full flex items-center">
                                <NuxtLink
                                    :to="`/admin/accounts/${cell.ulid}`">
                                    <Button type="button" :icon="'material-symbols:lab-profile-sharp'" :size="slot.buttonSize" :label="''"></Button>
                                </NuxtLink>
                            </div>
                        </template>
                        <template v-slot:cell.plan="{cell,slot}">
                            <div class="p-[3px]">{{cell.plan.text}}</div>
                        </template>
                    </DataTable>
                </div>

            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableMeta, TableHeaderT, TableRowT} from "@/public/js/types/data";

definePageMeta({middleware: ['auth', 'super-admin']});
useLayout().setNavigationMode('solid');

const accountsHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'actions'},
    { text: 'Account #', value: 'number', alignData: 'left'},
    { text: 'Plan', value: 'plan', alignData: 'left'},
    { text: 'Date Registered', value: 'date_registered', alignData: 'left'},
]);

const accountPlanOptions = reactive({
    search: '',
    selection: [
        {text : 'Standard', value: ACCOUNT_PLAN.STANDARD},
        {text : 'Business', value: ACCOUNT_PLAN.BUSINESS},
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
const noAccountRecords = computed(() => {
    return accounts.meta.pagination.total === 0;
})
const viewMode = reactive<{
    selection: Array<{text: string, value: number}>;
    selected: number | null;
}>({
    selection: [
        {text : 'Flex', value: DATA_VIEW_MODE.FLEX},
        {text : 'List', value: DATA_VIEW_MODE.LIST},
    ],
    selected: DATA_VIEW_MODE.FLEX
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
            'account_plan': accountPlanOptions.selected
        }
    };
});

const accountsPending = ref(false);
const selectedAccounts = ref([]);
const accountsExecute = async () => {

    if(import.meta.server){return;}

    accountsPending.value = true;

    await laraFetch("/api/accounts", {
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