<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Account" />
                            <MultiSelect glint drop-shadow :selection-max-viewable-line="5" :size="'md'" :options="associatedAccountOptions" :icon="'mdi:checkbook'"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Search" />
                            <Input :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search" type="text" autocomplete="off"/>
                        </div>
                    </div>

                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                    </div>

                    <div>
                        <PageInformation v-if="companies.meta.pagination.total > 0" :pagination="companies.meta.pagination" :no-record-label="'No Record Found'"/>
                        <Pagination :size="'lg'" :pagination="companies.meta.pagination" :pending="companiesPending" v-model="pageComputed"/>
                    </div>
                </form>

                <FansyFrame>
                    <template v-slot:content>
                        <div class="mb-2 flex">
                            <NuxtLink
                                :to="`/admin/associated-companies/create-company`">
                                <Button class="w-min" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="disableActions ? 'Please wait' : ''"></Button>
                            </NuxtLink>
                        </div>
                        <UnorderedList
                            v-if="disableActions"
                            :icon="'eos-icons:loading'"
                            :size="'md'"
                            :label="'Please wait...'"/>
                        <DataTable
                            :headers="companiesHeaders"
                            :size="'lg'"
                            :rows="companies.data"
                            :disabled="disableDataTable"
                            v-model="selectedCompanies"
                            selection>
                            <template v-slot:cell.actions="{cell,slot}">
                                <div class="h-full mx-0.5 space-x-0.5 w-full flex items-center">
                                    <NuxtLink
                                        :to="`/admin/associated-companies/${cell.ulid}`">
                                        <Button type="button" :icon="'mdi:pen'" :size="slot.buttonSize" :label="''"></Button>
                                    </NuxtLink>
                                </div>
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

const companiesHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'actions'},
    { text: 'Account #', value: 'account_number', alignData: 'left'},
    { text: 'Name', value: 'name', alignData: 'left'},
    { text: 'Code', value: 'code', alignData: 'left'},
    { text: 'Timezone', value: 'timezone', alignData: 'left'},
]);

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
    data: [],
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
            let selection = _get(response, '_data.values.selection', []);
            associatedAccountOptions.data = selection;
            associatedAccountOptions.selection = selection;
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