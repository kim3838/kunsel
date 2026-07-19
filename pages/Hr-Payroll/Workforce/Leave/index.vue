<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-xl">

                <DialogModal
                    :show="creatingOrEditing"
                    :closeable="false">
                    <template #title>
                        Create leave
                    </template>
                    <template #content>
                        <div ref='modalContentContainer' class="space-y-4">

                            <div class="text-base">
                                Inquire leave date(s) and submit if claimable dates are detected.
                            </div>

                            <div class="mx-auto max-w-screen-lg flex flex-col-reverse md:flex-row gap-4">

                                <fieldset v-if="showClaimabilityPerDate" class="md:basis-4/12 neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">Leave Date Inquiries</legend>

                                    <div v-if="modalInquireLeaveDatePending" class="inline-flex items-center">
                                        <UnorderedList v-if="modalDisableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                                    </div>
                                    <div v-else class="max-h-[135px] md:max-h-[270px] overflow-y-auto space-y-2">
                                        <div class="text-base font-medium">Claimability does not include ineligibility, claim limit and leave balance.</div>

                                        <div class="subtitle-color">Total claimable: {{dateInquiryClaimableCount}}</div>

                                        <table class="border-separate w-full">
                                            <tbody>
                                            <tr v-for="dateInquiry in dateInquiries">
                                                <td class="font-sans">{{dateInquiry.date}}</td>
                                                <td>
                                                    <Label :size="'md'" invert :type="dateInquiry.is_claimable ? `default` : `danger`" :label="dateInquiry.message" />
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </fieldset>
                                <fieldset v-else-if="showResultPerDate" class="md:basis-4/12 neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">Results</legend>

                                    <div v-if="modalSubmitPending" class="inline-flex items-center">
                                        <UnorderedList v-if="modalDisableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                                    </div>
                                    <div v-else class="max-h-[135px] md:max-h-[270px] overflow-y-auto">
                                        <table class="border-separate w-full">
                                            <tbody>
                                            <tr v-for="submitResult in submitResults">
                                                <td class="font-sans">{{submitResult.date}}</td>
                                                <td>
                                                    <Label :size="'md'" invert :type="submitResult.result.type" :label="submitResult.result.label" />
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </fieldset>
                                <div v-else class="md:basis-4/12 flex justify-center items-center text-center px-4">

                                    <div v-if="modalSubmitPending" class="inline-flex items-center">
                                        <UnorderedList v-if="modalDisableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                                    </div>
                                    <div v-else class="text-base">
                                        Inquire leave dates
                                    </div>
                                </div>

                                <fieldset class="md:basis-8/12 neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">Inquire leave dates</legend>

                                    <div class="grid gap-2 grid-cols-4">
                                        <div class="col-span-4 lg:col-span-2">
                                            <InputLabel :size="'sm'" value="Employee (Number, Full Name)"/>
                                            <SingleSelectPaginated
                                                :key="employeeOptionsKey"
                                                :disabled="modalDisableActions || !creatingLeave || modalCreatingAndCreatedAtLeaseOne"
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
                                            <InputLabel :size="'sm'" value="Assigned Shift"/>
                                            <SingleSelectPaginated
                                                :key="assignedShiftSelectionsOptionsKey"
                                                :disabled="modalDisableActions || !employeeOptions.selected || modalCreatingAndCreatedAtLeaseOne"
                                                drop-shadow
                                                value-persist
                                                :selection-max-viewable-line="10"
                                                :label="'Select Assigned Shift'"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :size="'md'"
                                                :payload="assignedShiftSelectionsOptions"
                                                @valueChange="selectedShiftChanged"/>
                                        </div>
                                        <div v-if="creatingLeave" class="col-span-4 md:col-span-3 lg:col-span-2">
                                            <InputLabel :size="'sm'" value="Assigned Leave Type"/>
                                            <SingleSelectPaginated
                                                :key="assignedLeaveTypeSelectionsOptionsKey"
                                                :disabled="modalDisableActions || !employeeOptions.selected || !assignedShiftSelectionsOptions.selected || modalCreatingAndCreatedAtLeaseOne"
                                                drop-shadow
                                                value-persist
                                                :selection-max-viewable-line="10"
                                                :label="'Select Assigned Leave Type'"
                                                :icon="'tdesign:component-checkbox'"
                                                :size="'md'"
                                                :payload="assignedLeaveTypeSelectionsOptions"
                                                @valueChange="selectedLeaveTypeChanged"/>
                                        </div>
                                    </div>

                                    <div class="grid gap-2 grid-cols-3">
                                        <div>
                                            <InputLabel :size="'sm'" value="Leave Date From"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions || !creatingLeave || !assignedLeaveTypeSelectionsOptions.selected || modalCreatingAndCreatedAtLeaseOne"
                                                high-light-all-text-on-focus
                                                v-model="leaveDateFrom"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`leave_date_from`"
                                                :size="'md'" />
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Leave Date To"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions || !creatingLeave || !assignedLeaveTypeSelectionsOptions.selected || modalCreatingAndCreatedAtLeaseOne"
                                                high-light-all-text-on-focus
                                                v-model="leaveDateTo"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`leave_date_to`"
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
                        <div class="mx-auto max-w-screen-lg">
                            <div class="flex space-x-2 justify-between">
                                <div class="space-x-2 inline-flex items-center">
                                    <Button
                                        v-if="!createdAtLeastOne"
                                        class="w-min"
                                        :variant=" 'outline'"
                                        :size="'md'"
                                        :disabled="modalDisableActions"
                                        :label="'Cancel'"
                                        @click="closeModal"/>
                                    <Button
                                        v-if="!createdAtLeastOne"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="'md'"
                                        :disabled="modalDisableActions || !assignedLeaveTypeSelectionsOptions.selected"
                                        :label="`Inquire Leave Dates`"
                                        @click="modalInquireLeaveDates"/>
                                    <Button
                                        v-if="!createdAtLeastOne && dateInquiryHasAtLeastOneClaimableLeave"
                                        class="w-min"
                                        :variant="'default'"
                                        :size="'md'"
                                        :icon="`mdi:plus`"
                                        :disabled="modalDisableActions || !creatingLeave || !assignedLeaveTypeSelectionsOptions.selected"
                                        :label="`Submit`"
                                        @click="filterAndSubmitLeaveDateRange"/>
                                    <Button
                                        v-if="createdAtLeastOne"
                                        class="w-min"
                                        :variant=" 'outline'"
                                        :size="'md'"
                                        :label="'Close'"
                                        @click="closeModal"/>
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

                <div class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="lining-shadow rounded-sm tint-background space-y-2 p-[20px]">

                        <form @submit.prevent="paginate(1, true)" class="space-y-2">

                            <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                <div>
                                    <InputLabel :size="'sm'" value="Search" />
                                    <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search Employee" type="text"/>
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="Date From"/>
                                    <InputWithIcon :icon="'mdi:calendar-today-outline'" :id="'date_from'" readonly v-model="formStore.filters.attendanceDateFrom" :size="'md'" class="w-full" :override="{font_family_class: 'font-sans'}" :disabled="disableActions" />
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="Date To"/>
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
                            </div>
                        </form>

                        <div class="space-y-2">

                            <div class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[disableActions ? 'pointer-events-none' : '']">
                                <Button v-if="leaves.successful" @click="put(null)" class="w-min" :disabled="disableActions" :size="'sm'" :icon="'mdi:plus'" ></Button>
                                <div v-if="leaves.successful" class="scaffold-border px-2 font-[National_Park]">
                                    <span><span class="font-semibold">{{selectedLeaves.length}}</span> Selected</span>
                                </div>
                                <Button
                                    v-if="leaves.successful"
                                    :variant="'outline'"
                                    :size="'sm'"
                                    :icon="'ph:backspace'"
                                    :disabled="disableActions"
                                    :label="'Clear selection'"
                                    @click="selectedLeaves = []" />
                                <Button v-if="leaves.successful" :variant="'outline'" :size="'sm'" :icon="'ph:trash-simple'" :disabled="disableActions" :label="'Bulk delete'" @click="confirmDeleteSelected()" />
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
                                <template v-slot:cell.date="{cell,slot}">
                                    <div class="p-[3px] font-medium">{{cell.date_readable}}</div>
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

                            <div>
                                <PageInformation :pagination="leaves.meta.pagination" :pending="disableDataTable"/>
                                <Pagination :size="'lg'" :pagination="leaves.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {LabelTypeT} from "@/public/js/types/theme";
