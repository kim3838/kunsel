<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-lg">

                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
                        <div class="col-span-full md:col-span-2">
                            <InputLabel :size="'sm'" value="Account" />
                            <SingleSelect :disabled="disableActions" glint drop-shadow :selection-max-viewable-line="5" value-persist :size="'md'" :options="accountOptions" :icon="'tdesign:component-checkbox'" @valueChange="selectedAccountChanged"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search" type="text"/>
                        </div>
                        <div class="flex flex-col">
                            <div class="flex-none h-[1.25rem]"></div>
                            <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        </div>
                    </div>
                </form>

                <div class="px-[20px] space-y-2">
                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[disableActions ? 'pointer-events-none' : '']">
                        <NuxtLink
                            v-if="companies.successful"
                            :to="`/admin/associated-companies/create-company`">
                            <Button class="w-min" :disabled="disableActions" :size="'sm'" :icon="'mdi:plus'"></Button>
                        </NuxtLink>
                        <Label v-if="!companies.successful" invert :size="'md'" :type="'danger'" :label="companies.message" />
                    </div>

                    <div v-if="companies.successful" class="mx-auto max-w-screen-2xl flex flex-row flex-wrap gap-4">

                        <div v-for="company in companies.data" :key="company.id" class="neutral-border p-4 space-y-4 tint-background">
                            <div>
                                <NuxtLink
                                    :class="[disableActions ? 'pointer-events-none' : '']"
                                    :to="`/admin/associated-companies/${company.ulid}`">
                                    <div class="text-lg font-medium font-header cursor-pointer hover:underline">{{company.name}}</div>
                                </NuxtLink>
                                <div class="text-base font-sans">{{company.short_name}}</div>
                            </div>

                            <div class="grid grid-cols-3 gap-6">
                                <div>
                                    <InputLabel :size="'sm'" value="Code" />
                                    <div class="label-value text-base font-sans">{{ _get(company, 'code', null) }}</div>
                                </div>
                                <div class="col-span-2">
                                    <InputLabel :size="'sm'" value="Account #" />
                                    <div class="label-value text-base font-medium font-sans">{{ _get(company, 'account_number', null) }}</div>
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="Country" />
                                    <div class="label-value text-sm font-sans">{{ _get(company, 'country', null) }}</div>
                                </div>
                                <div class="col-span-2">
                                    <InputLabel :size="'sm'" value="Address" />
                                    <div class="label-value text-sm font-sans">{{ _get(company, 'address_line_1', null) }}</div>
                                    <div class="label-value text-sm font-sans">{{ _get(company, 'address_line_2', null) }}</div>
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="Currency" />
                                    <div class="label-value text-sm font-sans">{{ _get(company, 'currency', null) }}</div>
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="Timezone" />
                                    <div class="label-value text-sm font-sans">{{ _get(company, 'timezone', null) }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <PageInformation :pagination="companies.meta.pagination" :pending="companiesPending"/>
                        <Pagination :size="'lg'" :pagination="companies.meta.pagination" :pending="companiesPending" v-model="pageComputed"/>
                    </div>
                </div>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT} from "@/public/js/types/data";
import type {SelectDataType} from "@/public/js/types/form";
import type {EnumSelection} from "@/public/js/common/type";

useHead({titleTemplate: (titleChunk) => {return `Companies`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-in-any-company']});
useLayout().setNavigationMode('solid');

const user = userState();
const {persistAccount, storePersistAccount} = useAccount();

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
const accountOptions = reactive<{
    search: string,
    selection: EnumSelection,
    selected: string | number | null
}>({
    search: '',
    selection: [],
    selected: null
});

const fetchAssociatedAccounts = async() => {

    await laraFetch("/api/associated-account-selections", {
        method: 'GET',
        params: {
            filters: {
                user_id: user?.value?.id,
                assignment_types: [COMPANY_ASSIGNMENT_TYPE.ADMIN],
            }
        }
    }, {
        onSuccessResponse: async (request, options, response) => {
            accountOptions.selection = _get(response, '_data.values.selection', []);

            if(accountOptions.selection.map((item: SelectDataType) => item.value).indexOf(persistAccount.value as number) >= 0){
                accountOptions.selected = persistAccount.value as number;
            } else {
                accountOptions.selected = accountOptions.selection[0]?.value ?? null;
                storePersistAccount(accountOptions.selected as number);
            }
        }
    })
}
await fetchAssociatedAccounts();

const selectedAccountChanged = async (selectedAccount: SelectDataType) => {

    companiesPending.value = true;

    storePersistAccount(accountOptions.selected as number);

    await companiesExecute();
}

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
        account_id: accountOptions.selected,
        filters: {
            'user_id': user?.value?.id,
            'search': filters.search.keyword,
            'assignment_types': [COMPANY_ASSIGNMENT_TYPE.ADMIN],
            'account_ids': [accountOptions.selected]
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