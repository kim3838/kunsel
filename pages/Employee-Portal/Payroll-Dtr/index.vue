<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div class="col-span-2">
                            <InputLabel :size="'sm'" value="Payroll" />
                            <SingleSelectPaginated
                                :key="payrollSelectionsOptionsKey"
                                :selection-max-viewable-line="20"
                                :icon="'tdesign:component-checkbox'"
                                :disabled="disableActions"
                                glint
                                drop-shadow
                                :size="'md'"
                                :label="'Select payroll'"
                                :payload="payrollSelectionsOptions"
                            />
                        </div>
                        <div class="flex flex-col">
                            <div class="flex-none h-[1.25rem]"></div>
                            <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        </div>
                    </div>
                </form>

                <div class="px-[20px] space-y-2">

                    <div v-if="disableActions || !attendances.successful" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                        <Label v-if="!attendances.successful" invert :size="'md'" :type="'danger'" :label="attendances.message" />
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
                        <template v-slot:cell.employee_number="{cell,slot}">
                            <div class="p-[3px]">{{cell.employee?.number}}</div>
                        </template>
                        <template v-slot:cell.employee_full_name="{cell,slot}">
                            <div class="p-[3px]">{{cell.employee?.full_name}}</div>
                        </template>
                        <template v-slot:cell.shift_code="{cell,slot}">
                            <div class="p-[3px]">{{cell.shift?.code || '--'}}</div>
                        </template>
                        <template v-slot:cell.week_day_name="{cell,slot}">
                            <div v-if="cell.salary_statement_attendance" class="p-[3px]">{{cell.salary_statement_attendance?.week_day_name}}</div>
                            <div v-else class="p-[3px]">{{cell?.week_day_name}}</div>
                        </template>
                        <template v-slot:cell.shift_schedule_work_start="{cell,slot}">
                            <div class="p-[3px]">{{cell.shift_schedule?.work_start || '--'}}</div>
                        </template>
                        <template v-slot:cell.shift_schedule_work_end="{cell,slot}">
                            <div class="p-[3px]">{{cell.shift_schedule?.work_end || '--'}}</div>
                        </template>
                        <template v-slot:cell.date_readable="{cell,slot}">
                            <div class="p-[3px]">{{cell.date_readable}}</div>
                        </template>
                        <template v-slot:cell.first_in="{cell,slot}">
                            <div class="p-[3px]">{{cell.first_in || '--'}}</div>
                        </template>
                        <template v-slot:cell.lunch_out="{cell,slot}">
                            <div class="p-[3px]">{{cell.lunch_out || '--'}}</div>
                        </template>
                        <template v-slot:cell.lunch_in="{cell,slot}">
                            <div class="p-[3px]">{{cell.lunch_in || '--'}}</div>
                        </template>
                        <template v-slot:cell.last_out="{cell,slot}">
                            <div class="p-[3px]">{{cell.last_out || '--'}}</div>
                        </template>
                        <template v-slot:cell.day_status="{cell,slot}">
                            <div v-if="cell.salary_statement_attendance" class="flex space-x-1 px-[0.3rem] items-center">
                                <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.salary_statement_attendance?.status?.text" />
                            </div>
                        </template>
                        <template v-slot:cell.day_type="{cell,slot}">
                            <div v-if="cell.salary_statement_attendance" class="p-[3px]">{{cell.salary_statement_attendance?.day_type?.text}}</div>
                        </template>
                        <template v-slot:cell.payroll_number="{cell,slot}">
                            <div class="p-[3px]" :title="cell.payroll?.number">{{wordClamp(cell.payroll?.number, 42)}}</div>
                        </template>
                        <template v-slot:cell.payroll_status="{cell,slot}">
                            <div class="p-[3px]">{{cell.payroll?.status?.text}}</div>
                        </template>
                    </DataTable>

                    <div>
                        <PageInformation :pagination="attendances.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="attendances.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection} from "@/public/js/common/type";
