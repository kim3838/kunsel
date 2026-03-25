<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Requested by" />
                            <MultiSelectPaginated
                                :key="companyUserSelectionsOptionsKey"
                                :icon="'tdesign:component-checkbox'"
                                :disabled="disableActions"
                                glint
                                drop-shadow
                                :size="'md'"
                                :label="'Filter requested by'"
                                :payload="companyUserSelectionsOptions"
                            />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Status" />
                            <MultiSelect :disabled="disableActions" glint drop-shadow :size="'md'" :options="requestApprovalStatusOptions" :icon="'tdesign:component-checkbox'"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Request # Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search Number" type="text"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Employee Attendance Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="attendanceSearchInput" v-model="filters.attendanceSearch.keyword" class="w-full" placeholder="Search Attendance" type="text"/>
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
                    </div>

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        <div class="h-8 flex flex-row items-center scaffold-border px-2">
                            <label class="flex items-center">
                                <Checkbox
                                    :disabled="disableActions"
                                    name="show-approval-sequence"
                                    v-model="showApprovalStates"
                                    :size="'md'"
                                    :label="'Show approval sequence'" />
                            </label>
                        </div>
                    </div>
                </form>

                <ViewRequestable
                    v-model:view-requestable="showRequestable"
                    v-model:requestable-payload="requestablePayload"/>

                <DialogModal
                    :show="creatingOrEditing"
                    :closeable="false">
                    <template #title>
                        {{attendanceDateReadable}} {{attendanceWeekday}}
                    </template>
                    <template #content>
                        <div ref='modalContentContainer' class="space-y-4">

                            <div v-if="!creatingAttendanceAdjustment || validAttendanceAdjustmentFoundations" class="mx-auto max-w-screen-lg">
                                <div class="text-base">
                                    {{creatingAttendanceAdjustment ? 'File attendance adjustment request' : 'Attendance adjustment'}}
                                </div>
                            </div>

                            <div class="mx-auto max-w-screen-lg flex flex-row gap-4">

                                <fieldset v-if="!creatingAttendanceAdjustment || validAttendanceAdjustmentFoundations" class="basis-1/3 neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">Schedule</legend>

                                    <div class="grid gap-2 grid-cols-1">
                                        <div class="grid grid-cols-1 gap-y-2 lg:gap-y-0 lg:grid-cols-2 gap-x-2">
                                            <div>
                                                <InputLabel :size="'sm'" value="Work Period"/>
                                                <div class="text-base">{{scheduleWorkPeriod}}</div>
                                            </div>
                                            <div>
                                                <InputLabel :size="'sm'" value="Work Start Grace"/>
                                                <div class="text-base">{{shiftWorkStartGrace}}</div>
                                            </div>
                                        </div>
                                        <div v-if="attendanceShiftRequiresLunchOutAndIn" class="grid grid-cols-1 gap-y-2 lg:gap-y-0 lg:grid-cols-2 gap-x-2">
                                            <div >
                                                <InputLabel :size="'sm'" value="Lunch Period"/>
                                                <div class="text-base">{{scheduleLunchPeriod}}</div>
                                            </div>
                                            <div>
                                                <InputLabel :size="'sm'" value="Lunch Start Grace"/>
                                                <div class="text-base">{{shiftLunchStartGrace}}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Total Duration"/>
                                            <div class="text-base">{{scheduleTotalDuration}}</div>
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Overtime Max Duration"/>
                                            <div class="text-base">{{overtimeMaxDuration}}</div>
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Holiday policy"/>
                                            <div class="text-base">{{holidayPolicy}}</div>
                                        </div>
                                    </div>
                                </fieldset>
                                <div v-else class="basis-1/4 flex justify-center items-center text-center px-4">
                                    Select employee, assigned shift, and attendance
                                </div>

                                <fieldset class="basis-3/4 neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">{{creatingAttendanceAdjustment ? 'Create adjustment' : 'Overtime'}}</legend>

                                    <div class="grid gap-2 grid-cols-4">
                                        <div class="col-span-4 lg:col-span-2">
                                            <InputLabel :size="'sm'" value="Employee (Number, Full Name)"/>
                                            <SingleSelectPaginated
                                                :key="employeeOptionsKey"
                                                :disabled="modalDisableActions || !creatingAttendanceAdjustment"
                                                drop-shadow
                                                value-persist
                                                :selection-max-viewable-line="10"
                                                :label="'Select employee'"
                                                :size="'md'"
                                                :icon="'mdi:badge-account-outline'"
                                                :payload="employeeOptions"
                                                @valueChange="selectedEmployeeChanged"/>
                                        </div>
                                        <div v-if="creatingAttendanceAdjustment" class="hidden lg:block"></div>
                                        <div v-if="creatingAttendanceAdjustment" class="col-span-4 md:col-span-3 lg:col-span-2">
                                            <InputLabel :size="'sm'" value="Assigned Shift"/>
                                            <SingleSelectPaginated
                                                :key="assignedShiftSelectionsOptionsKey"
                                                :disabled="modalDisableActions || !employeeOptions.selected"
                                                drop-shadow
                                                value-persist
                                                :selection-max-viewable-line="10"
                                                :label="'Select assigned shift'"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :size="'md'"
                                                :payload="assignedShiftSelectionsOptions"
                                                @valueChange="selectedShiftChanged"/>
                                        </div>
                                        <div class="col-span-4 md:col-span-1">
                                            <InputLabel :size="'sm'" value="Attendance Date"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions || !creatingAttendanceAdjustment || !assignedShiftSelectionsOptions.selected"
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

                                    <div v-if="!creatingAttendanceAdjustmentWithNonValidAttendanceAdjustmentFoundations && assignedShiftSelectionsOptions.selected" class="grid gap-2 grid-cols-4 lg:grid-cols-8">
                                        <div class="col-span-4 md:col-span-2">
                                            <InputLabel :size="'sm'" value="First In"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions"
                                                high-light-all-text-on-focus
                                                readonly
                                                v-model="attendanceFirstIn"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`first_in`"
                                                :size="'md'" />
                                        </div>
                                        <div v-if="attendanceShiftRequiresLunchOutAndIn" class="col-span-4 md:col-span-2">
                                            <InputLabel :size="'sm'" value="Lunch Out"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions"
                                                high-light-all-text-on-focus
                                                readonly
                                                v-model="attendanceLunchOut"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`lunch_out`"
                                                :size="'md'" />
                                        </div>
                                        <div v-if="attendanceShiftRequiresLunchOutAndIn" class="col-span-4 md:col-span-2">
                                            <InputLabel :size="'sm'" value="Lunch In"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions"
                                                high-light-all-text-on-focus
                                                readonly
                                                v-model="attendanceLunchIn"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`lunch_in`"
                                                :size="'md'" />
                                        </div>
                                        <div class="col-span-4 md:col-span-2">
                                            <InputLabel :size="'sm'" value="Last Out"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions"
                                                high-light-all-text-on-focus
                                                readonly
                                                v-model="attendanceLastOut"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`last_out`"
                                                :size="'md'" />
                                        </div>
                                        <div class="col-span-4 md:col-span-2">
                                            <InputLabel :size="'sm'" value="Remarks"/>
                                            <Input
                                                :disabled="modalDisableActions"
                                                :size="'md'"
                                                v-model="remarks"/>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="mx-auto max-w-screen-lg">
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
                                        v-if="validAttendanceAdjustmentFoundations"
                                        class="w-min"
                                        :variant="'default'"
                                        :size="'md'"
                                        :icon="modalSubmitButtonIcon"
                                        :disabled="modalDisableActions || creatingAttendanceAdjustmentWithNonValidAttendanceAdjustmentFoundations"
                                        :label="modalSaveButtonLabel"
                                        @click="modalSubmit"/>
                                </div>
                                <div class="space-x-2 inline-flex items-center">
                                    <div class="space-x-2 inline-flex items-center">
                                        <UnorderedList
                                            v-if="modalSubmitPending"
                                            :icon="'eos-icons:loading'"
                                            :size="'md'"
                                            :label="'Please wait...'"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="px-[20px] space-y-2">
                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[disableActions ? 'pointer-events-none' : '']">
                        <Button v-if="attendanceAdjustments.successful" @click="create()" class="w-min" :disabled="disableActions" :size="'sm'" :icon="'mdi:plus'"></Button>
                        <div v-if="attendanceAdjustments.successful" class="scaffold-border px-2 font-[National_Park]">
                            <span><span class="font-semibold">{{selectedAttendanceAdjustments.length}}</span> Selected</span>
                        </div>
                        <Button
                            v-if="attendanceAdjustments.successful"
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'ph:backspace'"
                            :disabled="disableActions"
                            :label="'Clear selection'"
                            @click="selectedAttendanceAdjustments = []" />
                        <Button v-if="attendanceAdjustments.successful" :variant="'outline'" :size="'sm'" :icon="'ph:trash-simple'" :disabled="disableActions" :label="'Bulk delete'" @click="confirmDeleteSelected()" />
                        <Label v-if="!attendanceAdjustments.successful" invert :size="'md'" :type="'danger'" :label="attendanceAdjustments.message" />
                    </div>

                    <DataTable
                        v-if="attendanceAdjustments.successful"
                        :key="attendanceAdjustmentsKey"
                        :sup-headers="attendanceAdjustmentsSupHeaders"
                        :headers="attendanceAdjustmentsHeaders"
                        :size="'lg'"
                        :rows="attendanceAdjustments.data"
                        :disabled="disableDataTable"
                        v-model="selectedAttendanceAdjustments"
                        selection
                        :border-appearance="showApprovalStates"
                        :stripped="!showApprovalStates"
                        :sub-row-slug="attendanceAdjustmentSubRowSlug"
                        :sub-row-settings="{
                            type: DATATABLE_SUBROW_TYPE.TITLED,
                            containerPaddingTop: 0.75,
                            containerPaddingBottom: 1.75,
                            titleSize: 'md',
                            rowVerticalLine: true,
                            verticalBorderType: 'dashed'
                        }">
                        <template v-slot:cell.number="{cell,slot}">
                            <div class="p-[3px] font-medium hover:underline cursor-pointer" @click="viewRequestable(cell)">{{cell.number}}</div>
                        </template>
                        <template v-slot:cell.status_summary="{cell,slot}">
                            <div class="flex space-x-1 px-[0.3rem] items-center">
                                <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.status_summary?.text" />
                            </div>
                        </template>
                        <template v-slot:cell.requested_by="{cell,slot}">
                            <div class="p-[3px]">{{cell.requested_by?.username}}</div>
                        </template>
                        <template v-slot:cell.employee_number="{cell,slot}">
                            <div class="p-[3px]">{{cell.attendance?.employee?.number}}</div>
                        </template>
                        <template v-slot:cell.employee_full_name="{cell,slot}">
                            <div class="p-[3px]">{{cell.attendance?.employee?.full_name}}</div>
                        </template>
                        <template v-slot:cell.attendance_date="{cell,slot}">
                            <div class="p-[3px] font-medium">{{cell.attendance?.date_readable}}</div>
                        </template>
                        <template v-slot:sub_row_slot="{rowIndex, cell, slot}">
                            <div class="inline-flex items-center scaffold-border pr-2">
                                <Icon name="mdi:info-variant" :class="[slot.iconSizeClass]" /><div :class="[slot.titleSizeClass]">Approval Sequence</div>
                            </div>
                            <ApprovalStateSubRow
                                :rows="cell[slot.slug]"
                                :disabled="disableDataTable"
                            ></ApprovalStateSubRow>
                        </template>
                    </DataTable>

                    <div>
                        <PageInformation :pagination="attendanceAdjustments.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="attendanceAdjustments.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection, StringEnumInterface} from "@/public/js/common/type";
