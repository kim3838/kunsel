<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search Employee" type="text"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Date From"/>
                            <InputWithIcon :icon="'mdi:calendar-today-outline'" :id="'date_from'" readonly v-model="filters.dateFrom" :size="'md'" class="w-full" :override="{font_family_class: 'font-sans'}" />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Date To"/>
                            <InputWithIcon :icon="'mdi:calendar-outline'" :id="'date_to'" readonly v-model="filters.dateTo" :size="'md'" class="w-full" :override="{font_family_class: 'font-sans'}" />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Group" />
                            <MultiSelect :key="employeeGroupOptionsKey" glint drop-shadow :selection-max-viewable-line="15" :size="'md'" :options="employeeGroupOptions" :disabled="disableActions" :icon="'tdesign:component-checkbox'"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Department" />
                            <MultiSelect :key="departmentOptionsKey" glint drop-shadow :selection-max-viewable-line="15" :size="'md'" :options="departmentOptions" :disabled="disableActions" :icon="'ic:baseline-all-inbox'"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Designation" />
                            <MultiSelect :key="designationOptionsKey" glint drop-shadow :selection-max-viewable-line="15" :size="'md'" :options="designationOptions" :disabled="disableActions" :icon="'ic:baseline-inbox'"/>
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

                <DialogModal
                    :show="creatingOrEditing"
                    :max-width="'1024px'"
                    :closeable="false">
                    <template #title>

                    </template>
                    <template #content>
                        <div ref='modalContentContainer'>

                            <div class="px-5 pt-2 mx-auto max-w-screen-lg">
                                <div class="text-lg font-header">
                                    {{attendanceDate}}&nbsp;{{attendanceWeekday}} {{_get(editPayload, 'employee.number', '')}}&nbsp;{{_get(editPayload, 'employee.full_name', '')}}
                                </div>
                            </div>

                            <div class="p-3 pt-2 mx-auto max-w-screen-lg space-y-4">

                                <fieldset class="neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">Schedule</legend>

                                    <div class="mx-auto max-w-screen-lg grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5">
                                        <div class="col-span-2">
                                            <InputLabel :size="'md'" value="Work Period"/>
                                            <div class="text-lg">{{attendanceWorkPeriod}}</div>
                                            <Input v-if="false" v-model="attendanceWorkPeriod" readonly :size="'md'" />
                                        </div>
                                        <div v-if="attendanceShiftRequiresLunchOutAndIn">
                                            <InputLabel :size="'md'" value="Lunch Period"/>
                                            <div class="text-lg">{{attendanceLunchPeriod}}</div>
                                            <Input v-if="false" v-model="attendanceLunchPeriod" readonly :size="'md'" />
                                        </div>
                                        <div>
                                            <InputLabel :size="'md'" value="Total Schedule"/>
                                            <div class="text-lg">{{attendanceTotalSchedule}}</div>
                                            <Input v-if="false" v-model="attendanceTotalSchedule" readonly :size="'md'" />
                                        </div>
                                        <div>
                                            <InputLabel :size="'md'" value="Is Flexible"/>
                                            <div class="text-lg">{{attendanceIsFlexibleSchedule}}</div>
                                            <Input v-if="false" v-model="attendanceIsFlexibleSchedule" readonly :size="'md'" />
                                        </div>
                                    </div>
                                </fieldset>

                                <fieldset class="neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">Attendance</legend>

                                    <div class="mx-auto max-w-screen-lg grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                                        <div>
                                            <InputLabel :size="'sm'" value="First In"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions"
                                                high-light-all-text-on-focus
                                                @valueChanged="attendanceFirstInChanged"
                                                v-model="attendanceFirstIn"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`first_in`"
                                                :size="'md'" />
                                        </div>
                                        <div v-if="attendanceShiftRequiresLunchOutAndIn">
                                            <InputLabel :size="'sm'" value="Lunch Out"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions"
                                                high-light-all-text-on-focus
                                                @valueChanged="attendanceLunchOutChanged"
                                                v-model="attendanceLunchOut"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`lunch_out`"
                                                :size="'md'" />
                                        </div>
                                        <div v-if="attendanceShiftRequiresLunchOutAndIn">
                                            <InputLabel :size="'sm'" value="Lunch In"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions"
                                                high-light-all-text-on-focus
                                                @valueChanged="attendanceLunchInChanged"
                                                v-model="attendanceLunchIn"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`lunch_in`"
                                                :size="'md'" />
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Last Out"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions"
                                                high-light-all-text-on-focus
                                                @valueChanged="attendanceLastOutChanged"
                                                v-model="attendanceLastOut"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`last_out`"
                                                :size="'md'" />
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="mx-auto max-w-screen-lg">
                            <div class="flex space-x-2 justify-between">
                                <div class="space-x-2 inline-flex">
                                    <div class="space-x-2 inline-flex items-center">
                                        <UnorderedList
                                            v-if="modalSubmitPending"
                                            :icon="'eos-icons:loading'"
                                            :size="'md'"
                                            :label="'Please wait...'"/>
                                    </div>
                                </div>
                                <div class="space-x-2 inline-flex items-center">
                                    <Button
                                        class="w-min"
                                        :variant=" 'outline'"
                                        :size="'md'"
                                        :disabled="modalDisableActions"
                                        :icon="'mdi:cancel'"
                                        :label="'Cancel'"
                                        @click="closeModal"/>
                                    <Button
                                        class="w-min"
                                        :variant="'default'"
                                        :size="'md'"
                                        :icon="modalSubmitButtonIcon"
                                        :disabled="modalDisableActions"
                                        :label="modalSaveButtonLabel"
                                        @click="modalSubmit"/>
                                </div>
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="px-[20px]">
                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <div class="scaffold-border px-2 font-[National_Park]">
                            <span><span class="font-semibold">{{selectedAttendances.length}}</span> Selected</span>
                        </div>
                        <Button
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'tdesign:close'"
                            :disabled="disableActions"
                            :label="'Clear selection'"
                            @click="selectedAttendances = []" />
                        <Button
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'mdi:delete-outline'"
                            :disabled="disableActions"
                            :label="'Delete selected'"
                            @click="confirmDeleteSelected()" />
                    </div>

                    <DataTable
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
                                        {type: 'link', icon: 'ix:open-external', title: 'Details',to: `/workforce/attendance/${cell.ulid}`},
                                        {type: 'action', icon: 'mdi:edit', title: 'Edit Attendance',callback: () => {edit(cell);}},
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
import type {DataTableMeta, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection} from "@/public/js/common/type";
import {storeToRefs} from "pinia";

definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const {render} = dateTimePicker();
const clientReadyState = useClientReadyState();
const common = useCommon();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        rebuildSelections();
        paginate();
    }
});

const rebuildSelections = (selection: string[] = []) => {

    if(_isEmpty(selection) || selection.indexOf('employee_group') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            employeeGroupOptions, employeeGroupOptionsKey, SELECT.MULTI_STATIC, companyOrganizationSelections.value.employee_groups
        );
    }

    if(_isEmpty(selection) || selection.indexOf('department') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            departmentOptions, departmentOptionsKey, SELECT.MULTI_STATIC, companyOrganizationSelections.value.departments
        );
    }

    if(_isEmpty(selection) || selection.indexOf('designation') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            designationOptions, designationOptionsKey, SELECT.MULTI_STATIC, companyOrganizationSelections.value.designations
        );
    }
}

const attendancesSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},
    {text: ''},
    {text: 'Full name', alignHeader: 'left'},
    {text: 'Schedule', colspan: 3,  alignHeader: 'left'},
    {text: 'Attendance', colspan: 6,  alignHeader: 'left'},
]);

const attendancesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions'},
    { text: 'Employee #', value: 'employee_number', alignData: 'left'},
    { text: 'Family, Middle, Given', value: 'employee_full_name', alignData: 'left'},

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

