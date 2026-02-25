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

                        <div class="flex flex-col">
                            <div class="flex-none h-[1.25rem]"></div>
                            <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        </div>
                    </div>
                </form>

                <DialogModal
                    :show="creatingOrEditing"
                    :max-width="'780px'"
                    :closeable="false">
                    <template #title>

                    </template>
                    <template #content>
                        <div ref='modalContentContainer'>

                            <div class="pt-2 flex flex-row gap-4">

                                <fieldset class="w-full neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">{{creatingLeaveBalanceAdjustment ? 'Create adjustment' : 'Edit Adjustment'}}</legend>

                                    <div class="grid gap-2 grid-cols-4">
                                        <div class="col-span-2">
                                            <InputLabel :size="'sm'" value="Employee (Number, Full Name)"/>
                                            <SingleSelectPaginated
                                                ref="employeeSingleSelectPaginated"
                                                :key="employeeOptionsKey"
                                                :disabled="modalDisableActions"
                                                drop-shadow
                                                value-persist
                                                :selection-max-viewable-line="10"
                                                :label="'Select Employee'"
                                                :size="'md'"
                                                :icon="'mdi:badge-account-outline'"
                                                :payload="employeeOptions"
                                                @valueChange="selectedEmployeeChanged"/>
                                        </div>
                                        <div class="col-span-2">
                                            <InputLabel :size="'sm'" value="Assigned Leave Type"/>
                                            <SingleSelectPaginated
                                                ref="leaveTypeSingleSelectPaginated"
                                                :key="assignedLeaveTypeSelectionsOptionsKey"
                                                :disabled="modalDisableActions || !employeeOptions.selected"
                                                drop-shadow
                                                value-persist
                                                :selection-max-viewable-line="10"
                                                :label="'Select Assigned Leave Type'"
                                                :icon="'tdesign:component-checkbox'"
                                                :size="'md'"
                                                :payload="assignedLeaveTypeSelectionsOptions"/>
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Effective Date"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions"
                                                high-light-all-text-on-focus
                                                v-model="effectiveDate"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`effective_date`"
                                                :size="'md'" />
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Adjustment Type"/>
                                            <SingleSelect
                                                :disabled="modalDisableActions"
                                                value-persist drop-shadow
                                                :size="'md'"
                                                :options="adjustmentTypeOptions"/>
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Balance"/>
                                            <Input
                                                :disabled="modalDisableActions"
                                                :size="'md'"
                                                v-model="balance"
                                                high-light-all-text-on-focus type-strict
                                                :type="'number'"/>
                                        </div>
                                        <div>
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
                                <div class="space-x-2 inline-flex">
                                    <div class="space-x-2 inline-flex items-center">
                                        <UnorderedList
                                            v-if="modalDisableActions"
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

                <div class="px-[20px] space-y-2">

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[disableActions ? 'pointer-events-none' : '']">
                        <Button v-if="leaveBalanceAdjustments.successful" @click="put(null)" class="w-min" :disabled="disableActions" :size="'sm'" :icon="'mdi:plus'"></Button>
                        <div v-if="leaveBalanceAdjustments.successful" class="scaffold-border px-2 font-[National_Park]">
                            <span><span class="font-semibold">{{selectedLeaveBalanceAdjustments.length}}</span> Selected</span>
                        </div>
                        <Button v-if="leaveBalanceAdjustments.successful" :variant="'outline'" :size="'sm'" :icon="'mdi:delete-outline'" :disabled="disableActions" :label="'Bulk delete'" @click="confirmDeleteSelected()" />
                        <Button
                            v-if="leaveBalanceAdjustments.successful"
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'tdesign:close'"
                            :disabled="disableActions"
                            :label="'Clear selection'"
                            @click="selectedLeaveBalanceAdjustments = []" />
                        <Label v-if="!leaveBalanceAdjustments.successful" invert :size="'md'" :type="'danger'" :label="leaveBalanceAdjustments.message" />
                    </div>

                    <DataTable
                        v-if="leaveBalanceAdjustments.successful"
                        :sup-headers="leaveBalanceAdjustmentsSupHeaders"
                        :headers="leaveBalanceAdjustmentsHeaders"
                        :size="'lg'"
                        :rows="leaveBalanceAdjustments.data"
                        :disabled="disableDataTable"
                        v-model="selectedLeaveBalanceAdjustments"
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
                                        {type: 'action', icon: 'mdi:edit', title: 'Edit Adjustment',callback: () => {put(cell);}},
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
                        <template v-slot:cell.code="{cell,slot}">
                            <div class="p-[3px]">{{cell.leave_type?.code}}</div>
                        </template>
                        <template v-slot:cell.name="{cell,slot}">
                            <div class="p-[3px]">{{cell.leave_type?.name}}</div>
                        </template>
                        <template v-slot:cell.type="{cell,slot}">
                            <div class="p-[3px]">{{cell.type?.text}}</div>
                        </template>
                    </DataTable>

                    <div>
                        <PageInformation :pagination="leaveBalanceAdjustments.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="leaveBalanceAdjustments.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
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
import type {DateTimePickerOptionsT} from "@/public/js/datetimepicker/type";
import type {SingleSelectPaginatedInstance} from "@/public/js/types/component-instance";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Leave Balance Adjustments`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const $waitUntil = nuxtApp.$waitUntil as (condition: () => boolean, interval?: number, timeout?: number) => Promise<any>;
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

    if(_isEmpty(selection) || selection.indexOf('assigned_leave_type') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            assignedLeaveTypeSelectionsOptions, assignedLeaveTypeSelectionsOptionsKey, SELECT.SINGLE_PAGINATED
        );
    }
}

const leaveBalanceAdjustmentsSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},
    {text: 'Employee', colspan: 2,  alignHeader: 'left'},
    {text: 'Leave Type', colspan: 2,  alignHeader: 'left'},
    {text: 'Leave Balance Adjustment', colspan: 4,  alignHeader: 'left'},
]);

const leaveBalanceAdjustmentsHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions', minWidth: '33px'},
    { text: 'Employee #', value: 'employee_number', alignData: 'left'},
    { text: 'Name', value: 'employee_full_name', alignData: 'left', minWidth: '200px'},

    { text: 'Code', value: 'code', minWidth: '143px'},
    { text: 'Name', value: 'name', minWidth: '143px'},
    
    { text: 'Type', value: 'type', minWidth: '143px'},
    { text: 'Effective Date', value: 'effective_date', minWidth: '143px'},
    { text: 'Balance', value: 'balance', alignData: 'right', minWidth: '143px'},
    { text: 'Remarks', value: 'remarks', alignData: 'left', minWidth: '143px'},
]);

const leaveBalanceAdjustments = reactive<DataTableT>({
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
    perPage: 15,
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
            search: filters.search.keyword,
            assigned_employee_group_ids: employeeGroupOptions.selected,
            department_ids: departmentOptions.selected,
            designation_ids: designationOptions.selected,
        }
    };
});

const leaveBalanceAdjustmentsPending = ref(false)
const selectedLeaveBalanceAdjustments = ref([]);
const deleting = ref(false);

const disableActions = computed(() => {
    return leaveBalanceAdjustmentsPending.value || createEditPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return leaveBalanceAdjustmentsPending.value || companyAssociationPendingState().value;
});
const leaveBalanceAdjustmentsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    leaveBalanceAdjustmentsPending.value = true;

    await laraFetch(`/api/leave-balance-adjustments`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            leaveBalanceAdjustmentsPending.value = false;
        },
        onResponse: (request, options, response) => {
            leaveBalanceAdjustmentsPending.value = false;
            leaveBalanceAdjustments.successful = _get(response, '_data.successful', false);
            leaveBalanceAdjustments.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            leaveBalanceAdjustments.data = _get(response, '_data.values.data', [])
            leaveBalanceAdjustments.meta = _get(response, '_data.values.meta', {
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
leaveBalanceAdjustmentsExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedLeaveBalanceAdjustments.value = [];
    }

    if(filters.page === page){
        leaveBalanceAdjustmentsExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const confirmDeleteSelected = () => {

    const selectedIds = selectedLeaveBalanceAdjustments.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected adjustment to delete.`,
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
        message: `Confirm delete selected adjustment${selectedIds.length > 1 ? 's' : ''}?`,
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

    selectedIds = selectedLeaveBalanceAdjustments.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/leave-balance-adjustments", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            leave_balance_adjustment_ids: selectedIds,
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
                message: `Adjustment${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedLeaveBalanceAdjustments.value = [];
    await leaveBalanceAdjustmentsExecute();
}

const stagedLeaveBalanceAdjustment = ref<{
    'id': string | number | null,
    'ulid': string | null,
}>({
    'id': null,
    'ulid': null,
});

const creatingOrEditing = ref(false);
const settingUpEditable = ref(false);
const createEditPending = ref(false);
const editPayload = ref({});

const put = async (row: TableRowT | null = null) => {

    creatingOrEditing.value = true;

    if(row){
        editPayload.value = row;
        settingUpEditable.value = true;

        stagedLeaveBalanceAdjustment.value = {
            'id': _get(editPayload.value, 'id', null),
            'ulid': _get(editPayload.value, 'ulid', null),
        };
        
        employeeOptions.selected = _get(editPayload.value, 'employee_id', null);
        employeeOptionsKey.value++;

        try{
            await $waitUntil(() => employeeSingleSelectPaginatedReference.value?.pending == false);
        } catch(error){
            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Timeout Error`,
                message: `Check your internet connection and try again later.`,
                action: {
                    callback: () => {closeModal();},
                    label: 'Okay'
                }
            });
        }

        assignedLeaveTypeSelectionsOptions.selected = _get(editPayload.value, 'leave_type.id', null);
        assignedLeaveTypeSelectionsOptionsKey.value++;

        effectiveDate.value = _get(editPayload.value, 'effective_date', '');
        adjustmentTypeOptions.selected = _get(editPayload.value, 'type.value', null);
        balance.value = _get(editPayload.value, 'balance', 0);
        remarks.value = _get(editPayload.value, 'remarks', '');

        settingUpEditable.value = false;
    } else {

        effectiveDate.value = nuxtApp.$moment().format("YYYY-MM-DD");
        adjustmentTypeOptions.selected = LEAVE_BALANCE_ADJUSTMENT_TYPE.ADD as number
        balance.value = 0;
        remarks.value = '';
    }

    renderDatePickers();
}