import type {SelectDataType} from "@/public/js/types/form";
import type {DateTimePickerOptionsT} from "@/public/js/datetimepicker/type";
import type {LeaveDateInquiryT} from "@/public/js/types/leave";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Leave`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
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

    if(_isEmpty(selection) || selection.indexOf('assigned_leave_type') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            assignedLeaveTypeSelectionsOptions, assignedLeaveTypeSelectionsOptionsKey, SELECT.SINGLE_PAGINATED
        );
    }
}

const leavesSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: 'Employee', colspan: 2,  alignHeader: 'left'},
    {text: 'Leave Date', colspan: 1,  alignHeader: 'left'},
    {text: 'Leave Type', colspan: 4,  alignHeader: 'left'},
]);

const leavesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '#', value: 'employee_number', alignData: 'left'},
    { text: 'Name', value: 'employee_full_name', alignData: 'left', minWidth: '140px'},

    { text: '', value: 'date', minWidth: '140px'},

    { text: 'Code', value: 'code', minWidth: '80px'},
    { text: 'Name', value: 'name', minWidth: '143px'},
    { text: 'Type', value: 'type', minWidth: '143px'},
    { text: 'Is Paid', value: 'is_paid', minWidth: '80px'},

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
            account_id: selectedAssociatedCompanyAccountId.value,
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

    let debugEnabled = false;

    coreStore.resetServiceError();

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

    } else {

        leaveEmployeeNumber.value = '';
        leaveEmployeeFullName.value = '';

        if(debugEnabled && process.env.NODE_ENV === 'development'){
            leaveDateFrom.value = nuxtApp.$moment().format("YYYY-MM-DD");
            leaveDateTo.value = nuxtApp.$moment().format("YYYY-MM-DD");
        } else {
            leaveDateFrom.value = nuxtApp.$moment().format("YYYY-MM-DD");
            leaveDateTo.value = nuxtApp.$moment().format("YYYY-MM-DD");
        }

        showResultPerDate.value = false;
    }

    renderDatePickers();
    creatingOrEditing.value = true;
}

const renderDatePickers = () => {

    let leaveDateRangePickers: DateTimePickerOptionsT[] = [
        {
            id: 'leave_date_from',
            type: 'date',
            selectedCallback: (payload: {value: string}) => {
                leaveDateFrom.value = payload.value;
            }
        },{
            id: 'leave_date_to',
            type: 'date',
            selectedCallback: (payload: {value: string}) => {
                leaveDateTo.value = payload.value;
            }
        },
    ];

    let filtersAndAttendanceDatePickers = filtersDateTimePickers.value.concat(leaveDateRangePickers);

    render(filtersAndAttendanceDatePickers);
}

const creatingLeave = computed(() => {
    return stagedLeave.value.id == null;
});

const leaveEmployeeNumber = ref('');
const leaveEmployeeFullName = ref('');
const leaveDateFrom = ref('');
const leaveDateTo = ref('');

const showClaimabilityPerDate = ref(false);
const dateInquiries = ref<LeaveDateInquiryT[]>([]);
const submitResults = ref<{date: string, result: {label: 'string', type: LabelTypeT}}[]>([]);
const dateInquiryClaimableCount = computed(() => {
    return dateInquiries.value.filter((dateInquiry) => {
        return dateInquiry.is_claimable;
    }).length;
})
const dateInquiryHasAtLeastOneClaimableLeave = computed(() => {
    return dateInquiries.value.some((dateInquiry) => {
        return dateInquiry.is_claimable;
    });
})

const showResultPerDate = ref(false);
const createdAtLeastOne = ref(false);

const resetEditable = () => {
    stagedLeave.value = {
        'id': null,
        'ulid': null,
    };
    editPayload.value = {};
    employeeOptions.selected = null;
    employeeOptionsKey.value++;
    assignedShiftSelectionsOptions.selected = null;
    assignedShiftSelectionsOptionsKey.value++;
    assignedLeaveTypeSelectionsOptions.selected = null;
    assignedLeaveTypeSelectionsOptionsKey.value++;
    leaveEmployeeNumber.value = '';
    leaveEmployeeFullName.value = '';
    leaveDateFrom.value = '';
    leaveDateTo.value = '';

    showResultPerDate.value = false;
    createdAtLeastOne.value = false;

    leaveModalSubmitMessage.value = '';

    dateInquiries.value = [];
    showClaimabilityPerDate.value = false;
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

        showResultPerDate.value = false;

        if(selectedEmployee){
            assignedShiftSelectionsOptions.fetch.filters.employee_id = selectedEmployee.value as number;
            assignedShiftSelectionsOptions.selected = null;
            assignedShiftSelectionsOptionsKey.value++;

            assignedLeaveTypeSelectionsOptions.fetch.filters.employee_id = selectedEmployee.value as number;
            assignedLeaveTypeSelectionsOptions.selected = null;
            assignedLeaveTypeSelectionsOptionsKey.value++;
        } else {
            assignedShiftSelectionsOptions.fetch.filters.employee_id = null;
            assignedShiftSelectionsOptions.selected = null;
            assignedShiftSelectionsOptionsKey.value++;

            assignedLeaveTypeSelectionsOptions.fetch.filters.employee_id = null;
            assignedLeaveTypeSelectionsOptions.selected = null;
            assignedLeaveTypeSelectionsOptionsKey.value++;
        }
    }

    dateInquiries.value = [];
    showClaimabilityPerDate.value = false;
}

const selectedShiftChanged = () => {

    if(creatingLeave.value) {

        showResultPerDate.value = false;

        dateInquiries.value = [];
        showClaimabilityPerDate.value = false;
    }
}

const selectedLeaveTypeChanged = () => {

    if(creatingLeave.value) {

        showResultPerDate.value = false;

        dateInquiries.value = [];
        showClaimabilityPerDate.value = false;
    }
}

watch(leaveDateFrom, () => {

    showResultPerDate.value = false;
    dateInquiries.value = [];
    showClaimabilityPerDate.value = false;
});

watch(leaveDateTo, () => {

    showResultPerDate.value = false;
    dateInquiries.value = [];
    showClaimabilityPerDate.value = false;
});

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

const closeModal = () => {
    creatingOrEditing.value = false;
    resetEditable();
};

const modalDisableActions = computed(() => {
    return  modalLoading.value || modalSubmitPending.value || modalInquireLeaveDatePending.value;
});
const modalCreatingAndCreatedAtLeaseOne = computed(() => {
    return  creatingLeave.value && createdAtLeastOne.value;
});
const modalLoading = ref(false);
const modalSubmitPending = ref(false);
const modalInquireLeaveDatePending = ref(false);

const modalForm = computed(() => {
    return {
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        employee_id: employeeOptions.selected,
        shift_id: assignedShiftSelectionsOptions.selected,
        leave_type_id: assignedLeaveTypeSelectionsOptions.selected,
        date_from: leaveDateFrom.value,
        date_to: leaveDateTo.value,
    }
})

const modalInquireLeaveDates = async() => {
    showClaimabilityPerDate.value = true;
    modalInquireLeaveDatePending.value = true;
    dateInquiries.value = [];

    await laraFetch(`/api/leave-date-range-inquire`, {
        method: `POST`,
        body: modalForm.value,
    }, {
        onRequestError: () => {
            modalInquireLeaveDatePending.value = false;
        },
        onResponse: () => {
            modalInquireLeaveDatePending.value = false;
        },
        onNotAcceptableResponse: () => {
            showClaimabilityPerDate.value = false;
        },
        onUnprocessableContentResponse: () => {
            showClaimabilityPerDate.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            showClaimabilityPerDate.value = true;
            dateInquiries.value = _get(response, '_data.values.dates', []);
        },
    });
}

const filterAndSubmitLeaveDateRange = async() => {
    dateInquiries.value = [];
    showClaimabilityPerDate.value = false;

    modalSubmitPending.value = true;
    createdAtLeastOne.value = false;
    filteredLeaveDates.value = [];
    submitResults.value = [];

    await laraFetch(`/api/leave-date-range-filter`, {
        method: `POST`,
        body: modalForm.value,
    }, {
        onRequestError: () => {
            modalSubmitPending.value = false;
        },
        onResponse: () => {
            modalSubmitPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            filteredLeaveDates.value = _get(response, '_data.values.dates', []);

            if(filteredLeaveDates.value.length > 0){

                showResultPerDate.value = true;
                await submit();
            } else {
                showResultPerDate.value = false;
                useNuxtApp().$promptStore.setPrompt({
                    resetable: false,
                    icon: null,
                    title: `No date found`,
                    message: `Selected dates are either day off or already has leave.`,
                    action: {
                        callback: () => {},
                        label: 'Okay'
                    }
                });
            }
        },
    });
}

const filteredLeaveDates = ref([]);
const submitForm = computed(()=>{
    return {
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        employee_id: employeeOptions.selected,
        leave_type_id: assignedLeaveTypeSelectionsOptions.selected,
        dates: filteredLeaveDates.value
    }
})

const leaveModalSubmitMessage = ref('');
const submit = async() => {
    modalSubmitPending.value = true;
    submitResults.value = [];

    await laraFetch(`/api/leave`, {
        method: `POST`,
        body: submitForm.value,
    }, {
        onRequestError: () => {
            modalSubmitPending.value = false;
        },
        onResponse: (request, options, response) => {
            modalSubmitPending.value = false;
            showResultPerDate.value = _get(response, '_data.successful', false);
            leaveModalSubmitMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            submitResults.value = _get(response, '_data.values.results', []);
            let leaveCreatedCount = _get(response, '_data.values.created', 0);

            if(leaveCreatedCount > 0){
                createdAtLeastOne.value = true;
                await leavesExecute();
            }

            let leaveCreatedCountMessage = `${leaveCreatedCount} Leave created`;

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: leaveCreatedCountMessage,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });


        },
    });
}
</script>

<style scoped>

</style>