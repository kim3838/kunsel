<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search Number" type="text"/>
                        </div>
                    </div>

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        <RadioGroup
                            class="scaffold-border px-2"
                            :disabled="disableActions"
                            :selections="viewMode.selection"
                            :size="'md'"
                            :orientation="'horizontal'"
                            v-model="viewMode.selected" />
                        <div v-if="false" class="h-8 flex flex-row items-center scaffold-border px-2">
                            <label class="flex items-center">
                                <Checkbox
                                    :disabled="disableActions"
                                    name="remember"
                                    v-model="showStatements"
                                    :size="'md'"
                                    :label="'Show statements'" />
                            </label>
                        </div>
                    </div>

                    <div>
                        <PageInformation :pagination="payrolls.meta.pagination" :pending="disableDataTable"/>
                        <div class="flex items-center gap-2">
                            <Pagination :size="'lg'" :pagination="payrolls.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                        </div>
                    </div>
                </form>

                <div class="px-[20px]">
                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                        <div v-if="payrolls.successful" class="scaffold-border px-2 font-[National_Park]">
                            <span><span class="font-semibold">{{selectedPayrolls.length}}</span> Selected</span>
                        </div>
                        <Button
                            v-if="payrolls.successful"
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'tdesign:close'"
                            :disabled="disableActions"
                            :label="'Clear selection'"
                            @click="selectedPayrolls = []; selectedPayrolls = []" />
                        <Label v-if="!payrolls.successful" invert :size="'md'" :type="'danger'" :label="payrolls.message" />
                    </div>

                    <DataTable
                        v-if="payrolls.successful"
                        :headers="payrollsHeaders"
                        :size="'lg'"
                        :rows="payrolls.data"
                        :disabled="disableDataTable"
                        v-model="selectedPayrolls"
                        selection>
                        <template v-slot:cell.actions="{cell,slot: cellSlot}">
                            <div class="flex items-center">
                                <NavDrop
                                    class="z-10"
                                    :disabled="disableActions"
                                    :parent-icon="'ic:baseline-arrow-right'"
                                    in-horizontal-scrollable
                                    divider
                                    :size="`sm`"
                                    :drop-shadow-size="`xl`"
                                    :title="'Menu'"
                                    :drop-align="'top'"
                                    :drop-justify="'right'"
                                    :drop-options="[
                                        {type: 'link', icon: 'ix:open-external', title: 'Salary statements', to: `/hr-payroll/payroll/history/${cell.ulid}`},
                                        {type: 'action', title: 'Submit for approval',callback: () => {}},
                                    ]">
                                </NavDrop>
                            </div>
                        </template>
                        <template v-slot:cell.number="{cell,slot}">
                            <div class="p-[3px] hover:underline cursor-pointer" @click="">{{cell.number}}</div>
                        </template>
                        <template v-slot:cell.status="{cell,slot}">
                            <div class="flex space-x-1 px-[0.3rem] items-center">
                                <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.status?.text" />
                            </div>
                        </template>
                        <template v-slot:cell.pay_frequency="{cell,slot}">
                            <div class="p-[3px]">{{cell.pay_frequency?.text}}</div>
                        </template>
                        <template v-slot:cell.frequency_sequence="{cell,slot}">
                            <div class="p-[3px]">{{cell.frequency_sequence?.text}}</div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection, StringEnumInterface} from "@/public/js/common/type";
import {storeToRefs} from "pinia";
import type {LabelTypeT} from "~/public/js/types/theme";

useHead({titleTemplate: (titleChunk) => {return `Payrolls`}});
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

const payrollsSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},

    {text: '', colspan: 2,  alignHeader: 'left'},

    {text: 'Approval', colspan: 4,  alignHeader: 'left'},

    {text: 'Approver', colspan: 5,  alignHeader: 'left'},

    {text: 'Approved by', colspan: 3,  alignHeader: 'left'},
]);

const payrollsHeaders = reactive<TableHeaderT[]>([
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

const payrolls = reactive<DataTableT>({
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

const payrollStatusOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(PAYROLL_STATUS_NAME, PAYROLL_STATUS.DRAFT as number),
    ],
    selected: []
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

const showStatements = ref(true);

watch(() => {return showStatements.value;}, (show) => {
    if(show){
        paginate(1, true)
    } else {
        paginate(1, true)
    }
})

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
const payrollsPending = ref(false)
const selectedPayrolls = ref([]);

const disableActions = computed(() => {
    return payrollsPending.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return payrollsPending.value || companyAssociationPendingState().value;
});

const payrollsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyAccountId.value|| !selectedAssociatedCompanyId.value){
        return;
    }

    payrollsPending.value = true;

    await laraFetch(`/api/payrolls`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            payrollsPending.value = false;
        },
        onResponse: (request, options, response) => {
            payrollsPending.value = false;
            payrolls.successful = _get(response, '_data.successful', false);
            payrolls.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            payrolls.data = _get(response, '_data.values.data', []).map((payroll: TableRowT) => {

                let statusSummary = _get(payroll, 'status.value', 0);

                let shade = 'info';

                if(statusSummary == PAYROLL_STATUS.DRAFT){
                    shade = 'clear';
                }

                return {
                    ...payroll,
                    _payload: {
                        'label_shade': {
                            'cell': ['number','status'],
                            'value': shade
                        }
                    }
                };
            });
            payrolls.meta = _get(response, '_data.values.meta', {
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
payrollsExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedPayrolls.value = [];
    }

    if(filters.page === page){
        payrollsExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});
</script>

<style scoped>

</style>