<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Status" />
                            <MultiSelect :disabled="disableActions" glint drop-shadow :size="'md'" :options="requestApprovalStatusOptions" :icon="'tdesign:component-checkbox'"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Request # Search" />
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
                        <label class="flex items-center">
                            <Checkbox
                                :disabled="disableActions"
                                name="remember"
                                v-model="showApprovalStates"
                                :size="'md'"
                                :label="'Show Approval Sequence'" />
                        </label>
                    </div>

                    <div>
                        <PageInformation :pagination="overtimeRequests.meta.pagination" :pending="disableDataTable"/>
                        <div class="flex items-center gap-2">
                            <Pagination :size="'lg'" :pagination="overtimeRequests.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                        </div>
                    </div>
                </form>

                <ViewRequestable
                    v-model:view-requestable="showRequestable"
                    v-model:requestable-payload="requestablePayload"/>

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
                            </div>

                            <div class="pt-2 mx-auto max-w-screen-xl flex flex-row gap-4">

                                <fieldset v-if="!creatingOvertime || validOvertimeFoundations" class="basis-1/3 neutral-border px-2 pb-2 space-y-2">
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
                                    Select your Shift and Attendance of overtime
                                </div>

                                <fieldset class="basis-3/4 neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">{{creatingOvertime ? 'Create overtime' : 'Overtime'}}</legend>

                                    <div class="grid gap-2 grid-cols-4">
                                        <div class="col-span-4 lg:col-span-2">
                                            <InputLabel :size="'sm'" value="Assigned Shift"/>
                                            <SingleSelectPaginated
                                                :key="assignedShiftSelectionsOptionsKey"
                                                :disabled="modalDisableActions"
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

                                    <div v-if="!creatingOvertimeWithNonvalidOvertimeFoundations && assignedShiftSelectionsOptions.selected" class="grid gap-2 grid-cols-4 lg:grid-cols-8">
                                        <div class="col-span-4 md:col-span-2">
                                            <InputLabel :size="'sm'" value="Start"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions"
                                                high-light-all-text-on-focus
                                                readonly
                                                v-model="overtimeStart"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`overtime_start`"
                                                :size="'md'" />
                                        </div>
                                        <div class="col-span-4 md:col-span-2">
                                            <InputLabel :size="'sm'" value="End"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions"
                                                high-light-all-text-on-focus
                                                readonly
                                                v-model="overtimeEnd"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`overtime_end`"
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
                                        v-if="validOvertimeFoundations"
                                        class="w-min"
                                        :variant="'default'"
                                        :size="'md'"
                                        :icon="modalSubmitButtonIcon"
                                        :disabled="modalDisableActions || creatingOvertimeWithNonvalidOvertimeFoundations"
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

                <div class="px-[20px]">
                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                        <Button v-if="!disableActions" @click="create()" class="w-min" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="disableActions ? 'Please wait' : ''"></Button>
                        <Button v-if="overtimeRequests.successful && !disableActions" :variant="'outline'" :size="'sm'" :icon="'mdi:delete-outline'" :disabled="disableActions" :label="'Bulk delete'" @click="confirmDeleteSelected()" />
                    </div>

                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <div v-if="overtimeRequests.successful" class="scaffold-border px-2 font-[National_Park]">
                            <span><span class="font-semibold">{{selectedOvertimeRequests.length}}</span> Selected</span>
                        </div>
                        <Button
                            v-if="overtimeRequests.successful"
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'tdesign:close'"
                            :disabled="disableActions"
                            :label="'Clear selection'"
                            @click="selectedOvertimeRequests = []" />
                        <Label v-if="!overtimeRequests.successful" invert :size="'md'" :type="'danger'" :label="overtimeRequests.message" />
                    </div>

                    <DataTable
                        v-if="overtimeRequests.successful"
                        :key="overtimeRequestsKey"
                        :sup-headers="overtimeRequestsSupHeaders"
                        :headers="overtimeRequestsHeaders"
                        :size="'lg'"
                        :rows="overtimeRequests.data"
                        :disabled="disableDataTable"
                        v-model="selectedOvertimeRequests"
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
                                        {type: 'action', title: 'No action',callback: () => {}},
                                    ]">
                                </NavDrop>
                            </div>
                        </template>
                        <template v-slot:cell.number="{cell,slot}">
                            <div class="p-[3px] hover:underline cursor-pointer" @click="viewRequestable(cell)">{{cell.number}}</div>
                        </template>
                        <template v-slot:cell.status_summary="{cell,slot}">
                            <div class="flex space-x-1 px-[0.3rem] items-center">
                                <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.status_summary?.text" />
                            </div>
                        </template>
                        <template v-slot:cell.requested_by="{cell,slot}">
                            <div class="p-[3px]">{{cell.requested_by?.name}}</div>
                        </template>
                        <template v-slot:cell.employee_number="{cell,slot}">
                            <div class="p-[3px]">{{cell.attendance?.employee?.number}}</div>
                        </template>
                        <template v-slot:cell.employee_full_name="{cell,slot}">
                            <div class="p-[3px]">{{cell.attendance?.employee?.full_name}}</div>
                        </template>
                        <template v-slot:cell.attendance_date="{cell,slot}">
                            <div class="p-[3px]">{{cell.attendance?.date}}</div>
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

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Overtime Requests`}});
definePageMeta({middleware: ['auth', 'employee-of-selected-company']});
useLayout().setNavigationMode('solid');
const route = useRoute();
const user = userState();
const userCompanyEmployee = userCompanyEmployeeState();

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

    if(_isEmpty(selection) || selection.indexOf('shift_assignment') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            assignedShiftSelectionsOptions, assignedShiftSelectionsOptionsKey, SELECT.SINGLE_PAGINATED
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

const overtimeRequestsSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},

    {text: ''},
    {text: ''},

    {text: 'Requested by', colspan: 3,  alignHeader: 'left'},

    {text: 'Attendance', colspan: 3,  alignHeader: 'left'},

    {text: 'Overtime', colspan: 4,  alignHeader: 'left'},
]);

const overtimeRequestsHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions', minWidth: '33px'},

    { text: 'Request #', value: 'number', isNumeric: true},
    { text: 'Status', value: 'status_summary'},

    { text: '', value: 'requested_by', minWidth: '33px'},
    { text: '', value: 'date_requested_diff', minWidth: '33px'},
    { text: 'Remarks', value: 'remarks', minWidth: '33px'},

    { text: '', value: 'employee_number', minWidth: '33px'},
    { text: '', value: 'employee_full_name', minWidth: '33px'},
    { text: 'Date', value: 'attendance_date'},

    { text: 'Start', value: 'start', alignData: 'left'},
    { text: 'End', value: 'end', alignData: 'left'},
    { text: 'Duration', value: 'duration_readable', alignData: 'left'},
]);

const overtimeRequestsKey = shallowRef(0);
const overtimeRequests = reactive<DataTableT>({
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
    perPage: 25,
    attendanceSearch: {
        keyword: '',
        callback: 1
    },
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
            requested_by_ids: [user.value?.id],
            statuses: requestApprovalStatusOptions.selected,
        }
    };
});
const overtimeRequestsPending = ref(false)
const selectedOvertimeRequests = ref([]);
const deleting = ref(false);

const disableActions = computed(() => {
    return overtimeRequestsPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return overtimeRequestsPending.value || companyAssociationPendingState().value;
});
const overtimeRequestsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    overtimeRequestsPending.value = true;

    await laraFetch(`/api/employee-portal-overtime-requests`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            overtimeRequestsPending.value = false;
        },
        onResponse: (request, options, response) => {
            overtimeRequestsPending.value = false;
            overtimeRequests.successful = _get(response, '_data.successful', false);
            overtimeRequests.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            overtimeRequests.data = _get(response, '_data.values.data', []).map((attendanceAdjustment: TableRowT) => {

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
            overtimeRequests.meta = _get(response, '_data.values.meta', {
                pagination: {
                    total: 0,
                    count: 0,
                    per_page: 0,
                    current_page: 0,
                    total_pages: 0
                }
            });
            overtimeRequestsKey.value += 1;
        }
    }, false);
}
await overtimeRequestsExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedOvertimeRequests.value = [];
    }

    if(filters.page === page){
        overtimeRequestsExecute();
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

    const selectedIds = selectedOvertimeRequests.value;

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
        message: `Confirm delete selected overtime request${selectedIds.length > 1 ? 's' : ''}?`,
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

    selectedIds = selectedOvertimeRequests.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/employee-portal-overtime-requests", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            overtime_request_ids: selectedIds,
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
                message: `Overtime request${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedOvertimeRequests.value = [];
    await overtimeRequestsExecute();
}