const renderDatePickers = () => {

    let adjustmentDatePicker: DateTimePickerOptionsT = {
        id: 'effective_date',
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            effectiveDate.value = payload.value;
        }
    };

    render([adjustmentDatePicker]);
}

const creatingLeaveBalanceAdjustment = computed(() => {
    return stagedLeaveBalanceAdjustment.value.id == null;
});

const effectiveDate = ref('');
const adjustmentTypeOptions = reactive<{
    search: string,
    selection: EnumSelection,
    selected: number | null
}>({
    search: '',
    selection: [
        $enumerableOption(LEAVE_BALANCE_ADJUSTMENT_TYPE_NAME, LEAVE_BALANCE_ADJUSTMENT_TYPE.ADD as number),
        $enumerableOption(LEAVE_BALANCE_ADJUSTMENT_TYPE_NAME, LEAVE_BALANCE_ADJUSTMENT_TYPE.DEDUCT as number),
    ],
    selected: LEAVE_BALANCE_ADJUSTMENT_TYPE.ADD as number
});
const balance = ref(0);
const remarks = ref('');

const resetEditable = () => {
    stagedLeaveBalanceAdjustment.value = {
        'id': null,
        'ulid': null,
    };
    editPayload.value = {};
    employeeOptions.selected = null;
    employeeOptionsKey.value++;
    assignedLeaveTypeSelectionsOptions.selected = null;
    assignedLeaveTypeSelectionsOptionsKey.value++;

    effectiveDate.value = '';
    adjustmentTypeOptions.selected = LEAVE_BALANCE_ADJUSTMENT_TYPE.ADD as number
    balance.value = 0;
    remarks.value = '';
}

