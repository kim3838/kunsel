<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <BreadCrumbs prefix-company :size="`sm`" />
                </form>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection, StringEnumInterface} from "@/public/js/common/type";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Salary Statements`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const {render} = dateTimePicker();
const clientReadyState = useClientReadyState();
const common = useCommon();
const coreStore = useCoreStore();
const formStore = nuxtApp.$formStore;
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        paginate();
    }
});

const salaryStatementsSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},

    {text: '', colspan: 2,  alignHeader: 'left'},

    {text: 'Approval', colspan: 4,  alignHeader: 'left'},

    {text: 'Approver', colspan: 5,  alignHeader: 'left'},

    {text: 'Approved by', colspan: 3,  alignHeader: 'left'},
]);

const salaryStatementsHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions', minWidth: '33px'},

    { text: 'Payroll #', value: 'number', isNumeric: true},
    { text: 'Status', value: 'status'},

    { text: 'Year', value: 'year'},
    { text: 'Month', value: 'month_readable'},

    { text: 'Frequency', value: 'pay_frequency'},
    { text: 'Sequence', value: 'frequency_sequence'},

    { text: 'Date', value: 'date_range_readable'},

    { text: 'Remarks', value: 'remarks'},
]);

const salaryStatements = reactive<DataTableT>({
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
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        filters: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_ids: [selectedAssociatedCompanyId.value],
            search: filters.search.keyword,
        }
    };
});
const salaryStatementsPending = ref(false)
const selectedSalaryStatements = ref([]);

const disableActions = computed(() => {
    return salaryStatementsPending.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return salaryStatementsPending.value || companyAssociationPendingState().value;
});

const salaryStatementsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyAccountId.value|| !selectedAssociatedCompanyId.value){
        return;
    }

    salaryStatementsPending.value = true;

    await laraFetch(`/api/salary-statements`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            salaryStatementsPending.value = false;
        },
        onResponse: (request, options, response) => {
            salaryStatementsPending.value = false;
            salaryStatements.successful = _get(response, '_data.successful', false);
            salaryStatements.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            salaryStatements.data = _get(response, '_data.values.data', []);
            salaryStatements.meta = _get(response, '_data.values.meta', {
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
//salaryStatementsExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedSalaryStatements.value = [];
    }

    if(filters.page === page){
        salaryStatementsExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});
</script>

<style scoped>

</style>