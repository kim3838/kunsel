<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
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
                        <PageInformation :pagination="leaveBalanceAdjustments.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="leaveBalanceAdjustments.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </form>

                <div class="px-[20px] space-y-2">

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                        <Label v-if="!leaveBalanceAdjustments.successful" invert :size="'md'" :type="'danger'" :label="leaveBalanceAdjustments.message" />
                    </div>

                    <DataTable
                        v-if="leaveBalanceAdjustments.successful"
                        :sup-headers="leaveBalanceAdjustmentsSupHeaders"
                        :headers="leaveBalanceAdjustmentsHeaders"
                        :size="'lg'"
                        :rows="leaveBalanceAdjustments.data"
                        :disabled="disableDataTable"
                        v-model="selectedLeaveBalanceAdjustments"
                        selection>
                        <template v-slot:cell.employee_number="{cell,slot}">
                            <div class="p-[3px]">{{cell.employee.number}}</div>
                        </template>
                        <template v-slot:cell.employee_full_name="{cell,slot}">
                            <div class="p-[3px]">{{cell.employee.full_name}}</div>
                        </template>
                        <template v-slot:cell.code="{cell,slot}">
                            <div class="p-[3px]">{{cell.leave_type?.code}}</div>
                        </template>
                        <template v-slot:cell.name="{cell,slot}">
                            <div class="p-[3px]">{{cell.leave_type?.name}}</div>
                        </template>
                        <template v-slot:cell.type="{cell,slot}">
                            <div class="p-[3px]">{{cell.type?.text}}</div>
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

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Leave Balance Adjustments`}});
definePageMeta({middleware: ['auth', 'employee-of-selected-company']});
useLayout().setNavigationMode('solid');

const userCompanyEmployee = userCompanyEmployeeState();

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        paginate();
    }
});

const leaveBalanceAdjustmentsSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: 'Employee', colspan: 2,  alignHeader: 'left'},
    {text: 'Leave Type', colspan: 2,  alignHeader: 'left'},
    {text: 'Leave Balance Adjustment', colspan: 4,  alignHeader: 'left'},
]);

const leaveBalanceAdjustmentsHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: 'Employee #', value: 'employee_number', alignData: 'left'},
    { text: 'Name', value: 'employee_full_name', alignData: 'left'},

    { text: 'Code', value: 'code'},
    { text: 'Name', value: 'name'},
    
    { text: 'Type', value: 'type'},
    { text: 'Effective Date', value: 'effective_date'},
    { text: 'Balance', value: 'balance', alignData: 'right'},
    { text: 'Remarks', value: 'remarks', alignData: 'left'},
]);

const leaveBalanceAdjustments = reactive<DataTableT>({
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
            company_id: selectedAssociatedCompanyId.value,
            employee_ulids: [userCompanyEmployee.value?.ulid],
        }
    };
});

const leaveBalanceAdjustmentsPending = ref(false)
const selectedLeaveBalanceAdjustments = ref([]);

const disableActions = computed(() => {
    return leaveBalanceAdjustmentsPending.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return leaveBalanceAdjustmentsPending.value || companyAssociationPendingState().value;
});
const leaveBalanceAdjustmentsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    leaveBalanceAdjustmentsPending.value = true;

    await laraFetch(`/api/employee-leave-balance-adjustments`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            leaveBalanceAdjustmentsPending.value = false;
        },
        onResponse: (request, options, response) => {
            leaveBalanceAdjustmentsPending.value = false;
            leaveBalanceAdjustments.successful = _get(response, '_data.successful', false);
            leaveBalanceAdjustments.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            leaveBalanceAdjustments.data = _get(response, '_data.values.data', [])
            leaveBalanceAdjustments.meta = _get(response, '_data.values.meta', {
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
await leaveBalanceAdjustmentsExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedLeaveBalanceAdjustments.value = [];
    }

    if(filters.page === page){
        leaveBalanceAdjustmentsExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

</script>

<style scoped>

</style>