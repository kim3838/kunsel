<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        <RadioGroup
                            v-if="false"
                            class="scaffold-border px-2"
                            :disabled="disableActions"
                            :selections="viewMode.selection"
                            :size="'md'"
                            :orientation="'horizontal'"
                            v-model="viewMode.selected" />
                    </div>

                    <div>
                        <PageInformation :pagination="leaves.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="leaves.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </form>

                <div class="px-[20px] space-y-2">

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                        <Label v-if="!leaves.successful" invert :size="'md'" :type="'danger'" :label="leaves.message" />
                    </div>

                    <DataTable
                        v-if="leaves.successful"
                        :sup-headers="leavesSupHeaders"
                        :headers="leavesHeaders"
                        :size="'lg'"
                        :rows="leaves.data"
                        :disabled="disableDataTable"
                        v-model="selectedLeaves"
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
                            <div class="p-[3px]">{{cell.leave_type?.type?.text}}</div>
                        </template>
                        <template v-slot:cell.is_paid="{cell,slot}">
                            <div class="p-[3px]">{{cell.leave_type?.is_paid ? 'Yes' : 'No'}}</div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableSupHeaderT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection} from "@/public/js/common/type";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Leave`}});
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

const leavesSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: 'Employee', colspan: 2,  alignHeader: 'left'},
    {text: 'Leave Date', colspan: 1,  alignHeader: 'left'},
    {text: 'Leave Type', colspan: 4,  alignHeader: 'left'},
]);

const leavesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: 'Employee #', value: 'employee_number', alignData: 'left'},
    { text: 'Name', value: 'employee_full_name', alignData: 'left', minWidth: '200px'},

    { text: '', value: 'date', minWidth: '200px'},

    { text: 'Code', value: 'code', minWidth: '143px'},
    { text: 'Name', value: 'name', minWidth: '143px'},
    { text: 'Type', value: 'type', minWidth: '143px'},
    { text: 'Is Paid', value: 'is_paid', minWidth: '143px'},

]);

const leaves = reactive<DataTableT>({
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
    },
}>({
    page: 1,
    perPage: 25,
    search: {
        keyword: '',
        callback: 1
    },
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
const leavesPending = ref(false)
const selectedLeaves = ref([]);

const disableActions = computed(() => {
    return leavesPending.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return leavesPending.value || companyAssociationPendingState().value;
});
const leavesExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    leavesPending.value = true;

    await laraFetch(`/api/employee-portal-leaves`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            leavesPending.value = false;
        },
        onResponse: (request, options, response) => {
            leavesPending.value = false;
            leaves.successful = _get(response, '_data.successful', false);
            leaves.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            leaves.data = _get(response, '_data.values.data', [])
            leaves.meta = _get(response, '_data.values.meta', {
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
leavesExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedLeaves.value = [];
    }

    if(filters.page === page){
        leavesExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});
</script>

<style scoped>

</style>