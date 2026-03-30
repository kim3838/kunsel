<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div class="col-span-full md:col-span-2">
                            <InputLabel :size="'sm'" value="Account" />
                            <MultiSelect :disabled="disableActions" glint drop-shadow :selection-max-viewable-line="5" :size="'md'" :options="accountOptions" :icon="'tdesign:component-checkbox'"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search" type="text"/>
                        </div>
                    </div>

                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                    </div>
                </form>

                <div class="px-[20px] space-y-2">
                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[disableActions ? 'pointer-events-none' : '']">
                        <NuxtLink
                            v-if="companies.successful"
                            :to="`/admin/companies/create-company`">
                            <Button class="w-min" :disabled="disableActions" :size="'sm'" :icon="'mdi:plus'"></Button>
                        </NuxtLink>
                        <Label v-if="!companies.successful" invert :size="'md'" :type="'danger'" :label="companies.message" />
                    </div>

                    <DataTable
                        v-if="companies.successful"
                        :headers="companiesHeaders"
                        :size="'lg'"
                        :rows="companies.data"
                        :disabled="disableDataTable"
                        v-model="selectedCompanies"
                        selection>
                        <template v-slot:cell.actions="{cell,slot}">
                            <div class="flex items-center">
                                <NavDrop
                                    class="z-20"
                                    :disabled="disableActions"
                                    :parent-icon="'ic:baseline-arrow-right'"
                                    in-horizontal-scrollable
                                    :size="`sm`"
                                    :drop-shadow-size="`lg`"
                                    :title="'Menu'"
                                    :drop-align="'top'"
                                    :drop-justify="'right'"
                                    :active-style="`clear-fluid`"
                                    :drop-active-style="`clear-fluid`"
                                    :drop-options="[
                                        {type: 'link',icon: 'mdi:pen',title: 'Edit',to: `/admin/companies/${cell.ulid}`},
                                        {type: 'link',icon: 'ri:formula',title: 'Formulas',to: `/admin/company-formulas/${cell.ulid}`},
                                        {type: 'link',icon: 'tdesign:component-checkbox', title: 'Salary Statement Modules',to: `/admin/company-salary-statement-modules/${cell.ulid}`},
                                    ]">
                                    <template v-slot="{slot}">
                                        <div
                                            class="flex items-center pl-1 py-1 focus:outline-none">
                                            <span :class="[slot.headerFontClass, 'font-narrow-thin']">Menu</span>
                                            <Icon :class="[slot.dropDownIconClass]" :name="'ic:baseline-arrow-right'"/>
                                        </div>
                                    </template>
                                </NavDrop>
                            </div>
                        </template>
                    </DataTable>

                    <div>
                        <PageInformation :pagination="companies.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="companies.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </div>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT} from "@/public/js/types/data";

useHead({titleTemplate: (titleChunk) => {return `Companies`}});
definePageMeta({middleware: ['auth', 'super-admin']});
useLayout().setNavigationMode('solid');

const companiesHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'actions'},
    { text: 'Account #', value: 'account_number', alignData: 'left'},
    { text: 'Short Name', value: 'short_name', alignData: 'left'},
    { text: 'Name', value: 'name', alignData: 'left'},
    { text: 'Code', value: 'code', alignData: 'left'},
    { text: 'Address line 1', value: 'address_line_1', alignData: 'left'},
    { text: 'Address line 2', value: 'address_line_2', alignData: 'left'},
    { text: 'City', value: 'city', alignData: 'left'},
    { text: 'State', value: 'state', alignData: 'left'},
    { text: 'Postal Code', value: 'postal_code', alignData: 'left'},
    { text: 'Country', value: 'country', alignData: 'left'},
    { text: 'Currency', value: 'currency', alignData: 'left'},
    { text: 'Timezone', value: 'timezone', alignData: 'left'},
]);

const companies = reactive<DataTableT>({
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
const accountOptions = reactive({
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
            'search': filters.search.keyword,
            'account_ids': accountOptions.selected
        }
    };
});

const companiesPending = ref(false);
const selectedCompanies = ref([]);
const companiesExecute = async () => {

    if(import.meta.server){return;}

    companiesPending.value = true;

    await laraFetch("/api/companies", {
        method: 'GET',
        params: paramsComputed.value
    },{
        onRequestError: () => {
            companiesPending.value = false;
        },
        onResponse: (request, options, response) => {
            companiesPending.value = false;
            companies.successful = _get(response, '_data.successful', false);
            companies.message = _get(response, '_data.message', '');
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
    }, false);
}
await companiesExecute();
const fetchAccounts = async() => {

    await laraFetch("/api/account-selections", {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            accountOptions.selection = _get(response, '_data.values.selection', []);
        }
    })
}
await fetchAccounts();

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