const attendances = reactive<{
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
let filters = reactive<{
    page: number,
    perPage: number,
    search: {
        keyword: string,
        callback: ReturnType<typeof setTimeout> | number
    },
    dateFrom: string,
    dateTo: string,
}>({
    page: 1,
    perPage: 10,
    search: {
        keyword: '',
        callback: 1
    },
    dateFrom: nuxtApp.$moment().startOf('month').startOf('day').format('YYYY-MM-DD'),
    dateTo: nuxtApp.$moment().endOf('month').endOf('day').format('YYYY-MM-DD'),
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

//Employee Organization
const companyOrganizationSelections = companyOrganizationSelectionsState();
const employeeGroupOptionsKey = shallowRef(0);
const employeeGroupOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.employee_groups,
    selected: []
});
const departmentOptionsKey = shallowRef(0);
const departmentOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.departments,
    selected: []
});
const designationOptionsKey = shallowRef(0);
const designationOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.designations,
    selected: []
});
let paramsComputed = computed(() => {
    return {
        page: filters.page,
        perPage: filters.perPage,
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            date_from: filters.dateFrom,
            date_to: filters.dateTo,
            search: filters.search.keyword,
            assigned_employee_group_ids: employeeGroupOptions.selected,
            department_ids: departmentOptions.selected,
            designation_ids: designationOptions.selected,
        }
    };
});
const attendancesPending = ref(false)
const selectedAttendances = ref([]);
const deleting = ref(false);

