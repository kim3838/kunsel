<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Date From"/>
                            <InputWithIcon :icon="'mdi:calendar-today-outline'" :id="'date_from'" readonly v-model="formStore.filters.attendanceDateFrom" :size="'md'" class="w-full" :override="{font_family_class: 'font-sans'}" :disabled="disableActions" />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Date To"/>
                            <InputWithIcon :icon="'mdi:calendar-outline'" :id="'date_to'" readonly v-model="formStore.filters.attendanceDateTo" :size="'md'" class="w-full" :override="{font_family_class: 'font-sans'}" :disabled="disableActions" />
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
                    </div>

                    <div>
                        <PageInformation :pagination="attendances.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="attendances.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </form>

                <div class="px-[20px]">

                    <div v-if="!attendances.successful" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Label invert :size="'md'" :type="'danger'" :label="attendances.message" />
                    </div>

                    <DataTable
                        v-if="attendances.successful"
                        :sup-headers="attendancesSupHeaders"
                        :headers="attendancesHeaders"
                        :size="'lg'"
                        :rows="attendances.data"
                        :disabled="disableDataTable"
                        v-model="selectedAttendances"
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
                                        {type: 'link', icon: 'ix:open-external', title: 'Details',to: `/${SUBSCRIPTION_MODULE.EMPLOYEE_PORTAL}/attendance/${cell.ulid}`},
                                        {type: 'action', icon: 'mdi:edit', title: 'Adjust Attendance',callback: () => {adjust(cell);}},
                                    ]">
                                </NavDrop>
                            </div>
                        </template>
                        <template v-slot:cell.employee_number="{cell,slot}">
                            <div class="p-[3px]">{{cell.employee.number}}</div>
                        </template>
                        <template v-slot:cell.employee_full_name="{cell,slot}">
                            <div class="p-[3px]">{{cell.employee.full_name}}</div>
                        </template>
                        <template v-slot:cell.shift_code="{cell,slot}">
                            <div class="p-[3px]">{{cell.shift.code}}</div>
                        </template>
                        <template v-slot:cell.shift_schedule_week_day_name="{cell,slot}">
                            <div class="p-[3px]">{{cell.shift_schedule.week_day_name}}</div>
                        </template>
                        <template v-slot:cell.shift_schedule_work_start="{cell,slot}">
                            <div class="p-[3px]">{{cell.shift_schedule.work_start}}</div>
                        </template>
                        <template v-slot:cell.shift_schedule_work_end="{cell,slot}">
                            <div class="p-[3px]">{{cell.shift_schedule.work_end}}</div>
                        </template>
                        <template v-slot:cell.status="{cell,slot}">
                            <div class="p-[3px]">{{cell.status.text}}</div>
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

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Attendance`}});
definePageMeta({middleware: ['auth', 'employee-of-selected-company']});
useLayout().setNavigationMode('solid');

const userCompanyEmployee = userCompanyEmployeeState();

const {isAuthenticated, userIsSuperAdmin} = useAuth();
const nuxtApp = useNuxtApp();
const {render} = dateTimePicker();
const clientReadyState = useClientReadyState();
const common = useCommon();
const formStore = nuxtApp.$formStore;
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

const attendancesSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},
    {text: 'Employee', colspan: 2,  alignHeader: 'left'},
    {text: 'Shift', colspan: 1,  alignHeader: 'left'},
    {text: 'Schedule', colspan: 3,  alignHeader: 'left'},
    {text: 'Attendance', colspan: 6,  alignHeader: 'left'},
]);

const attendancesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions'},
    { text: 'Employee #', value: 'employee_number', alignData: 'left'},
    { text: 'Name', value: 'employee_full_name', alignData: 'left'},

    { text: 'Code', value: 'shift_code', alignData: 'left'},

    { text: 'Week Day', value: 'shift_schedule_week_day_name', alignData: 'left'},
    { text: 'Start', value: 'shift_schedule_work_start', alignData: 'left'},
    { text: 'End', value: 'shift_schedule_work_end', alignData: 'left'},

    { text: 'Date', value: 'date', alignData: 'left'},
    { text: 'First In', value: 'first_in', alignData: 'left'},
    { text: 'Lunch Out', value: 'lunch_out', alignData: 'left'},
    { text: 'Lunch In', value: 'lunch_in', alignData: 'left'},
    { text: 'Last Out', value: 'last_out', alignData: 'left'},
    { text: 'Status', value: 'status', alignData: 'left'},
]);

const attendances = reactive<DataTableT>({
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
    perPage: 10,
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
        company_id: selectedAssociatedCompanyId.value,
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            employee_ulids: [userCompanyEmployee.value?.ulid],
            date_from: formStore.filters.attendanceDateFrom,
            date_to: formStore.filters.attendanceDateTo,
        }
    };
});
const attendancesPending = ref(false)
const selectedAttendances = ref([]);

const disableActions = computed(() => {
    return attendancesPending.value || attendanceAdjusting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return attendancesPending.value || companyAssociationPendingState().value;
});

const attendancesExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    attendancesPending.value = true;

    await laraFetch(`/api/attendances`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            attendancesPending.value = false;
        },
        onResponse: (request, options, response) => {
            attendancesPending.value = false;
            attendances.successful = _get(response, '_data.successful', false);
            attendances.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            attendances.data = _get(response, '_data.values.data', [])
            attendances.meta = _get(response, '_data.values.meta', {
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
await attendancesExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedAttendances.value = [];
    }

    if(filters.page === page){
        attendancesExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

let filtersDateTimePickers = ref([
    {
        id: 'date_from',
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            formStore.setFormFilterValue({
                key: 'attendanceDateFrom',
                value: payload.value
            });
        }
    }, {
        id: 'date_to',
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            formStore.setFormFilterValue({
                key: 'attendanceDateTo',
                value: payload.value
            });
        }
    }
]);

//Render date time pickers on navigate
if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(() => {
            render(filtersDateTimePickers.value);
        });
    });
}

//Render date time pickers on load
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            render(filtersDateTimePickers.value);
        });
    }
})

const stagedAttendance = ref<{
    'id': string | number | null,
    'ulid': string | null,
}>({
    'id': null,
    'ulid': null,
});

const attendanceAdjusting = ref(false);
const adjustPending = ref(false);
const adjustPayload = ref({});

const adjust = (cell: TableRowT) => {
    //adjustPayload.value = cell;
    //attendanceAdjusting.value = true;
}
</script>

<style scoped>

</style>