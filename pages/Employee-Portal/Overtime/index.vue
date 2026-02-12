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
                        <PageInformation :pagination="overtimes.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="overtimes.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </form>

                <div class="px-[20px] space-y-2">

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                        <Label v-if="!overtimes.successful" invert :size="'md'" :type="'danger'" :label="overtimes.message" />
                    </div>

                    <DataTable
                        v-if="overtimes.successful"
                        :sup-headers="overtimesSupHeaders"
                        :headers="overtimesHeaders"
                        :size="'lg'"
                        :rows="overtimes.data"
                        :disabled="disableDataTable"
                        v-model="selectedOvertimes"
                        selection>
                        <template v-slot:cell.employee_number="{cell,slot}">
                            <div class="p-[3px]">{{cell.employee.number}}</div>
                        </template>
                        <template v-slot:cell.employee_full_name="{cell,slot}">
                            <div class="p-[3px]">{{cell.employee.full_name}}</div>
                        </template>
                        <template v-slot:cell.shift_max_overtime="{cell,slot}">
                            <div class="p-[3px]">{{cell.shift.max_overtime_readable}}</div>
                        </template>
                        <template v-slot:cell.shift_schedule_week_day_name="{cell,slot}">
                            <div class="p-[3px]">{{cell.shift_schedule.week_day_name}}</div>
                        </template>
                        <template v-slot:cell.shift_schedule_work_end="{cell,slot}">
                            <div class="p-[3px]">{{cell.shift_schedule.work_end}}</div>
                        </template>
                        <template v-slot:cell.date="{cell,slot}">
                            <div class="p-[3px]">{{cell.attendance.date}}</div>
                        </template>
                        <template v-slot:cell.last_out="{cell,slot}">
                            <div class="p-[3px]">{{cell.attendance.last_out}}</div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection} from "@/public/js/common/type";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Overtime`}});
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

const overtimesSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: 'Employee', colspan: 2,  alignHeader: 'left'},
    {text: 'Shift', colspan: 1,  alignHeader: 'left'},
    {text: 'Schedule', colspan: 2,  alignHeader: 'left'},
    {text: 'Attendance', colspan: 2,  alignHeader: 'left'},
    {text: 'Overtime', colspan: 3,  alignHeader: 'left'},
]);

const overtimesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: 'Employee #', value: 'employee_number', alignData: 'left'},
    { text: 'Name', value: 'employee_full_name', alignData: 'left'},

    { text: 'Max Overtime', value: 'shift_max_overtime', alignData: 'right'},

    { text: 'Week Day', value: 'shift_schedule_week_day_name', alignData: 'left'},
    { text: 'Work End', value: 'shift_schedule_work_end', alignData: 'right'},

    { text: 'Date', value: 'date', alignData: 'left'},
    { text: 'Last Out', value: 'last_out', alignData: 'left'},

    { text: 'Start', value: 'start', alignData: 'left'},
    { text: 'End', value: 'end', alignData: 'left'},
    { text: 'Duration', value: 'duration_readable', alignData: 'right'},
]);

const overtimes = reactive<DataTableT>({
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
const overtimesPending = ref(false)
const selectedOvertimes = ref([]);

const disableActions = computed(() => {
    return overtimesPending.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return overtimesPending.value || companyAssociationPendingState().value;
});
const overtimesExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    overtimesPending.value = true;

    await laraFetch(`/api/employee-portal-overtimes`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            overtimesPending.value = false;
        },
        onResponse: (request, options, response) => {
            overtimesPending.value = false;
            overtimes.successful = _get(response, '_data.successful', false);
            overtimes.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            overtimes.data = _get(response, '_data.values.data', [])
            overtimes.meta = _get(response, '_data.values.meta', {
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
overtimesExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedOvertimes.value = [];
    }

    if(filters.page === page){
        overtimesExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});
</script>

<style scoped>

</style>