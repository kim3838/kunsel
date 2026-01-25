<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search Employee" type="text"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Attendance Date From"/>
                            <InputWithIcon :icon="'mdi:calendar-today-outline'" :id="'date_from'" readonly v-model="formStore.filters.attendanceDateFrom" :size="'md'" class="w-full" :override="{font_family_class: 'font-sans'}" :disabled="disableActions" />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Attendance Date To"/>
                            <InputWithIcon :icon="'mdi:calendar-outline'" :id="'date_to'" readonly v-model="formStore.filters.attendanceDateTo" :size="'md'" class="w-full" :override="{font_family_class: 'font-sans'}" :disabled="disableActions" />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Employee Group" />
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
                        <PageInformation :pagination="overtimes.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="overtimes.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </form>

                <DialogModal
                    :show="creatingOrEditing"
                    :max-width="'1280px'"
                    :closeable="false">
                    <template #title>

                    </template>
                    <template #content>
                        <div ref='modalContentContainer'>

                            <div v-if="!creatingOvertime || validOvertimeFoundations" class="mx-auto max-w-screen-xl">
                                <div class="text-lg font-header">
                                    {{attendanceDate}}&nbsp;{{attendanceWeekday}}&nbsp;{{creatingOvertime ? 'Create overtime' : 'Overtime'}}
                                </div>
                                <div>
                                    {{attendanceEmployeeNumber}}&nbsp;{{attendanceEmployeeFullName}}
                                </div>
                            </div>

                            <div class="pt-2 mx-auto max-w-screen-xl flex flex-row gap-4">

                                <fieldset v-if="!creatingOvertime || validOvertimeFoundations" class="basis-1/4 neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">Schedule</legend>

                                    <div class="grid gap-2 grid-cols-1">
                                        <div>
                                            <InputLabel :size="'sm'" value="Work Period"/>
                                            <div class="text-base">{{scheduleWorkPeriod}}</div>
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Total Duration"/>
                                            <div class="text-base">{{scheduleTotalDuration}}</div>
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Attendance Last Out"/>
                                            <div class="text-base">{{attendanceLastOut}}</div>
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Overtime Max Duration"/>
                                            <div class="text-base">{{overtimeMaxDuration}}</div>
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Is Flexible"/>
                                            <div class="text-base">{{scheduleIsFlexible}}</div>
                                        </div>
                                    </div>
                                </fieldset>
                                <div v-else class="basis-1/4 flex justify-center items-center">
                                    Select Employee, Shift, and Attendance
                                </div>

                                <fieldset class="basis-3/4 neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">{{creatingOvertime ? 'Create overtime' : 'Overtime'}}</legend>

                                    <div class="grid gap-2 grid-cols-4">
                                        <div class="col-span-4 lg:col-span-2">
                                            <InputLabel :size="'sm'" value="Employee (Number, Full Name)"/>
                                            <SingleSelectPaginated
                                                :key="employeeOptionsKey"
                                                :disabled="modalDisableActions || !creatingOvertime"
                                                drop-shadow
                                                value-persist
                                                :selection-max-viewable-line="10"
                                                :label="'Select Employee'"
                                                :size="'md'"
                                                :icon="'mdi:badge-account-outline'"
                                                :payload="employeeOptions"
                                                @valueChange="selectedEmployeeChanged"/>
                                        </div>
                                        <div v-if="creatingOvertime" class="hidden lg:block"></div>
                                        <div v-if="creatingOvertime" class="col-span-4 md:col-span-3 lg:col-span-2">
                                            <InputLabel :size="'sm'" value="Assigned Shift"/>
                                            <SingleSelectPaginated
                                                :key="assignedShiftSelectionsOptionsKey"
                                                :disabled="modalDisableActions || !employeeOptions.selected"
                                                drop-shadow
                                                value-persist
                                                :selection-max-viewable-line="10"
                                                :label="'Select Assigned Shift'"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :size="'md'"
                                                :payload="assignedShiftSelectionsOptions"
                                                @valueChange="selectedShiftChanged"/>
                                        </div>
                                        <div class="col-span-4 md:col-span-1">
                                            <InputLabel :size="'sm'" value="Attendance Date"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions || !creatingOvertime || !assignedShiftSelectionsOptions.selected"
                                                high-light-all-text-on-focus
                                                v-model="attendanceDate"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`attendance_date`"
                                                :size="'md'" />
                                        </div>
                                    </div>

                                    <div v-if="$coreStore.hasNonPromptableServicePayloadMessage" class="block">
                                        <Label invert :size="'sm'" :type="'danger'" :label="$coreStore.servicePayloadMessage" />
                                    </div>

                                    <div class="grid gap-2 grid-cols-1 md:grid-cols-3">
                                        <div>
                                            <InputLabel :size="'sm'" value="Start"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions || creatingOvertimeWithNonValidOvertimeFoundations"
                                                high-light-all-text-on-focus
                                                readonly
                                                v-model="overtimeStart"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`overtime_start`"
                                                :size="'md'" />
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="End"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions || creatingOvertimeWithNonValidOvertimeFoundations"
                                                high-light-all-text-on-focus
                                                readonly
                                                v-model="overtimeEnd"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`overtime_end`"
                                                :size="'md'" />
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="mx-auto max-w-screen-xl">
                            <div class="flex space-x-2 justify-between">
                                <div class="space-x-2 inline-flex items-center">
                                    <Button
                                        class="w-min"
                                        :variant=" 'outline'"
                                        :size="'md'"
                                        :disabled="modalDisableActions"
                                        :label="'Cancel'"
                                        @click="closeModal"/>
                                    <Button
                                        class="w-min"
                                        :variant="'default'"
                                        :size="'md'"
                                        :icon="modalSubmitButtonIcon"
                                        :disabled="modalDisableActions || creatingOvertimeWithNonValidOvertimeFoundations"
                                        :label="modalSaveButtonLabel"
                                        @click="modalSubmit"/>
                                </div>
                                <div class="space-x-2 inline-flex">
                                    <div class="space-x-2 inline-flex items-center">
                                        <UnorderedList
                                            v-if="modalDisableActions"
                                            :icon="'eos-icons:loading'"
                                            :size="'md'"
                                            :label="'Please wait...'"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="px-[20px]">

                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                        <Button v-if="!disableActions" @click="put(null)" class="w-min" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="disableActions ? 'Please wait' : ''"></Button>
                        <Button v-if="overtimes.successful && !disableActions" :variant="'outline'" :size="'sm'" :icon="'mdi:delete-outline'" :disabled="disableActions" :label="'Bulk delete'" @click="confirmDeleteSelected()" />
                    </div>

                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <div v-if="overtimes.successful" class="scaffold-border px-2 font-[National_Park]">
                            <span><span class="font-semibold">{{selectedOvertimes.length}}</span> Selected</span>
                        </div>
                        <Button
                            v-if="overtimes.successful"
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'tdesign:close'"
                            :disabled="disableActions"
                            :label="'Clear selection'"
                            @click="selectedOvertimes = []" />
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
                                        {type: 'action', icon: 'mdi:edit', title: 'Edit Overtime',callback: () => {put(cell);}},
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
import type {SelectDataType} from "@/public/js/types/form";
import type {AttendanceT} from "@/public/js/types/attendance";
import type {DateTimePickerOptionsT} from "@/public/js/datetimepicker/type";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Overtime`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
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

    if(_isEmpty(selection) || selection.indexOf('employee') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            employeeOptions, employeeOptionsKey, SELECT.SINGLE_PAGINATED
        );
    }

    if(_isEmpty(selection) || selection.indexOf('assigned_shift') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            assignedShiftSelectionsOptions, assignedShiftSelectionsOptionsKey, SELECT.SINGLE_PAGINATED
        );
    }
}

const overtimesSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},
    {text: 'Employee', colspan: 2,  alignHeader: 'left'},
    {text: 'Shift', colspan: 1,  alignHeader: 'left'},
    {text: 'Schedule', colspan: 2,  alignHeader: 'left'},
    {text: 'Attendance', colspan: 2,  alignHeader: 'left'},
    {text: 'Overtime', colspan: 3,  alignHeader: 'left'},
]);

const overtimesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions', minWidth: '33px'},
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
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            date_from: formStore.filters.attendanceDateFrom,
            date_to: formStore.filters.attendanceDateTo,
            search: filters.search.keyword,
            assigned_employee_group_ids: employeeGroupOptions.selected,
            department_ids: departmentOptions.selected,
            designation_ids: designationOptions.selected,
        }
    };
});
const overtimesPending = ref(false)
const selectedOvertimes = ref([]);
const deleting = ref(false);

const disableActions = computed(() => {
    return overtimesPending.value || createEditPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return overtimesPending.value || companyAssociationPendingState().value;
});
const overtimesExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    overtimesPending.value = true;

    await laraFetch(`/api/overtimes`, {
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
await overtimesExecute();

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

const confirmDeleteSelected = () => {

    const selectedIds = selectedOvertimes.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected overtime to delete.`,
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
        message: `Confirm delete selected overtime${selectedIds.length > 1 ? 's' : ''}?`,
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

    selectedIds = selectedOvertimes.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/overtimes", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            overtime_ids: selectedIds,
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
                message: `Overtime${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedOvertimes.value = [];
    await overtimesExecute();
}

const stagedOvertime = ref<{
    'id': string | number | null,
    'ulid': string | null,
}>({
    'id': null,
    'ulid': null,
});

const creatingOrEditing = ref(false);
const createEditPending = ref(false);
const editPayload = ref({});

const put = (row: TableRowT | null = null) => {

    coreStore.resetServiceError();

    if(row){
        editPayload.value = row;

        stagedOvertime.value = {
            'id': _get(editPayload.value, 'id', null),
            'ulid': _get(editPayload.value, 'ulid', null),
        };

        scheduleWorkPeriod.value = _get(editPayload.value, 'shift_schedule.work_start', '') + ' - ' + _get(editPayload.value, 'shift_schedule.work_end', '') + '(' + _get(editPayload.value, 'shift_schedule.timezone', '')  + ')';
        scheduleTotalDuration.value = _get(editPayload.value, 'shift_schedule.total_work_hours_with_breaks', '');
        scheduleIsFlexible.value = _get(editPayload.value, 'shift_schedule.is_flexible', false) ? 'Yes' : 'No';
        overtimeMaxDuration.value = _get(editPayload.value, 'shift.max_overtime_readable', '');
        employeeOptions.selected = _get(editPayload.value, 'employee.id', null);
        employeeOptionsKey.value++;
        assignedShiftSelectionsOptions.selected = _get(editPayload.value, 'shift.id', null);
        assignedShiftSelectionsOptionsKey.value++;
        attendanceId.value = _get(editPayload.value, 'attendance.id', '');
        attendanceEmployeeNumber.value = _get(editPayload.value, 'employee.number', '');
        attendanceEmployeeFullName.value = _get(editPayload.value, 'employee.full_name', '');
        attendanceDate.value = _get(editPayload.value, 'attendance.date', '');
        attendanceWeekday.value = _get(editPayload.value, 'shift_schedule.week_day_name', '');
        attendanceLastOut.value = _get(editPayload.value, 'attendance.last_out', '');
        overtimeStart.value = _get(editPayload.value, 'start', '');
        overtimeEnd.value = _get(editPayload.value, 'end', '');
    } else {

        scheduleWorkPeriod.value = '';
        overtimeMaxDuration.value = '';
        scheduleTotalDuration.value = '';
        scheduleIsFlexible.value = '';
        attendanceId.value = '';
        attendanceEmployeeNumber.value = '';
        attendanceEmployeeFullName.value = '';
        attendanceDate.value = nuxtApp.$moment().format("YYYY-MM-DD");
        attendanceWeekday.value = '';
        attendanceLastOut.value = '';
        validOvertimeFoundations.value = false;
        overtimeStart.value = nuxtApp.$moment().format("YYYY-MM-DD HH:mm");
        overtimeEnd.value = nuxtApp.$moment().format("YYYY-MM-DD HH:mm");
    }

    renderDatePickers();
    creatingOrEditing.value = true;
}

const renderDatePickers = () => {

    let overtimeDateTimePickers: DateTimePickerOptionsT[] = [
        {
            id: 'attendance_date',
            type: 'date',
            selectedCallback: (payload: {value: string}) => {
                attendanceDate.value = payload.value;
            }
        },
        {
            id: 'overtime_start',
            type: 'datetime',
            format: 'YYYY-MM-DD HH:mm',
            selectedCallback: (payload: {value: string}) => {
                overtimeStart.value = payload.value;
            }
        },
        {
            id: 'overtime_end',
            type: 'datetime',
            format: 'YYYY-MM-DD HH:mm',
            selectedCallback: (payload: {value: string}) => {
                overtimeEnd.value = payload.value;
            }
        },
    ];

    let filtersAndAttendanceDatePickers = filtersDateTimePickers.value.concat(overtimeDateTimePickers);

    render(filtersAndAttendanceDatePickers);
}

const creatingOvertime = computed(() => {
    return stagedOvertime.value.id == null;
});

const scheduleWorkPeriod = ref('');
const scheduleTotalDuration = ref('');
const scheduleIsFlexible = ref('');
const overtimeMaxDuration = ref('');
const attendanceId = ref<string | number>('');
const attendanceEmployeeNumber = ref('');
const attendanceEmployeeFullName = ref('');
const attendanceDate = ref('');
const attendanceWeekday = ref('');
const attendanceLastOut = ref('');
const validOvertimeFoundations = ref(false);
const overtimeStart = ref('');
const overtimeEnd = ref('');

const resetEditable = () => {
    stagedOvertime.value = {
        'id': null,
        'ulid': null,
    };
    editPayload.value = {};
    employeeOptions.selected = null;
    employeeOptionsKey.value++;
    assignedShiftSelectionsOptions.selected = null;
    assignedShiftSelectionsOptionsKey.value++;
    scheduleWorkPeriod.value = '';
    scheduleTotalDuration.value = '';
    scheduleIsFlexible.value = '';
    overtimeMaxDuration.value = '';
    attendanceId.value = '';
    attendanceEmployeeNumber.value = '';
    attendanceEmployeeFullName.value = '';
    attendanceDate.value = '';
    attendanceWeekday.value = '';
    attendanceLastOut.value = '';
    validOvertimeFoundations.value = false;
    overtimeStart.value = '';
    overtimeEnd.value = '';
}

const overtimeStartChanged = (value: string) => {
    let dateValid = nuxtApp.$moment(value.trim(), "YYYY-MM-DD HH:mm:ss", true).isValid();

    if(!dateValid){
        overtimeStart.value = nuxtApp.$moment().format("YYYY-MM-DD HH:mm:ss")
    }
}

const overtimeEndChanged = (value: string) => {
    let dateValid = nuxtApp.$moment(value.trim(), "YYYY-MM-DD HH:mm:ss", true).isValid();

    if(!dateValid){
        overtimeEnd.value = nuxtApp.$moment().format("YYYY-MM-DD HH:mm:ss")
    }
}

const employeeOptionsKey = shallowRef(0);
const employeeOptions = reactive({
    fetch: {
        url: '/api/employee-selections',
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: null,
});

const selectedEmployeeChanged = (selectedEmployee: SelectDataType) => {

    if(creatingOvertime.value){

        if(selectedEmployee){
            assignedShiftSelectionsOptions.fetch.filters.employee_id = selectedEmployee.value as number;
            assignedShiftSelectionsOptions.selected = null;
            assignedShiftSelectionsOptionsKey.value++;
        } else {
            assignedShiftSelectionsOptions.fetch.filters.employee_id = null;
            assignedShiftSelectionsOptions.selected = null;
            assignedShiftSelectionsOptionsKey.value++;
        }
    }
}
const selectedShiftChanged = async (selectedShift: SelectDataType) => {

    if(creatingOvertime.value && employeeOptions.selected && assignedShiftSelectionsOptions.selected){
        await creatingAttendanceInitializedAttendanceDate(attendanceDate.value);
    }
}

const assignedShiftSelectionsOptionsKey = shallowRef(0);
const assignedShiftSelectionsOptions = reactive({
    fetch: {
        url: '/api/shift-assignment-selections',
        filters: {
            employee_id: employeeOptions.selected as number | null,
            company_id: selectedAssociatedCompanyId.value,
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: null,
});

watch(attendanceDate, async (newAttendanceDate) => {

    if(creatingOvertime.value && employeeOptions.selected && assignedShiftSelectionsOptions.selected){
        await creatingAttendanceInitializedAttendanceDate(newAttendanceDate);
    }
});

const creatingOvertimeWithNonValidOvertimeFoundations = computed(() => {
    return creatingOvertime.value && !validOvertimeFoundations.value;
});

const creatingAttendanceInitializedAttendanceDate = async (value: string) => {

    if(creatingOvertime.value){

        let _attendanceData: AttendanceT[] = [];
        let _attendanceSuccess = false;
        let _attendanceMessage = '';
        let _attendanceOvertime = null;
        let _attendanceDetails: any[] = [];
        let _attendanceMeta = {
            pagination: {
                total: 0,
                count: 0,
                per_page: 0,
                current_page: 0,
                total_pages: 0
            }
        };

        modalLoading.value = true;

        await laraFetch(`/api/attendances`, {
            method: 'GET',
            params: {
                account_id: selectedAssociatedCompanyAccountId.value,
                company_id: selectedAssociatedCompanyId.value,
                filters: {
                    company_id: selectedAssociatedCompanyId.value,
                    employee_ids: [employeeOptions.selected],
                    attendance_shift_ids: [assignedShiftSelectionsOptions.selected],
                    date_from: value,
                    date_to: value,
                }
            }
        }, {
            onRequestError: () => {
                modalLoading.value = false;
            },
            onResponse: (request, options, response) => {
                modalLoading.value = false;
                _attendanceSuccess = _get(response, '_data.successful', false);
                _attendanceMessage = _get(response, '_data.message', '');
            },
            onSuccessResponse: async (request, options, response) => {
                _attendanceData = _get(response, '_data.values.data', [])
                _attendanceMeta = _get(response, '_data.values.meta', {
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

        if(!_attendanceSuccess){
            validOvertimeFoundations.value = false;

            coreStore.setServiceError({
                prompt: false,
                payload: {
                    message: _attendanceMessage
                }
            });

            return;
        }

        let _attendance = _attendanceData[0] as AttendanceT;

        if(_attendanceMeta.pagination.total > 0){

            modalLoading.value = true;

            await laraFetch(`/api/attendance/${_get(_attendance, 'ulid', '')}`, {
                method: 'GET',
                params: {
                    account_id: selectedAssociatedCompanyAccountId.value,
                    company_id: selectedAssociatedCompanyId.value,
                    filters: {
                        shift_breakdown_splits: [
                            SHIFT_BREAKDOWN_SPLIT.WORK,
                            SHIFT_BREAKDOWN_SPLIT.LUNCH,
                        ]
                    }
                }
            }, {
                onRequestError: () => {
                    modalLoading.value = false;
                },
                onResponse: () => {
                    modalLoading.value = false;
                },
                onSuccessResponse: async (request, options, response) => {
                    _attendanceDetails = _get(response, '_data.values.details', []);
                    _attendanceOvertime = _get(response, '_data.values.overtime', null);
                },
            });
        }

        if(_attendanceMeta.pagination.total == 0 || !Boolean(_attendanceDetails.length)){
            validOvertimeFoundations.value = false;

            coreStore.setServiceError({
                prompt: false,
                payload: {
                    message: 'No attendance found for the selected employee, shift, and date.'
                }
            });

            return;

        } else if(Boolean(_attendanceOvertime)){
            validOvertimeFoundations.value = false;

            coreStore.setServiceError({
                prompt: false,
                payload: {
                    message: 'Attendance already has overtime'
                }
            });

            return;

        } else {

            let _shiftMaxOvertime = parseFloat(_attendance.shift.max_overtime);
            let _shiftScheduleIsFlexible = _attendance.shift_schedule.is_flexible;
            let _attendanceLastOut = nuxtApp.$moment(`${_attendance.last_out}`);
            let _lastAttendanceDetailSplit = _attendanceDetails[_attendanceDetails.length - 1];
            let _lastScheduleWorkEnd = nuxtApp.$moment(`${_get(_lastAttendanceDetailSplit, 'date', '')} ${_get(_lastAttendanceDetailSplit, 'split_end', '')}`);

            let _isLastOutLesserOrEqualToScheduleWorkEnd = _attendanceLastOut.isSameOrBefore(_lastScheduleWorkEnd);

            let preRequestErrors = [];

            if(_shiftMaxOvertime <= 0){
                preRequestErrors.push('Shift schedule has no overtime.')
            }

            if(_shiftScheduleIsFlexible){
                preRequestErrors.push('Overtime cannot be applied to flexible shift schedule.')
            }

            if(preRequestErrors.length == 0) {

                if(_isLastOutLesserOrEqualToScheduleWorkEnd){
                    preRequestErrors.push('Unable to create overtime if last out does not exceed schedule work end.')
                }
            }

            if(preRequestErrors.length > 0){

                validOvertimeFoundations.value = false;

                coreStore.setServiceError({
                    prompt: false,
                    payload: {
                        message: preRequestErrors.join(', ')
                    }
                });
            } else {

                validOvertimeFoundations.value = true;
                attendanceId.value = _get(_attendance, 'id', '');
                let shiftIsFlexible = _get(_attendance, 'shift_schedule.is_flexible', false) as boolean;

                scheduleWorkPeriod.value = _get(_attendance, 'shift_schedule.work_start', '') + ' - ' + _get(_attendance, 'shift_schedule.work_end', '') + '(' + _get(_attendance, 'shift_schedule.timezone', '')  + ')';
                scheduleTotalDuration.value = _get(_attendance, 'shift_schedule.total_work_hours_with_breaks', '');
                scheduleIsFlexible.value = shiftIsFlexible ? 'Yes' : 'No';
                overtimeMaxDuration.value = _get(_attendance, 'shift.max_overtime_readable', '');

                attendanceEmployeeNumber.value = _get(_attendance, 'employee.number', '');
                attendanceEmployeeFullName.value = _get(_attendance, 'employee.full_name', '');
                attendanceWeekday.value = _get(_attendance, 'shift_schedule.week_day_name', '');
                attendanceLastOut.value = _get(_attendance, 'last_out', '');

                overtimeStart.value = nuxtApp.$moment(`${attendanceDate.value} ${_get(_attendance, 'shift_schedule.work_end', '00:00')}`).format("YYYY-MM-DD HH:mm");
                overtimeEnd.value = nuxtApp.$moment(_get(_attendance, 'last_out', '')).format("YYYY-MM-DD HH:mm");
                renderDatePickers();
            }

        }
    }
}

const closeModal = () => {
    creatingOrEditing.value = false;
    resetEditable();
};

const modalDisableActions = computed(()=>{
    return  modalLoading.value || modalSubmitPending.value;
});
const modalLoading = ref(false);
const modalSubmitPending = ref(false);

const modalSubmitButtonIcon = computed(()=>{
    const ICON = {
        CREATE: 'mdi:plus',
        EDIT: 'ic:sharp-save'
    } as const;

    const isEditMode = !creatingOvertime.value;

    return isEditMode ? ICON.EDIT : ICON.CREATE;
});
const modalSaveButtonLabel = computed(()=>{
    const LABEL = {
        CREATE: `Create`,
        EDIT: `Save`
    } as const;

    const isEditMode = !creatingOvertime.value;

    return isEditMode ? LABEL.EDIT : LABEL.CREATE;
});

const modalSubmitPath = computed(() => {
    if(!creatingOvertime.value){
        return `/api/overtime/${stagedOvertime.value.ulid}`;
    } else {
        return `/api/overtime`
    }
});
const modalSubmitAction = computed(() => {
    if(!creatingOvertime.value){
        return `PATCH`;
    } else {
        return `POST`;
    }
});
const modalForm = computed(()=>{
    return {
        id: stagedOvertime.value.id,
        ulid: stagedOvertime.value.ulid,
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        attendance_id: attendanceId.value,
        start: nuxtApp.$moment(overtimeStart.value).format("YYYY-MM-DD HH:mm"),
        end: nuxtApp.$moment(overtimeEnd.value).format("YYYY-MM-DD HH:mm"),
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
                message: `Overtime ${creatingOvertime.value ? 'created' : 'updated'}.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            closeModal();
            await overtimesExecute();
        },
    });
}
</script>

<style scoped>

</style>