const employeeSingleSelectPaginatedReference = useTemplateRef<SingleSelectPaginatedInstance>('employeeSingleSelectPaginated');
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

    if(!settingUpEditable.value){

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

const leaveTypeSingleSelectPaginatedReference = useTemplateRef<SingleSelectPaginatedInstance>('leaveTypeSingleSelectPaginated');
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

const modalDisableActions = computed(()=>{
    return  modalLoading.value
        || modalSubmitPending.value
        || settingUpEditable.value
        || employeeSingleSelectPaginatedReference.value?.pending
        || leaveTypeSingleSelectPaginatedReference.value?.pending;
});
const modalLoading = ref(false);
const modalSubmitPending = ref(false);

const modalSubmitButtonIcon = computed(()=>{
    const ICON = {
        CREATE: 'mdi:plus',
        EDIT: 'ic:sharp-save'
    } as const;

    const isEditMode = !creatingLeaveBalanceAdjustment.value;

    return isEditMode ? ICON.EDIT : ICON.CREATE;
});
const modalSaveButtonLabel = computed(()=>{
    const LABEL = {
        CREATE: `Create`,
        EDIT: `Save`
    } as const;

    const isEditMode = !creatingLeaveBalanceAdjustment.value;

    return isEditMode ? LABEL.EDIT : LABEL.CREATE;
});

const modalSubmitPath = computed(() => {
    if(!creatingLeaveBalanceAdjustment.value){
        return `/api/leave-balance-adjustment/${stagedLeaveBalanceAdjustment.value.ulid}`;
    } else {
        return `/api/leave-balance-adjustment`
    }
});
const modalSubmitAction = computed(() => {
    if(!creatingLeaveBalanceAdjustment.value){
        return `PATCH`;
    } else {
        return `POST`;
    }
});
const modalForm = computed(()=>{
    return {
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        employee_id: employeeOptions.selected,
        leave_type_id: assignedLeaveTypeSelectionsOptions.selected,
        type: adjustmentTypeOptions.selected,
        effective_date: effectiveDate.value,
        balance: balance.value,
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
                message: `Adjustment ${creatingLeaveBalanceAdjustment.value ? 'created' : 'updated'}.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            closeModal();
            await leaveBalanceAdjustmentsExecute();
        },
    });
}
</script>

<style scoped>

</style>