const stagedOvertimeRequest = ref<{
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

    let filtersAndAttendanceDatePickers = filtersDateTimePickers.value.concat(attendanceAdjustmentDateTimePickers);

    render(filtersAndAttendanceDatePickers);
}

const creatingOvertime = computed(() => {
    return stagedOvertimeRequest.value.id == null;
});

watch(creatingOrEditing, (creatingOrEditing)=>{
    if(creatingOrEditing){
        loadEditable();
    }
});

const scheduleWorkPeriod = ref('');
const scheduleTotalDuration = ref('');
const scheduleIsFlexible = ref('');
const overtimeMaxDuration = ref('');
const attendanceId = ref<string | number | null>(null);


const attendanceDate = ref('');
const attendanceWeekday = ref('');
const attendanceLastOut = ref('');
const validOvertimeFoundations = ref(false);
const overtimeStart = ref('');
const overtimeEnd = ref('');
const remarks = ref('');

const resetEditable = () => {
    stagedOvertimeRequest.value = {
        'id': null,
        'ulid': null,
    };
    editPayload.value = {};

    assignedShiftSelectionsOptions.selected = null;
    assignedShiftSelectionsOptionsKey.value++;

    attendanceId.value = null;

    scheduleWorkPeriod.value = '';
    scheduleTotalDuration.value = '';
    scheduleIsFlexible.value = '';
    overtimeMaxDuration.value = '';

    attendanceDate.value = '';
    attendanceWeekday.value = '';
    attendanceLastOut.value = '';

    validOvertimeFoundations.value = false;
    overtimeStart.value = '';
    overtimeEnd.value = '';
    remarks.value = '';
}
const selectedShiftChanged = async (selectedShift: SelectDataType) => {

    if(creatingOvertime.value && userCompanyEmployee.value?.id && assignedShiftSelectionsOptions.selected){
        await creatingOvertimeInitializedAttendanceDate(attendanceDate.value);
    }
}