const disableActions = computed(() => {
    return attendancesPending.value || createEditPending.value || deleting.value || companyAssociationPendingState().value;
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
        onResponse: () => {
            attendancesPending.value = false;
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
    }, true);
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
            filters.dateFrom = payload.value;
        }
    }, {
        id: 'date_to',
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            filters.dateTo = payload.value;
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

const confirmDeleteSelected = () => {

    if(selectedAttendances.value.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected attendance to delete.`,
            action: {
                callback: () => {},
                label: 'Okay'
            }
        });

        return false;
    }

    useNuxtApp().$promptStore.setPrompt({
        resetable: true,
        icon: null,
        title: 'Confirm Action',
        message: `Confirm delete selected attendance`,
        action: {
            callback: async () => {
                await deleteSelected();
            },
            label: 'Yes'
        }
    });
}
const deleteSelected = async () => {

    let selectedIds: number[] = [];

    selectedIds = selectedAttendances.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/attendances", {
        method: 'DELETE',
        body: {
            company_id: selectedAssociatedCompanyId.value,
            attendance_ids: selectedIds,
        },
    },{
        onRequestError: (request, options, error) => {
            deleting.value = false;
        },
        onResponse: () => {
            deleting.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: `Attendance deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedAttendances.value = [];
    await attendancesExecute();
}

const stagedAttendance = ref<{
    'id': string | number | null,
    'ulid': string | null,
}>({
    'id': null,
    'ulid': null,
});

const creatingOrEditing = ref(false);
const createEditPending = ref(false);
const editPayload = ref({});

const edit = (cell: TableRowT) => {
    editPayload.value = cell;
    creatingOrEditing.value = true;
}

const creatingAttendance = computed(() => {
    return stagedAttendance.value.id == null;
});

watch(creatingOrEditing, (creatingOrEditing)=>{
    if(creatingOrEditing){
        loadEditable();
    }
});

const attendanceWorkPeriod = ref('');
const attendanceLunchPeriod = ref('');
const attendanceTotalSchedule = ref('');
const attendanceWeekday = ref('');
const attendanceIsFlexibleSchedule = ref('');
const attendanceShiftRequiresLunchOutAndIn = ref(false);
const attendanceDate = ref('');
const attendanceFirstIn = ref('');
const attendanceLunchOut = ref('');
const attendanceLunchIn = ref('');
const attendanceLastOut = ref('');

const editableAttendanceDateTimePickers = ref([]);

const resetEditable = () => {
    stagedAttendance.value = {
        'id': null,
        'ulid': null,
    };
    editPayload.value = {};
    editableAttendanceDateTimePickers.value = [];
    attendanceWorkPeriod.value = '';
    attendanceLunchPeriod.value = '';
    attendanceTotalSchedule.value = '';
    attendanceWeekday.value = '';
    attendanceIsFlexibleSchedule.value = '';
    attendanceShiftRequiresLunchOutAndIn.value = false;
    attendanceDate.value = '';
    attendanceFirstIn.value = '';
    attendanceLunchOut.value = '';
    attendanceLunchIn.value = '';
    attendanceLastOut.value = '';
}

const attendanceFirstInChanged = (value: string) => {
    let dateValid = nuxtApp.$moment(value.trim(), "YYYY-MM-DD HH:mm:ss", true).isValid();

    if(!dateValid){
        attendanceFirstIn.value = nuxtApp.$moment().format("YYYY-MM-DD HH:mm:ss")
    }
}

const attendanceLunchOutChanged = (value: string) => {
    let dateValid = nuxtApp.$moment(value.trim(), "YYYY-MM-DD HH:mm:ss", true).isValid();

    if(!dateValid){
        attendanceLunchOut.value = nuxtApp.$moment().format("YYYY-MM-DD HH:mm:ss")
    }
}

const attendanceLunchInChanged = (value: string) => {
    let dateValid = nuxtApp.$moment(value.trim(), "YYYY-MM-DD HH:mm:ss", true).isValid();

    if(!dateValid){
        attendanceLunchIn.value = nuxtApp.$moment().format("YYYY-MM-DD HH:mm:ss")
    }
}

const attendanceLastOutChanged = (value: string) => {
    let dateValid = nuxtApp.$moment(value.trim(), "YYYY-MM-DD HH:mm:ss", true).isValid();

    if(!dateValid){
        attendanceLastOut.value = nuxtApp.$moment().format("YYYY-MM-DD HH:mm:ss")
    }
}


const loadEditable = () => {

    stagedAttendance.value = {
        'id': _get(editPayload.value, 'id', null),
        'ulid': _get(editPayload.value, 'ulid', null),
    };
    let shiftRequiresLunchOutAndIn = _get(editPayload.value, 'shift.require_lunch_time_in_and_out', false);
    let shiftIsFlexible = _get(editPayload.value, 'shift_schedule.is_flexible', false);
    editableAttendanceDateTimePickers.value = [];
    attendanceShiftRequiresLunchOutAndIn.value = shiftRequiresLunchOutAndIn && !shiftIsFlexible;
    
    attendanceWorkPeriod.value = _get(editPayload.value, 'shift_schedule.work_start', '') + ' - ' + _get(editPayload.value, 'shift_schedule.work_end', '') + '(' + _get(editPayload.value, 'shift_schedule.timezone', '')  + ')';
    attendanceLunchPeriod.value = attendanceShiftRequiresLunchOutAndIn.value ? (_get(editPayload.value, 'shift_schedule.lunch_break_start', '') + ' - ' + _get(editPayload.value, 'shift_schedule.lunch_break_end', '')) : '';
    attendanceTotalSchedule.value = _get(editPayload.value, 'shift_schedule.total_work_hours_with_breaks', '');
    attendanceWeekday.value = _get(editPayload.value, 'shift_schedule.week_day_name', '');
    attendanceIsFlexibleSchedule.value = shiftIsFlexible ? 'Yes' : 'No';

    attendanceDate.value = _get(editPayload.value, 'date', '');
    attendanceFirstIn.value = _get(editPayload.value, 'first_in', '');

    let attendanceDateTimePickers = [
        {
            id: 'first_in',
            type: 'datetime',
            selectedCallback: (payload: {value: string}) => {
                attendanceFirstIn.value = payload.value;
            }
        },
        ...(shiftRequiresLunchOutAndIn ? [
            {
                id: 'lunch_out',
                type: 'datetime',
                selectedCallback: (payload: {value: string}) => {
                    attendanceLunchOut.value = payload.value;
                }
            },{
                id: 'lunch_in',
                type: 'datetime',
                selectedCallback: (payload: {value: string}) => {
                    attendanceLunchIn.value = payload.value;
                }
            },
        ] : []),
        {
            id: 'last_out',
            type: 'datetime',
            selectedCallback: (payload: {value: string}) => {
                attendanceLastOut.value = payload.value;
            }
        },
    ];

    if(shiftRequiresLunchOutAndIn){
        attendanceLunchOut.value = _get(editPayload.value, 'lunch_out', '');
        attendanceLunchIn.value = _get(editPayload.value, 'lunch_in', '');
    }
    attendanceLastOut.value = _get(editPayload.value, 'last_out', '');

    let filtersAndAttendanceDatePickers = filtersDateTimePickers.value.concat(attendanceDateTimePickers);

    render(filtersAndAttendanceDatePickers);
};

const closeModal = () => {
    creatingOrEditing.value = false;
    resetEditable();
};

const modalDisableActions = computed(()=>{
    return modalSubmitPending.value;
});

const modalSubmitPending = ref(false);

const modalSubmitButtonIcon = computed(()=>{
    const ICON = {
        CREATE: 'mdi:plus',
        EDIT: 'ic:sharp-save'
    } as const;

    const isEditMode = !creatingAttendance.value;

    return isEditMode ? ICON.EDIT : ICON.CREATE;
});
const modalSaveButtonLabel = computed(()=>{
    const LABEL = {
        CREATE: `Create`,
        EDIT: `Save`
    } as const;

    const isEditMode = !creatingAttendance.value;

    return isEditMode ? LABEL.EDIT : LABEL.CREATE;
});

const modalSubmitPath = computed(() => {
    if(!creatingAttendance.value){
        return `/api/attendance/${stagedAttendance.value.ulid}`;
    } else {
        return `/api/attendance`
    }
});
const modalSubmitAction = computed(() => {
    if(!creatingAttendance.value){
        return `PATCH`;
    } else {
        return `POST`;
    }
});
const modalForm = computed(()=>{
    return {
        id: stagedAttendance.value.id,
        ulid: stagedAttendance.value.ulid,
        company_id: selectedAssociatedCompanyId.value,
        shift_id: _get(editPayload.value, 'shift.id', null),
        employee_id: _get(editPayload.value, 'employee_id', null),
        date: attendanceDate.value,
        first_in: nuxtApp.$moment(attendanceFirstIn.value).format("YYYY-MM-DD HH:mm"),
        ...(attendanceShiftRequiresLunchOutAndIn.value ? {
            lunch_out: nuxtApp.$moment(attendanceLunchOut.value).format("YYYY-MM-DD HH:mm"),
            lunch_in: nuxtApp.$moment(attendanceLunchIn.value).format("YYYY-MM-DD HH:mm"),
        } : {}),
        last_out: nuxtApp.$moment(attendanceLastOut.value).format("YYYY-MM-DD HH:mm"),
    }
})
const modalSubmit = async() => {
    modalSubmitPending.value = true;

    await laraFetch(modalSubmitPath.value, {
        method: modalSubmitAction.value,
        body: modalForm.value,
    }, {
        onRequestError: () => {
            modalSubmitPending.value = false;
        },
        onResponse: () => {
            modalSubmitPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: 'Attendance saved.',
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            closeModal();
            await attendancesExecute();
        },
    });
}
</script>

<style scoped>

</style>