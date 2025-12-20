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
                            <InputWithIcon :icon="'mdi:calendar-today-outline'" :id="'date_from'" readonly v-model="filters.dateFrom" :size="'md'" class="w-full" :override="{font_family_class: 'font-sans'}" :disabled="disableActions" />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Date To"/>
                            <InputWithIcon :icon="'mdi:calendar-outline'" :id="'date_to'" readonly v-model="filters.dateTo" :size="'md'" class="w-full" :override="{font_family_class: 'font-sans'}" :disabled="disableActions" />
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
                        <PageInformation :pagination="leaves.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="leaves.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
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
                            <div class="pt-2 mx-auto max-w-screen-xl flex flex-row gap-4">

                                <fieldset v-if="showLeaveBalance" class="basis-1/4 neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">Balance</legend>

                                    <div class="grid gap-2 grid-cols-1">
                                        <div>
                                            <InputLabel :size="'sm'" :value="leaveDate"/>
                                            <div class="text-base font-sans">{{leaveRunningBalance}}</div>
                                        </div>
                                    </div>
                                </fieldset>
                                <div v-else class="basis-1/4 flex justify-center items-center">
                                    Select Employee, Leave Type and Date of leave
                                </div>

                                <fieldset class="basis-3/4 neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">{{creatingLeave ? 'Create leave' : 'Leave'}}</legend>

                                    <div class="grid gap-2 grid-cols-4">
                                        <div class="col-span-4 lg:col-span-2">
                                            <InputLabel :size="'sm'" value="Employee (Number, Full Name)"/>
                                            <SingleSelectPaginated
                                                :key="employeeOptionsKey"
                                                :disabled="modalDisableActions || !creatingLeave"
                                                drop-shadow
                                                value-persist
                                                :selection-max-viewable-line="10"
                                                :label="'Select Employee'"
                                                :size="'md'"
                                                :icon="'mdi:badge-account-outline'"
                                                :payload="employeeOptions"
                                                @valueChange="selectedEmployeeChanged"/>
                                        </div>
                                        <div class="hidden lg:block"></div>
                                        <div v-if="creatingLeave" class="col-span-4 md:col-span-3 lg:col-span-2">
                                            <InputLabel :size="'sm'" value="Assigned Leave Type"/>
                                            <SingleSelectPaginated
                                                :key="assignedLeaveTypeSelectionsOptionsKey"
                                                :disabled="modalDisableActions || !employeeOptions.selected"
                                                drop-shadow
                                                value-persist
                                                :selection-max-viewable-line="10"
                                                :label="'Select Assigned Leave Type'"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :size="'md'"
                                                :payload="assignedLeaveTypeSelectionsOptions"
                                                @valueChange="selectedLeaveTypeChanged"/>
                                        </div>
                                        <div class="col-span-4 md:col-span-1">
                                            <InputLabel :size="'sm'" value="Leave Date"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions || !creatingLeave || !assignedLeaveTypeSelectionsOptions.selected"
                                                high-light-all-text-on-focus
                                                v-model="leaveDate"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`leave_date`"
                                                :size="'md'" />
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
                        <div class="mx-auto max-w-screen-xl">
                            <div class="flex space-x-2 justify-between">
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
                                        :disabled="modalDisableActions || creatingLeaveWithNonValidLeaveFoundations"
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
                        <Button v-if="!disableActions" :variant="'outline'" :size="'sm'" :icon="'mdi:delete-outline'" :disabled="disableActions" :label="'Delete selected'" @click="confirmDeleteSelected()" />
                    </div>

                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <div class="scaffold-border px-2 font-[National_Park]">
                            <span><span class="font-semibold">{{selectedLeaves.length}}</span> Selected</span>
                        </div>
                        <Button
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'tdesign:close'"
                            :disabled="disableActions"
                            :label="'Clear selection'"
                            @click="selectedLeaves = []" />
                    </div>

                    <DataTable
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
import type {DataTableMeta, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection} from "@/public/js/common/type";
import type {SelectDataType} from "@/public/js/types/form";
import type {AttendanceT} from "@/public/js/types/attendance";
import type {DateTimePickerOptionsT} from "@/public/js/datetimepicker/type";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Leave`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const isNumeric = nuxtApp.$isNumeric as (value: any) => boolean;
const $moment = nuxtApp.$moment;
const {render} = dateTimePicker();
const clientReadyState = useClientReadyState();
const common = useCommon();
const coreStore = useCoreStore();
const formStore = nuxtApp.$formStore;
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

    if(_isEmpty(selection) || selection.indexOf('employee') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            employeeOptions, employeeOptionsKey, SELECT.SINGLE_PAGINATED
        );
    }

    if(_isEmpty(selection) || selection.indexOf('assigned_leave_type') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            assignedLeaveTypeSelectionsOptions, assignedLeaveTypeSelectionsOptionsKey, SELECT.SINGLE_PAGINATED
        );
    }
}

const leavesSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: 'Employee', colspan: 2,  alignHeader: 'left'},
    {text: 'Leave Type', colspan: 4,  alignHeader: 'left'},
    {text: 'Leave Date', colspan: 1,  alignHeader: 'left'},
]);

const leavesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: 'Employee #', value: 'employee_number', alignData: 'left'},
    { text: 'Name', value: 'employee_full_name', alignData: 'left'},
    
    { text: 'Code', value: 'code'},
    { text: 'Name', value: 'name'},
    { text: 'Type', value: 'type'},
    { text: 'Is Paid', value: 'is_paid'},
    
    { text: '', value: 'date'},
]);

const leaves = reactive<{
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
    dateFrom: $moment().startOf('day').format('YYYY-MM-DD'),
    dateTo: $moment().endOf('day').format('YYYY-MM-DD'),
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
const leavesPending = ref(false)
const selectedLeaves = ref([]);
const deleting = ref(false);

const disableActions = computed(() => {
    return leavesPending.value || createEditPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return leavesPending.value || companyAssociationPendingState().value;
});
const leavesExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    leavesPending.value = true;

    await laraFetch(`/api/leaves`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            leavesPending.value = false;
        },
        onResponse: () => {
            leavesPending.value = false;
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
    }, true);
}
await leavesExecute();

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

    const selectedIds = selectedLeaves.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected leave to delete.`,
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
        message: `Confirm delete selected leave${selectedIds.length > 1 ? 's' : ''}?`,
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

    selectedIds = selectedLeaves.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/leaves", {
        method: 'DELETE',
        body: {
            company_id: selectedAssociatedCompanyId.value,
            leave_ids: selectedIds,
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
                message: `Leave${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedLeaves.value = [];
    await leavesExecute();
}

const stagedLeave = ref<{
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

    if(row){
        editPayload.value = row;

        stagedLeave.value = {
            'id': _get(editPayload.value, 'id', null),
            'ulid': _get(editPayload.value, 'ulid', null),
        };

        employeeOptions.selected = _get(editPayload.value, 'employee.id', null);
        employeeOptionsKey.value++;
        assignedLeaveTypeSelectionsOptions.selected = _get(editPayload.value, 'leave_type.id', null);
        assignedLeaveTypeSelectionsOptionsKey.value++;
        leaveEmployeeNumber.value = _get(editPayload.value, 'employee.number', '');
        leaveEmployeeFullName.value = _get(editPayload.value, 'employee.full_name', '');
        leaveDate.value = _get(editPayload.value, 'date', '');
    } else {

        leaveEmployeeNumber.value = '';
        leaveEmployeeFullName.value = '';
        leaveDate.value = nuxtApp.$moment().format("YYYY-MM-DD");
        validLeaveTypeFoundations.value = false;
        showLeaveBalance.value = false;
        leaveRunningBalance.value = 0;
    }

    renderDatePickers();
    creatingOrEditing.value = true;
}

const renderDatePickers = () => {

    let leaveDatePicker: DateTimePickerOptionsT[] = [
        {
            id: 'leave_date',
            type: 'date',
            selectedCallback: (payload: {value: string}) => {
                leaveDate.value = payload.value;
            }
        },
    ];

    let filtersAndAttendanceDatePickers = filtersDateTimePickers.value.concat(leaveDatePicker);

    render(filtersAndAttendanceDatePickers);
}

const creatingLeave = computed(() => {
    return stagedLeave.value.id == null;
});

const leaveEmployeeNumber = ref('');
const leaveEmployeeFullName = ref('');
const leaveDate = ref('');
const validLeaveTypeFoundations = ref(false);
const showLeaveBalance = ref(false);
const leaveRunningBalance = ref(0);

const resetEditable = () => {
    stagedLeave.value = {
        'id': null,
        'ulid': null,
    };
    editPayload.value = {};
    employeeOptions.selected = null;
    employeeOptionsKey.value++;
    assignedLeaveTypeSelectionsOptions.selected = null;
    assignedLeaveTypeSelectionsOptionsKey.value++;
    leaveEmployeeNumber.value = '';
    leaveEmployeeFullName.value = '';
    leaveDate.value = '';
    validLeaveTypeFoundations.value = false;
    showLeaveBalance.value = false;
    leaveRunningBalance.value = 0;
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

    if(creatingLeave.value){

        if(selectedEmployee){
            assignedLeaveTypeSelectionsOptions.fetch.filters.employee_id = selectedEmployee.value as number;
            assignedLeaveTypeSelectionsOptions.selected = null;
            assignedLeaveTypeSelectionsOptionsKey.value++;
        } else {
            assignedLeaveTypeSelectionsOptions.fetch.filters.employee_id = null;
            assignedLeaveTypeSelectionsOptions.selected = null;
            assignedLeaveTypeSelectionsOptionsKey.value++;
        }
    }
}
const selectedLeaveTypeChanged = async (selectedLeaveType: SelectDataType) => {

    if(creatingLeave.value && employeeOptions.selected && assignedLeaveTypeSelectionsOptions.selected){
        await creatingLeaveInitializedLeaveDate(leaveDate.value);
    }
}

const assignedLeaveTypeSelectionsOptionsKey = shallowRef(0);
const assignedLeaveTypeSelectionsOptions = reactive({
    fetch: {
        url: '/api/leave-type-assignment-selections',
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

watch(leaveDate, async (newAttendanceDate) => {

    if(creatingLeave.value && employeeOptions.selected && assignedLeaveTypeSelectionsOptions.selected){
        await creatingLeaveInitializedLeaveDate(newAttendanceDate);
    }
});

const creatingLeaveWithNonValidLeaveFoundations = computed(() => {
    return creatingLeave.value && !validLeaveTypeFoundations.value;
});

const creatingLeaveInitializedLeaveDate = async (value: string) => {

    if(creatingLeave.value){

        let _leaveMeta = {
            pagination: {
                total: 0,
                count: 0,
                per_page: 0,
                current_page: 0,
                total_pages: 0
            }
        };

        modalLoading.value = true;

        await laraFetch(`/api/leaves`, {
            method: 'GET',
            params: {
                filters: {
                    company_id: selectedAssociatedCompanyId.value,
                    employee_ids: [employeeOptions.selected],
                    leave_type_ids: [assignedLeaveTypeSelectionsOptions.selected],
                    date_from: value,
                    date_to: value,
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
                _leaveMeta = _get(response, '_data.values.meta', {
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

        if(_leaveMeta.pagination.total > 0){

            validLeaveTypeFoundations.value = false;
            showLeaveBalance.value = false;

            coreStore.setServiceError({
                prompt: false,
                payload: {
                    message: 'Date already has leave'
                }
            });

            return;

        } else {

            modalLoading.value = true;

            await laraFetch(`/api/leave-balance`, {
                method: 'GET',
                params: {
                    employee_id: employeeOptions.selected,
                    leave_type_id: assignedLeaveTypeSelectionsOptions.selected,
                    date: value,
                }
            }, {
                onRequestError: () => {
                    modalLoading.value = false;
                },
                onResponse: () => {
                    modalLoading.value = false;
                },
                onSuccessResponse: async (request, options, response) => {
                    leaveRunningBalance.value = _get(response, '_data.values.date_series.running_balance', 0);
                    showLeaveBalance.value = true;
                }
            }, false);

            if(!isNumeric(leaveRunningBalance.value)){
                validLeaveTypeFoundations.value = false;

                coreStore.setServiceError({
                    prompt: false,
                    payload: {
                        message: 'Balance not found'
                    }
                });

                return;
            }

            if(isNumeric(leaveRunningBalance.value) && leaveRunningBalance.value < 1){
                validLeaveTypeFoundations.value = false;

                coreStore.setServiceError({
                    prompt: false,
                    payload: {
                        message: 'Insufficient balance.'
                    }
                });

                return;
            }

            if(isNumeric(leaveRunningBalance.value) && leaveRunningBalance.value > 0){

                validLeaveTypeFoundations.value = true;
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

    const isEditMode = !creatingLeave.value;

    return isEditMode ? ICON.EDIT : ICON.CREATE;
});
const modalSaveButtonLabel = computed(()=>{
    const LABEL = {
        CREATE: `Create`,
        EDIT: `Save`
    } as const;

    const isEditMode = !creatingLeave.value;

    return isEditMode ? LABEL.EDIT : LABEL.CREATE;
});

const modalSubmitPath = computed(() => {
    if(!creatingLeave.value){
        return `/api/leave/${stagedLeave.value.ulid}`;
    } else {
        return `/api/leave`
    }
});
const modalSubmitAction = computed(() => {
    if(!creatingLeave.value){
        return `PATCH`;
    } else {
        return `POST`;
    }
});
const modalForm = computed(()=>{
    return {
        id: stagedLeave.value.id,
        ulid: stagedLeave.value.ulid,
        company_id: selectedAssociatedCompanyId.value,
        employee_id: employeeOptions.selected,
        leave_type_id: assignedLeaveTypeSelectionsOptions.selected,
        date: leaveDate.value,
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
                message: `Leave ${creatingLeave.value ? 'created' : 'updated'}.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            closeModal();
            await leavesExecute();
        },
    });
}
</script>

<style scoped>

</style>