const assignedShiftSelectionsOptionsKey = shallowRef(0);
const assignedShiftSelectionsOptions = reactive({
    fetch: {
        url: '/api/shift-assignment-selections',
        filters: {
            employee_id: userCompanyEmployee.value?.id as number | null,
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

    if(creatingOvertime.value && userCompanyEmployee.value?.id && assignedShiftSelectionsOptions.selected){
        await creatingOvertimeInitializedAttendanceDate(newAttendanceDate);
    }
});

const creatingOvertimeWithNonvalidOvertimeFoundations = computed(() => {
    return creatingOvertime.value && !validOvertimeFoundations.value;
});

const creatingOvertimeInitializedAttendanceDate = async (value: string) => {

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

        await laraFetch(`/api/employee-portal-attendances`, {
            method: 'GET',
            params: {
                account_id: selectedAssociatedCompanyAccountId.value,
                company_id: selectedAssociatedCompanyId.value,
                filters: {
                    company_id: selectedAssociatedCompanyId.value,
                    employee_ids: [userCompanyEmployee.value?.id],
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

            await laraFetch(`/api/employee-portal-attendance/${_get(_attendance, 'ulid', '')}`, {
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
                    message: 'No attendance found for the selected shift and date.'
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

                attendanceId.value = _get(_attendance, 'id', null);
                let shiftIsFlexible = _get(_attendance, 'shift_schedule.is_flexible', false) as boolean;

                scheduleWorkPeriod.value = _get(_attendance, 'shift_schedule.work_start', '') + ' - ' + _get(_attendance, 'shift_schedule.work_end', '') + '(' + _get(_attendance, 'shift_schedule.timezone', '')  + ')';
                scheduleTotalDuration.value = _get(_attendance, 'shift_schedule.total_work_hours_with_breaks', '');
                scheduleIsFlexible.value = shiftIsFlexible ? 'Yes' : 'No';
                overtimeMaxDuration.value = _get(_attendance, 'shift.max_overtime_readable', '');

                attendanceWeekday.value = _get(_attendance, 'shift_schedule.week_day_name', '');
                attendanceLastOut.value = _get(_attendance, 'last_out', '');

                overtimeStart.value = nuxtApp.$moment(`${attendanceDate.value} ${_get(_attendance, 'shift_schedule.work_end', '00:00')}`).format("YYYY-MM-DD HH:mm");
                overtimeEnd.value = nuxtApp.$moment(_get(_attendance, 'last_out', '')).format("YYYY-MM-DD HH:mm");

                renderDatePickers();
            }
        }
    }
}

const loadEditable = () => {

    coreStore.resetServiceError();

    stagedOvertimeRequest.value = {
        'id': _get(editPayload.value, 'id', null),
        'ulid': _get(editPayload.value, 'ulid', null),
    };

    attendanceDate.value = _get(editPayload.value, 'date', nuxtApp.$moment('2025-01-10').format("YYYY-MM-DD"));

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

    const isEditMode = !creatingOvertime.value;

    return isEditMode ? ICON.EDIT : ICON.CREATE;
});
const modalSaveButtonLabel = computed(()=>{
    const LABEL = {
        CREATE: `Submit Request`,
        EDIT: `Save`
    } as const;

    const isEditMode = !creatingOvertime.value;

    return isEditMode ? LABEL.EDIT : LABEL.CREATE;
});

const modalSubmitPath = computed(() => {
    if(!creatingOvertime.value){
        return `/api/employee-portal-overtime-request/${stagedOvertimeRequest.value.id}`;
    } else {
        return `/api/employee-portal-overtime-request`
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
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        attendance_id: attendanceId.value,
        start: nuxtApp.$moment(overtimeStart.value).format("YYYY-MM-DD HH:mm"),
        end: nuxtApp.$moment(overtimeEnd.value).format("YYYY-MM-DD HH:mm"),
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
                message: 'Overtime request submitted, you can monitor your request status at the Home page.',
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            closeModal();
            await overtimeRequestsExecute();
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
        type: 'overtime_request',
        id: row.id,
        number: row.number,
    } as RequestablePayloadT;
    showRequestable.value = true;
}
</script>

<style scoped>

</style>