import type {SelectDataType} from "@/public/js/types/form";
import type {AttendanceT} from "@/public/js/types/attendance";
import type {DateTimePickerOptionsT} from "@/public/js/datetimepicker/type";
import type {LabelTypeT} from "@/public/js/types/theme";
import type {RequestablePayloadT} from "@/public/js/types/request-approval";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Attendance Adjustment Requests`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-of-selected-company']});
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
        rebuildSelections();
        paginate();
    }
});

const rebuildSelections = (selection: string[] = []) => {

    if(_isEmpty(selection) || selection.indexOf('employee') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            employeeOptions, employeeOptionsKey, SELECT.SINGLE_PAGINATED
        );
    }

    if(_isEmpty(selection) || selection.indexOf('shift_assignment') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            assignedShiftSelectionsOptions, assignedShiftSelectionsOptionsKey, SELECT.SINGLE_PAGINATED
        );
    }

    if(_isEmpty(selection) || selection.indexOf('company_user') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            companyUserSelectionsOptions, companyUserSelectionsOptionsKey, SELECT.MULTI_PAGINATED, [], {
                query_params: {
                    account_id: selectedAssociatedCompanyAccountId.value,
                    company_id: selectedAssociatedCompanyId.value,
                },
                filters: {
                    account_id: selectedAssociatedCompanyAccountId.value,
                    associated_companies: [selectedAssociatedCompanyId.value],
                    search: {
                        keyword: '',
                        callback: 1
                    }
                }
            }
        );
    }
}

const showApprovalStates = ref(false);
const attendanceAdjustmentSubRowSlug = ref('');

watch(() => {return showApprovalStates.value;}, (show) => {
    if(show){
        attendanceAdjustmentSubRowSlug.value = 'approval_states';
        paginate(1, true)
    } else {
        attendanceAdjustmentSubRowSlug.value = '';
        paginate(1, true)
    }
})

const attendanceAdjustmentsSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},

    {text: ''},
    {text: ''},

    {text: 'Requested by', colspan: 3,  alignHeader: 'left'},

    {text: 'Attendance', colspan: 3,  alignHeader: 'left'},

    {text: 'Adjustment', colspan: 4,  alignHeader: 'left'},
]);

const attendanceAdjustmentsHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},

    { text: 'Request #', value: 'number', isNumeric: true},
    { text: 'Status', value: 'status_summary'},

    { text: '', value: 'requested_by', minWidth: '33px'},
    { text: '', value: 'date_requested_diff', minWidth: '33px'},
    { text: 'Remarks', value: 'remarks', minWidth: '33px'},

    { text: '#', value: 'employee_number', minWidth: '33px'},
    { text: 'Name', value: 'employee_full_name', minWidth: '33px'},
    { text: 'Date', value: 'attendance_date'},

    { text: 'First In', value: 'first_in', alignData: 'left'},
    { text: 'Lunch Out', value: 'lunch_out', alignData: 'left'},
    { text: 'Lunch In', value: 'lunch_in', alignData: 'left'},
    { text: 'Last Out', value: 'last_out', alignData: 'left'},
]);

const attendanceAdjustmentsKey = shallowRef(0);
const attendanceAdjustments = reactive<DataTableT>({
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
let filters = reactive<{
    page: number,
    perPage: number,
    attendanceSearch: {
        keyword: string,
        callback: ReturnType<typeof setTimeout> | number
    }
    search: {
        keyword: string,
        callback: ReturnType<typeof setTimeout> | number
    }
}>({
    page: 1,
    perPage: 15,
    attendanceSearch: {
        keyword: '',
        callback: 1
    },
    search: {
        keyword: '',
        callback: 1
    }
});

const requestApprovalStatusOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(REQUEST_APPROVAL_STATUS_NAME, REQUEST_APPROVAL_STATUS.PENDING as number),
        $enumerableOption(REQUEST_APPROVAL_STATUS_NAME, REQUEST_APPROVAL_STATUS.DECLINED as number),
        $enumerableOption(REQUEST_APPROVAL_STATUS_NAME, REQUEST_APPROVAL_STATUS.APPROVED as number),
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

//Multi select options of Requested by
const companyUserSelectionsOptionsKey = shallowRef(0);
const companyUserSelectionsOptions = reactive({
    fetch: {
        url: '/api/company-user-selections',
        query_params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
        },
        filters: {
            account_id: selectedAssociatedCompanyAccountId.value,
            associated_companies: [selectedAssociatedCompanyId.value],
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: [],
});

//Employee Organization
const companyOrganizationSelections = companyOrganizationSelectionsState();
const employeeGroupOptionsKey = shallowRef(0);
const employeeGroupOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.employee_groups,
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
            attendance_date_from: formStore.filters.attendanceDateFrom,
            attendance_date_to: formStore.filters.attendanceDateTo,
            attendance_search: filters.attendanceSearch.keyword,
            search: filters.search.keyword,
            assigned_employee_group_ids: employeeGroupOptions.selected,
            requested_by_ids: companyUserSelectionsOptions.selected,
            statuses: requestApprovalStatusOptions.selected,
        }
    };
});
const attendanceAdjustmentsPending = ref(false)
const selectedAttendanceAdjustments = ref([]);
const deleting = ref(false);

const disableActions = computed(() => {
    return attendanceAdjustmentsPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return attendanceAdjustmentsPending.value || companyAssociationPendingState().value;
});
const attendanceAdjustmentsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    attendanceAdjustmentsPending.value = true;

    await laraFetch(`/api/attendance-adjustment-requests`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            attendanceAdjustmentsPending.value = false;
        },
        onResponse: (request, options, response) => {
            attendanceAdjustmentsPending.value = false;
            attendanceAdjustments.successful = _get(response, '_data.successful', false);
            attendanceAdjustments.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            attendanceAdjustments.data = _get(response, '_data.values.data', []).map((attendanceAdjustment: TableRowT) => {

                let statusSummary = _get(attendanceAdjustment, 'status_summary.value', 0);

                let shade = 'default';

                if(statusSummary == REQUEST_APPROVAL_STATUS.DECLINED){
                    shade = 'danger';
                } else if(statusSummary == REQUEST_APPROVAL_STATUS.APPROVED){
                    shade = 'success';
                }

                return {
                    ...attendanceAdjustment,
                    _payload: {
                        'label_shade': {
                            'cell': ['status_summary'],
                            'value': shade
                        }
                    }
                };
            });
            attendanceAdjustments.meta = _get(response, '_data.values.meta', {
                pagination: {
                    total: 0,
                    count: 0,
                    per_page: 0,
                    current_page: 0,
                    total_pages: 0
                }
            });
            attendanceAdjustmentsKey.value += 1;
        }
    }, false);
}
attendanceAdjustmentsExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedAttendanceAdjustments.value = [];
    }

    if(filters.page === page){
        attendanceAdjustmentsExecute();
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

    const selectedIds = selectedAttendanceAdjustments.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected attendance adjustment to delete.`,
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
        message: `Confirm delete selected attendance adjustment${selectedIds.length > 1 ? 's' : ''}?`,
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

    selectedIds = selectedAttendanceAdjustments.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/attendance-adjustment-requests", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            attendance_adjustment_request_ids: selectedIds,
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
                message: `Attendance adjustment${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedAttendanceAdjustments.value = [];
    await attendanceAdjustmentsExecute();
}

const stagedAttendanceAdjustment = ref<{
    'id': string | number | null,
    'ulid': string | null,
}>({
    'id': null,
    'ulid': null,
});

const creatingOrEditing = ref(false);
const editPayload = ref({});

const create = () => {
    editPayload.value = {};
    creatingOrEditing.value = true;
}

const renderDatePickers = () => {

    let attendanceAdjustmentDateTimePickers: DateTimePickerOptionsT[] = [
        {
            id: 'attendance_date',
            type: 'date',
            selectedCallback: (payload: {value: string}) => {
                attendanceDate.value = payload.value;
            }
        },
        {
            id: 'first_in',
            type: 'datetime',
            format: 'YYYY-MM-DD HH:mm',
            selectedCallback: (payload: {value: string}) => {
                attendanceFirstIn.value = payload.value;
            }
        },
        ...(attendanceShiftRequiresLunchOutAndIn.value ? [
            {
                id: 'lunch_out',
                type: 'datetime',
                format: 'YYYY-MM-DD HH:mm',
                selectedCallback: (payload: {value: string}) => {
                    attendanceLunchOut.value = payload.value;
                }
            },{
                id: 'lunch_in',
                type: 'datetime',
                format: 'YYYY-MM-DD HH:mm',
                selectedCallback: (payload: {value: string}) => {
                    attendanceLunchIn.value = payload.value;
                }
            },
        ] : []),
        {
            id: 'last_out',
            type: 'datetime',
            format: 'YYYY-MM-DD HH:mm',
            selectedCallback: (payload: {value: string}) => {
                attendanceLastOut.value = payload.value;
            }
        },
    ];

    let filtersAndAttendanceDatePickers = filtersDateTimePickers.value.concat(attendanceAdjustmentDateTimePickers);

    render(filtersAndAttendanceDatePickers);
}

const creatingAttendanceAdjustment = computed(() => {
    return stagedAttendanceAdjustment.value.id == null;
});

watch(creatingOrEditing, (creatingOrEditing)=>{
    if(creatingOrEditing){
        loadEditable();
    }
});

const attendanceId = ref<string | number | null>(null);
const scheduleWorkPeriod = ref('');
const shiftWorkStartGrace = ref('');
const scheduleLunchPeriod = ref('');
const shiftLunchStartGrace = ref('');
const scheduleTotalDuration = ref('');
const attendanceWeekday = ref('');
const scheduleIsFlexible = ref('');
const overtimeMaxDuration = ref('');
const holidayPolicy = ref('');
const attendanceShiftRequiresLunchOutAndIn = ref(false);
const attendanceDate = ref('');
const attendanceDateReadable = ref('');
const validAttendanceAdjustmentFoundations = ref(false);
const attendanceFirstIn = ref('');
const attendanceLunchOut = ref('');
const attendanceLunchIn = ref('');
const attendanceLastOut = ref('');
const remarks = ref('');

const resetEditable = () => {
    stagedAttendanceAdjustment.value = {
        'id': null,
        'ulid': null,
    };
    editPayload.value = {};

    employeeOptions.selected = null;
    employeeOptionsKey.value++;
    assignedShiftSelectionsOptions.selected = null;
    assignedShiftSelectionsOptionsKey.value++;

    attendanceId.value = null;

    scheduleWorkPeriod.value = '';
    shiftWorkStartGrace.value = '';
    scheduleLunchPeriod.value = '';
    shiftLunchStartGrace.value = '';
    scheduleTotalDuration.value = '';
    attendanceWeekday.value = '';
    scheduleIsFlexible.value = '';
    overtimeMaxDuration.value = '';
    holidayPolicy.value = '';
    attendanceShiftRequiresLunchOutAndIn.value = false;
    attendanceDate.value = '';
    attendanceDateReadable.value = '';
    validAttendanceAdjustmentFoundations.value = false;
    attendanceFirstIn.value = '';
    attendanceLunchOut.value = '';
    attendanceLunchIn.value = '';
    attendanceLastOut.value = '';
    remarks.value = '';
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

    if(creatingAttendanceAdjustment.value){

        if(selectedEmployee){
            assignedShiftSelectionsOptions.fetch.filters.employee_id = selectedEmployee.value as number;
            assignedShiftSelectionsOptions.selected = null;
            assignedShiftSelectionsOptionsKey.value++;

            validAttendanceAdjustmentFoundations.value = false;
        } else {
            assignedShiftSelectionsOptions.fetch.filters.employee_id = null;
            assignedShiftSelectionsOptions.selected = null;
            assignedShiftSelectionsOptionsKey.value++;
        }
    }
}
const selectedShiftChanged = async (selectedShift: SelectDataType) => {

    if(creatingAttendanceAdjustment.value && employeeOptions.selected && assignedShiftSelectionsOptions.selected){
        await creatingAttendanceAdjustmentInitializedAttendanceDate(attendanceDate.value);
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

    if(creatingAttendanceAdjustment.value && employeeOptions.selected && assignedShiftSelectionsOptions.selected){
        await creatingAttendanceAdjustmentInitializedAttendanceDate(newAttendanceDate);
    }
});

const creatingAttendanceAdjustmentWithNonValidAttendanceAdjustmentFoundations = computed(() => {
    return creatingAttendanceAdjustment.value && !validAttendanceAdjustmentFoundations.value;
});

const creatingAttendanceAdjustmentInitializedAttendanceDate = async (value: string) => {

    if(creatingAttendanceAdjustment.value){

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
            validAttendanceAdjustmentFoundations.value = false;

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
            validAttendanceAdjustmentFoundations.value = false;

            coreStore.setServiceError({
                prompt: false,
                payload: {
                    message: 'No attendance found for the selected employee, shift, and date.'
                }
            });

            return;

        } else {

            let preRequestErrors:string[] = [];

            if(preRequestErrors.length > 0){

                validAttendanceAdjustmentFoundations.value = false;

                coreStore.setServiceError({
                    prompt: false,
                    payload: {
                        message: preRequestErrors.join(', ')
                    }
                });
            } else {

                validAttendanceAdjustmentFoundations.value = true;

                attendanceDateReadable.value = _get(_attendance, 'date_readable', '');

                attendanceId.value = _get(_attendance, 'id', null);
                let shiftRequiresLunchOutAndIn = _get(_attendance, 'shift.require_lunch_time_in_and_out', false) as boolean;
                let shiftIsFlexible = _get(_attendance, 'shift_schedule.is_flexible', false) as boolean;
                let shiftHasLunchBreak = _get(_attendance, 'shift_schedule.has_lunch_break', false) as boolean;

                attendanceShiftRequiresLunchOutAndIn.value = shiftRequiresLunchOutAndIn && !shiftIsFlexible && shiftHasLunchBreak;

                scheduleWorkPeriod.value = _get(_attendance, 'shift_schedule.work_start', '') + ' - ' + _get(_attendance, 'shift_schedule.work_end', '') + '(' + _get(_attendance, 'shift_schedule.timezone', '')  + ')';
                shiftWorkStartGrace.value = _get(_attendance, 'shift.work_start_grace_time_readable', 'Not found');

                scheduleLunchPeriod.value = attendanceShiftRequiresLunchOutAndIn.value ? (_get(_attendance, 'shift_schedule.lunch_break_start', '') + ' - ' + _get(_attendance, 'shift_schedule.lunch_break_end', '')) : '';
                shiftLunchStartGrace.value = _get(_attendance, 'shift.lunch_start_grace_time_readable', 'Not found');

                scheduleTotalDuration.value = _get(_attendance, 'shift_schedule.total_work_hours_with_breaks', '');
                overtimeMaxDuration.value = _get(_attendance, 'shift.max_overtime_readable', '');
                holidayPolicy.value = _get(_attendance  , 'shift.holiday_policy.text', '');

                attendanceWeekday.value = _get(_attendance, 'shift_schedule.week_day_name', '');
                scheduleIsFlexible.value = shiftIsFlexible ? 'Yes' : 'No';

                attendanceFirstIn.value = _get(_attendance, 'first_in', '');

                if(attendanceShiftRequiresLunchOutAndIn.value){
                    attendanceLunchOut.value = _get(_attendance, 'lunch_out', '') as string;
                    attendanceLunchIn.value = _get(_attendance, 'lunch_in', '') as string;
                }

                attendanceLastOut.value = _get(_attendance, 'last_out', '');

                renderDatePickers();
            }
        }
    }
}

const loadEditable = () => {

    let debugEnabled = false;

    coreStore.resetServiceError();

    stagedAttendanceAdjustment.value = {
        'id': _get(editPayload.value, 'id', null),
        'ulid': _get(editPayload.value, 'ulid', null),
    };

    if(debugEnabled && process.env.NODE_ENV === 'development'){
        attendanceDate.value = _get(editPayload.value, 'date', nuxtApp.$moment('2025-01-10').format("YYYY-MM-DD"));
    } else {
        attendanceDate.value = _get(editPayload.value, 'date', nuxtApp.$moment().format("YYYY-MM-DD"));
    }

    renderDatePickers();
}

const closeModal = () => {
    creatingOrEditing.value = false;
    resetEditable();
};

const modalDisableActions = computed(()=>{
    return modalLoading.value || modalSubmitPending.value;
});

const modalLoading = ref(false);
const modalSubmitPending = ref(false);

const modalSubmitButtonIcon = computed(()=>{
    const ICON = {
        CREATE: 'mdi:plus',
        EDIT: 'ic:sharp-save'
    } as const;

    const isEditMode = !creatingAttendanceAdjustment.value;

    return isEditMode ? ICON.EDIT : ICON.CREATE;
});
const modalSaveButtonLabel = computed(()=>{
    const LABEL = {
        CREATE: `Submit Request`,
        EDIT: `Save`
    } as const;

    const isEditMode = !creatingAttendanceAdjustment.value;

    return isEditMode ? LABEL.EDIT : LABEL.CREATE;
});

const modalSubmitPath = computed(() => {
    if(!creatingAttendanceAdjustment.value){
        return `/api/attendance-adjustment-request/${stagedAttendanceAdjustment.value.id}`;
    } else {
        return `/api/attendance-adjustment-request`
    }
});
const modalSubmitAction = computed(() => {
    if(!creatingAttendanceAdjustment.value){
        return `PATCH`;
    } else {
        return `POST`;
    }
});
const modalForm = computed(()=>{
    return {
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        attendance_id: attendanceId.value,
        first_in: nuxtApp.$moment(attendanceFirstIn.value).format("YYYY-MM-DD HH:mm"),
        ...(attendanceShiftRequiresLunchOutAndIn.value ? {
            lunch_out: nuxtApp.$moment(attendanceLunchOut.value).format("YYYY-MM-DD HH:mm"),
            lunch_in: nuxtApp.$moment(attendanceLunchIn.value).format("YYYY-MM-DD HH:mm"),
        } : {}),
        last_out: nuxtApp.$moment(attendanceLastOut.value).format("YYYY-MM-DD HH:mm"),
        remarks: remarks.value,
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
                message: 'Attendance adjustment request created.',
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            closeModal();
            await attendanceAdjustmentsExecute();
        },
    });
}

const showRequestable = ref(false);
const requestablePayload = ref<Partial<RequestablePayloadT>>({
    type: '',
    id: -1,
    number: '',
});

const viewRequestable = async (row: TableRowT) => {

    requestablePayload.value = {
        type: 'attendance_adjustment_request',
        id: row.id,
        number: row.number,
    } as RequestablePayloadT;
    showRequestable.value = true;
}
</script>

<style scoped>

</style>