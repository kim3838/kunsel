<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search" type="text"/>
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
                        <PageInformation :pagination="accounts.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="accounts.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </form>

                <div class="px-[20px]">
                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                        <NuxtLink
                            v-else
                            :to="`/admin/accounts/create-account`">
                            <Button class="w-min" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="disableActions ? 'Please wait' : ''"></Button>
                        </NuxtLink>
                    </div>

                    <div v-if="!accounts.successful" class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Label invert :size="'md'" :type="'danger'" :label="accounts.message" />
                    </div>

                    <div v-if="accounts.successful && viewMode.selected == DATA_VIEW_MODE.FLEX" class="flex flex-row flex-wrap gap-4">

                        <div v-for="account in accounts.data" :key="account.id" class="scaffold-border p-4 space-y-2">

                            <div>
                                <InputLabel :size="'sm'" value="Account #" />
                                <div class="text-lg font-sans cursor-pointer hover:underline">
                                    <NuxtLink :to="`/admin/accounts/${account.ulid}`">
                                        <span>{{account.number}}</span>
                                    </NuxtLink>
                                </div>
                            </div>

                            <div class="space-y-2">

                                <div class="grid grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel :size="'sm'" value="Email" />
                                        <div>{{account.email}}</div>
                                    </div>
                                    <div>
                                        <InputLabel :size="'sm'" value="Date registered" />
                                        <div>{{account.date_registered}}</div>
                                    </div>
                                </div>

                                <table class="border-separate">
                                    <tbody>
                                        <tr><td colspan="2">Subscriptions:</td></tr>
                                        <tr><td colspan="2">
                                            <div v-for="subscription in account.subscriptions" class="flex flex-row items-center gap-4">
                                                <UnorderedList
                                                    :icon="'ic:sharp-radio-button-checked'"
                                                    :label="subscription.module.text" />

                                                <div class="text-sm font-[STIX_Two_Text]">{{subscription.plan.text}}</div>
                                            </div>
                                        </td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <DataTable
                        v-if="accounts.successful && viewMode.selected == DATA_VIEW_MODE.LIST"
                        :headers="accountsHeaders"
                        :size="'lg'"
                        :rows="accounts.data"
                        :disabled="disableDataTable"
                        v-model="selectedAccounts"
                        selection>
                        <template v-slot:cell.actions="{cell,slot}">
                            <div class="flex items-center">
                                <NavDrop
                                    class="z-10"
                                    :disabled="disableActions"
                                    :parent-icon="'ic:baseline-arrow-right'"
                                    in-horizontal-scrollable
                                    :size="`sm`"
                                    :drop-shadow-size="`lg`"
                                    :title="'Menu'"
                                    :drop-align="'top'"
                                    :drop-justify="'right'"
                                    :drop-options="[
                                        {type: 'link',icon: 'mdi:pen',title: 'Edit',to: `/admin/accounts/${cell.ulid}`},
                                    ]">
                                </NavDrop>
                            </div>
                        </template>
                    </DataTable>
                </div>

            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection} from "@/public/js/common/type";
import type {AccountT} from "@/public/js/types/account";

useHead({titleTemplate: (titleChunk) => {return `Accounts`}});
definePageMeta({middleware: ['auth', 'super-admin']});
useLayout().setNavigationMode('solid');

const accountsHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'actions'},
    { text: 'Account #', value: 'number', alignData: 'left'},
    { text: 'Email', value: 'email', alignData: 'left'},
    { text: 'Date Registered', value: 'date_registered', alignData: 'left'},
]);

const accounts = reactive<DataTableT>({
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
            'search': filters.search.keyword,
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
        onResponse: (request, options, response) => {
            accountsPending.value = false;
            accounts.successful = _get(response, '_data.successful', false);
            accounts.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            accounts.data = _get(response, '_data.values.data', []) as AccountT[];
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
    }, false);
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