<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-lg">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
                        <div>
                            <InputLabel :size="'sm'" value="Date From"/>
                            <InputWithIcon :icon="'mdi:calendar-today-outline'" :id="'date_from'" readonly v-model="formStore.filters.attendanceDateFrom" :size="'md'" class="w-full" :override="{font_family_class: 'font-sans'}" :disabled="disableActions" />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Date To"/>
                            <InputWithIcon :icon="'mdi:calendar-outline'" :id="'date_to'" readonly v-model="formStore.filters.attendanceDateTo" :size="'md'" class="w-full" :override="{font_family_class: 'font-sans'}" :disabled="disableActions" />
                        </div>
                        <div v-if="false" class="flex flex-col">
                            <div class="flex-none h-[1.25rem]"></div>
                            <RadioGroup
                                class="scaffold-border px-2"
                                :disabled="disableActions"
                                :selections="viewMode.selection"
                                :size="'md'"
                                :orientation="'horizontal'"
                                v-model="viewMode.selected" />
                        </div>
                        <div class="flex flex-col">
                            <div class="flex-none h-[1.25rem]"></div>
                            <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        </div>
                    </div>
                </form>

                <DialogModal
                    :show="creatingAdjustment"
                    :closeable="false">
                    <template #title>
                        {{attendanceDateReadable}} {{attendanceWeekday}}
                    </template>
                    <template #content>
                        <div ref='modalContentContainer' class="space-y-4">

                            <div class="text-base">
                                File attendance adjustment request
                            </div>

                            <div class="mx-auto max-w-screen-lg flex flex-row gap-4">

                                <fieldset v-if="creatingAdjustment" class="basis-1/3 neutral-border px-2 pb-2 space-y-2">
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
                                <div v-else class="basis-1/4 flex justify-center items-center px-4">
                                    Select Employee, Shift, and Attendance
                                </div>

                                <fieldset class="basis-3/4 neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">Create adjustment</legend>

                                    <div class="grid gap-2 grid-cols-4 lg:grid-cols-8">
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

                                    <div v-if="$coreStore.hasNonPromptableServicePayloadMessage" class="block">
                                        <Label invert :size="'sm'" :type="'danger'" :label="$coreStore.servicePayloadMessage" />
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
                                        class="w-min"
                                        :variant="'default'"
                                        :size="'md'"
                                        :icon="'mdi:plus'"
                                        :disabled="modalDisableActions"
                                        :label="'Submit Request'"
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

                    <div v-if="!attendances.successful" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
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
                                        {type: 'link', icon: 'ix:open-external', title: 'Details',to: `/employee-portal/attendance/${cell.ulid}`},
                                        {type: 'action', icon: 'mdi:edit', title: 'Adjust Attendance',callback: () => {adjust(cell);}},
                                    ]">
                                </NavDrop>
                            </div>
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
                        <template v-slot:cell.date_readable="{cell,slot}">
                            <div class="p-[3px]">{{cell.date_readable}}</div>
                        </template>
                        <template v-slot:cell.status="{cell,slot}">
                            <div class="p-[3px]">{{cell.status.text}}</div>
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
import type {DateTimePickerOptionsT} from "@/public/js/datetimepicker/type";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Attendance`}});
definePageMeta({middleware: ['auth', 'verified', 'employee-of-selected-company']});
useLayout().setNavigationMode('solid');

const userCompanyEmployee = userCompanyEmployeeState();

const {isAuthenticated, userIsSuperAdmin} = useAuth();
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
        paginate();
    }
});

const attendancesSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},
    {text: 'Shift', colspan: 1,  alignHeader: 'left'},
    {text: 'Schedule', colspan: 3,  alignHeader: 'left'},
    {text: 'Attendance', colspan: 6,  alignHeader: 'left'},
]);

const attendancesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions'},

    { text: 'Code', value: 'shift_code', alignData: 'left'},

    { text: 'Week Day', value: 'shift_schedule_week_day_name', alignData: 'left'},
    { text: 'Start', value: 'shift_schedule_work_start', alignData: 'left'},
    { text: 'End', value: 'shift_schedule_work_end', alignData: 'left'},

    { text: 'Date', value: 'date_readable', alignData: 'left'},
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
    'successful': false,
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
    return attendancesPending.value || creatingAdjustment.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return attendancesPending.value || companyAssociationPendingState().value;
});

const attendancesExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    attendancesPending.value = true;

    await laraFetch(`/api/employee-portal-attendances`, {
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

const creatingAdjustment = ref(false);
const adjustPayload = ref({});

const adjust = (row: TableRowT) => {

    coreStore.resetServiceError();

    adjustPayload.value = row;
    stagedAttendance.value = {
        'id': _get(adjustPayload.value, 'id', null),
        'ulid': _get(adjustPayload.value, 'ulid', null),
    };
    creatingAdjustment.value = true;
    loadEditable();
}

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
const attendanceDate = ref<string | null>('');
const attendanceDateReadable = ref('');

const attendanceFirstIn = ref('');
const attendanceLunchOut = ref('');
const attendanceLunchIn = ref('');
const attendanceLastOut = ref('');
const remarks = ref('');

const resetEditable = () => {
    stagedAttendance.value = {
        'id': null,
        'ulid': null,
    };
    adjustPayload.value = {};

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

    attendanceFirstIn.value = '';
    attendanceLunchOut.value = '';
    attendanceLunchIn.value = '';
    attendanceLastOut.value = '';
    remarks.value = '';
}

const renderDatePickers = () => {

    let attendanceAdjustmentDateTimePickers: DateTimePickerOptionsT[] = [
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

const loadEditable = () => {

    attendanceDate.value = _get(adjustPayload.value, 'date', null);
    attendanceDateReadable.value = _get(adjustPayload.value, 'date_readable', '');

    let shiftRequiresLunchOutAndIn = _get(adjustPayload.value, 'shift.require_lunch_time_in_and_out', false) as boolean;
    let shiftIsFlexible = _get(adjustPayload.value, 'shift_schedule.is_flexible', false) as boolean;
    let shiftHasLunchBreak = _get(adjustPayload.value, 'shift_schedule.has_lunch_break', false) as boolean;

    attendanceShiftRequiresLunchOutAndIn.value = shiftRequiresLunchOutAndIn && !shiftIsFlexible && shiftHasLunchBreak;

    scheduleWorkPeriod.value = _get(adjustPayload.value, 'shift_schedule.work_start', '') + ' - ' + _get(adjustPayload.value, 'shift_schedule.work_end', '') + '(' + _get(adjustPayload.value, 'shift_schedule.timezone', '')  + ')';
    shiftWorkStartGrace.value = _get(adjustPayload.value, 'shift.work_start_grace_time_readable', 'Not found');

    scheduleLunchPeriod.value = attendanceShiftRequiresLunchOutAndIn.value ? (_get(adjustPayload.value, 'shift_schedule.lunch_break_start', '') + ' - ' + _get(adjustPayload.value, 'shift_schedule.lunch_break_end', '')) : '';
    shiftLunchStartGrace.value = _get(adjustPayload.value, 'shift.lunch_start_grace_time_readable', 'Not found');

    scheduleTotalDuration.value = _get(adjustPayload.value, 'shift_schedule.total_work_hours_with_breaks', '');
    overtimeMaxDuration.value = _get(adjustPayload.value, 'shift.max_overtime_readable', '');
    holidayPolicy.value = _get(adjustPayload.value, 'shift.holiday_policy.text', '');

    attendanceWeekday.value = _get(adjustPayload.value, 'shift_schedule.week_day_name', '');
    scheduleIsFlexible.value = shiftIsFlexible ? 'Yes' : 'No';

    attendanceFirstIn.value = _get(adjustPayload.value, 'first_in', '');

    if(attendanceShiftRequiresLunchOutAndIn.value){
        attendanceLunchOut.value = _get(adjustPayload.value, 'lunch_out', '') as string;
        attendanceLunchIn.value = _get(adjustPayload.value, 'lunch_in', '') as string;
    }

    attendanceLastOut.value = _get(adjustPayload.value, 'last_out', '');

    renderDatePickers();
}

const closeModal = () => {
    creatingAdjustment.value = false;
    resetEditable();
};

const modalDisableActions = computed(()=>{
    return modalSubmitPending.value;
});
const modalSubmitPending = ref(false);

const modalForm = computed(()=>{
    return {
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        attendance_id: stagedAttendance.value.id,
        date: attendanceDate.value,
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

    await laraFetch('/api/employee-portal-attendance-adjustment-request', {
        method: 'POST',
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
                message: 'Attendance adjustment request submitted, you can monitor your request status at the Home page.',
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            closeModal();
        },
    });
}
</script>

<style scoped>

</style>