import type {LabelTypeT} from "@/public/js/types/theme";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Payroll DTR`}});
definePageMeta({middleware: ['auth', 'employee-of-selected-company']});
useLayout().setNavigationMode('solid');

const userCompanyEmployee = userCompanyEmployeeState();

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const wordClamp = nuxtApp.$wordClamp as (text: string, length: number) => string;
const common = useCommon();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        rebuildSelections();
        paginate();
    }
});

const rebuildSelections = (selection: string[] = []) => {

    if(_isEmpty(selection) || selection.indexOf('payroll') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            payrollSelectionsOptions, payrollSelectionsOptionsKey, SELECT.SINGLE_PAGINATED, [], {
                filters: {
                    company_id: selectedAssociatedCompanyId.value,
                    employee_ids: [userCompanyEmployee.value?.id],
                    search: {
                        keyword: '',
                        callback: 1
                    }
                }
            }
        );
    }
}

const payrollSelectionsOptionsKey = shallowRef(0);
const payrollSelectionsOptions = reactive({
    fetch: {
        url: '/api/payroll-selections',
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            employee_ids: [userCompanyEmployee.value?.id],
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: null,
});


const attendancesSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: 'Shift', colspan: 1,  alignHeader: 'left'},
    {text: 'Schedule', colspan: 3,  alignHeader: 'left'},
    {text: '', colspan: 1,  alignHeader: 'left'},

    {text: 'Attendance', colspan: 4,  alignHeader: 'left'},

    {text: '', colspan: 2,  alignHeader: 'left'},

    {text: 'Payroll', colspan: 2,  alignHeader: 'left'},
]);

const attendancesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},

    { text: 'Code', value: 'shift_code', alignData: 'left'},

    { text: 'Week Day', value: 'week_day_name', alignData: 'left'},
    { text: 'Start', value: 'shift_schedule_work_start', alignData: 'left'},
    { text: 'End', value: 'shift_schedule_work_end', alignData: 'left'},

    { text: 'Date', value: 'date_readable', alignData: 'left'},

    { text: 'First In', value: 'first_in', alignData: 'left'},
    { text: 'Lunch Out', value: 'lunch_out', alignData: 'left'},
    { text: 'Lunch In', value: 'lunch_in', alignData: 'left'},
    { text: 'Last Out', value: 'last_out', alignData: 'left'},

    { text: 'Status', value: 'day_status', alignData: 'left'},
    { text: 'Type', value: 'day_type', alignData: 'left'},

    { text: '#', value: 'payroll_number', alignData: 'left'},
    { text: 'Status', value: 'payroll_status', alignData: 'left'},
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
    perPage: 25,
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
        company_id: selectedAssociatedCompanyId.value,
        payroll_id: payrollSelectionsOptions.selected,
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            employee_ulids: [userCompanyEmployee.value?.ulid],
            payroll_id: payrollSelectionsOptions.selected,
        }
    };
});
const attendancesPending = ref(false)
const selectedAttendances = ref([]);

const disableActions = computed(() => {
    return attendancesPending.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return attendancesPending.value || companyAssociationPendingState().value;
});

const attendancesExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    attendancesPending.value = true;

    await laraFetch(`/api/employee-portal-payroll-attendances`, {
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
            attendances.data = _get(response, '_data.values.data', []).map((attendance: TableRowT) => {

                let dayStatus = _get(attendance, 'salary_statement_attendance.status.value', 0);
                let dayType = _get(attendance, 'salary_statement_attendance.day_type.value', 0);

                let shade = 'clear';

                if([
                    SALARY_STATEMENT_ATTENDANCE_DAY_TYPE.DAY_OFF,
                ].indexOf(dayType) >= 0){
                    shade = 'default';
                }

                return {
                    ...attendance,
                    isSelectable: Boolean(attendance.ulid),
                    _payload: {
                        'label_shade': {
                            'cell': ['date_readable', 'day_status', 'day_type'],
                            'value': shade
                        }
                    }
                };
            });
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
attendancesExecute();

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

</script>

<style scoped>

</style>