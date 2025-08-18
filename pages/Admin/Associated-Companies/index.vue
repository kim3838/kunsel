<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Account" />
                            <MultiSelect glint drop-shadow :selection-max-viewable-line="5" :size="'md'" :options="associatedAccountOptions" :icon="'ic:baseline-all-inbox'"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Search" />
                            <Input :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search" type="text" autocomplete="off"/>
                        </div>
                    </div>

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                    </div>

                    <div>
                        <PageInformation :pagination="companies.meta.pagination" :pending="companiesPending"/>
                        <Pagination :size="'lg'" :pagination="companies.meta.pagination" :pending="companiesPending" v-model="pageComputed"/>
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
                            :to="`/admin/associated-companies/create-company`">
                            <Button class="w-min" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="disableActions ? 'Please wait' : ''"></Button>
                        </NuxtLink>
                    </div>

                    <div class="mx-auto max-w-screen-2xl flex flex-row flex-wrap gap-4">

                        <div v-for="company in companies.data" :key="company.id" class="scaffold-border p-4 space-y-4">
                            <div>
                                <NuxtLink
                                    :to="`/admin/associated-companies/${company.ulid}`">
                                    <div class="text-lg font-medium font-header cursor-pointer hover:underline">{{company.name}}</div>
                                </NuxtLink>
                            </div>

                            <table class="border-separate font-sans">
                                <tbody>
                                    <tr><td class="">Account #:</td><td class="pl-2 font-semibold">{{ _get(company, 'account_number', null) }}</td></tr>
                                    <tr><td class="">Code:</td><td class="pl-2 font-semibold">{{ _get(company, 'code', null) }}</td></tr>
                                    <tr><td class="">Country:</td><td class="pl-2">{{ _get(company, 'country', null) }}</td></tr>
                                    <tr><td class="">Currency:</td><td class="pl-2">{{ _get(company, 'currency', null) }}</td></tr>
                                    <tr><td class="">Timezone:</td><td class="pl-2">{{ _get(company, 'timezone', null) }}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableMeta, TableHeaderT, TableRowT} from "@/public/js/types/data";

definePageMeta({middleware: ['auth', 'admin-in-any-company']});
useLayout().setNavigationMode('solid');
const user = userState();

const companies = reactive<{
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
const associatedAccountOptions = reactive({
    search: '',
    selection: [],
    selected: []
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
            'search': filters.search.keyword,
            'assignment_type': [COMPANY_ASSIGNMENT_TYPE.ADMIN],
            'account_id': associatedAccountOptions.selected
        }
    };
});

const companiesPending = ref(false);
const selectedCompanies = ref([]);
const companiesExecute = async () => {

    if(import.meta.server){return;}

    companiesPending.value = true;

    await laraFetch("/api/associated-companies", {
        method: 'GET',
        params: paramsComputed.value
    },{
        onRequestError: () => {
            companiesPending.value = false;
        },
        onResponse: () => {
            companiesPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            companies.data = _get(response, '_data.values.data', []);
            companies.meta = _get(response, '_data.values.meta', {
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
await companiesExecute();
const fetchAssociatedAccounts = async() => {

    await laraFetch("/api/associated-account-selections", {
        method: 'GET',
        params: {
            filters: {
                user_id: user?.value?.id,
                assignment_type: [COMPANY_ASSIGNMENT_TYPE.ADMIN],
            }
        }
    }, {
        onSuccessResponse: async (request, options, response) => {
            associatedAccountOptions.selection = _get(response, '_data.values.selection', []);
        }
    })
}
await fetchAssociatedAccounts();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedCompanies.value = [];
    }

    if(filters.page === page){
        companiesExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const disableActions = computed(() => {
    return companiesPending.value;
});
const disableDataTable = computed(() => {
    return companiesPending.value;
});
</script>

<style scoped>

</style>