<template>
    <div class="space-y-2 px-[20px]">
        <form @submit.prevent="paginate(1, true)" class="space-y-2 pb-[20px]">
            <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ">
                <div>
                    <InputLabel :size="'sm'" value="Search" />
                    <Input :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search" :disabled="disableActions" type="text"/>
                </div>
                <div>
                    <InputLabel :size="'sm'" value="Employee Status" />
                    <MultiSelect :key="employmentStatusOptionsKey" glint drop-shadow :selection-max-viewable-line="15" :size="'md'" :options="employmentStatusOptions" :disabled="disableActions" :icon="'tdesign:component-checkbox'"/>
                </div>
                <div>
                    <InputLabel :size="'sm'" value="Employment Type"/>
                    <MultiSelect :key="employmentTypeOptionsKey" glint drop-shadow :selection-max-viewable-line="15" :size="'md'" :options="employmentTypeOptions" :disabled="disableActions" :icon="'tdesign:component-checkbox'"/>
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

            <div>
                <PageInformation :pagination="leaveTypeAssignments.meta.pagination" :pending="disableDataTable"/>
                <div class="flex items-center gap-2">
                    <Pagination
                        :size="'lg'"
                        :pagination="leaveTypeAssignments.meta.pagination"
                        :pending="disableDataTable"
                        v-model="pageComputed"/>
                    <UnorderedList
                        v-if="disableActions"
                        :icon="'eos-icons:loading'"
                        :size="'md'"
                        :label="'Please wait...'"/>
                </div>
            </div>
        </form>

        <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
            <div class="scaffold-border px-2 font-[National_Park]">
                <span><span class="font-semibold">{{selectedLeaveTypeAssignments.length}}</span> Selected</span>
            </div>
            <Button
                :variant="'outline'"
                :size="'sm'"
                :icon="'tdesign:close'"
                :disabled="disableActions"
                :label="'Clear selection'"
                @click="selectedLeaveTypeAssignments = []" />
            <Button
                :variant="'outline'"
                :size="'sm'"
                :icon="'mdi:delete-outline'"
                :disabled="disableActions"
                :label="'Delete selected leave type assignments'"
                @click="confirmDeleteSelected()" />
        </div>

        <DataTable
            :sup-headers="leaveTypeAssignmentSupHeaders"
            :headers="leaveTypeAssignmentHeaders"
            :size="'lg'"
            :rows="leaveTypeAssignments.data"
            :disabled="disableDataTable"
            v-model="selectedLeaveTypeAssignments"
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
                            {type: 'action', title: 'Edit assignment settings',callback: () => {$emit('editLeaveTypeSettings', cell)}}
                        ]">
                    </NavDrop>
                </div>
            </template>
            <template v-slot:cell.employee_current_employment_profile="{cell,slot}">
                <div class="flex space-x-1 px-[0.3rem] items-center">
                    <Label :size="slot.labelSize" :type="cell._payload.label_shade.value" shade :label="cell.employee_current_employment_profile?.status?.text" />
                </div>
            </template>
            <template v-slot:cell.employee_current_employment_type="{cell,slot}">
                <div class="px-[3px]">{{cell.employee_current_employment_profile?.employment_type?.text}}</div>
            </template>

            <template v-slot:cell.employee_department="{cell,slot}">
                <div class="p-[3px]">{{cell.employee_department?.name}}</div>
            </template>
            <template v-slot:cell.employee_designation="{cell,slot}">
                <div class="p-[3px]">{{cell.employee_designation?.name}}</div>
            </template>
            <template v-slot:cell.leave_type_code="{cell,slot}">
                <div class="p-[3px]">{{cell.leave_type_code}}</div>
            </template>
            <template v-slot:cell.leave_type_assignment_override_balance_upon_eligibility="{cell,slot}">
                <div class="p-[3px]">{{cell.leave_type_assignment_override_balance_upon_eligibility ? 'Yes' : 'No'}}</div>
            </template>
            <template v-slot:cell.leave_type_assignment_balance_upon_eligibility="{cell,slot}">
                <div class="p-[3px]">
                    <span v-if="Boolean(cell.leave_type_assignment_override_balance_upon_eligibility)">
                        {{cell.leave_type_assignment_balance_upon_eligibility}}
                    </span>
                </div>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type {DataTableMeta, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection, StringEnumInterface} from "@/public/js/common/type";
import {storeToRefs} from "pinia";

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const common = useCommon();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

const props = defineProps({
    pending: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['editLeaveTypeSettings', 'update:pending'])

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        rebuildSelections();
        paginate(1, true);
    }
});

const rebuildSelections = (selection: string[] = []) => {

    if(_isEmpty(selection) || selection.indexOf('employment_status') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            employmentStatusOptions, employmentStatusOptionsKey, SELECT.MULTI_STATIC, employmentStatusOptions.selection
        );
    }

    if(_isEmpty(selection) || selection.indexOf('employment_type') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            employmentTypeOptions, employmentTypeOptionsKey, SELECT.MULTI_STATIC, employmentTypeOptions.selection
        );
    }

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

const employmentStatusOptionsKey = shallowRef(0);
const employmentStatusOptions = reactive({
    search: '',
    selection: [
        {text : 'Active', value: USER_STATUS.ACTIVE} as EnumOption,
        {text : 'Inactive', value: USER_STATUS.INACTIVE} as EnumOption,
    ],
    selected: [USER_STATUS.ACTIVE]
});
const employmentTypeOptionsKey = shallowRef(0);
const employmentTypeOptions = reactive<{
    search: string,
    selection: EnumSelection,
    selected: number[]
}>({
    search: '',
    selection: [
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.OJT as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.INTERN as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.PROBATIONARY as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.FULL_TIME as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.PART_TIME as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.CONTRACT as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.NOT_SPECIFIED as number),
    ],
    selected: []
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

const leaveTypeAssignmentSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},
    {text: 'Employee', colspan: 2, alignHeader: 'left'},
    {text: 'Employment', colspan: 2, alignHeader: 'left'},
    {text: '', colspan: 2},
    {text: 'Leave Type', colspan: 2},
    {text: 'Override balance', colspan: 2},
]);

const leaveTypeAssignmentHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions'},
    { text: 'Employee #', value: 'employee_number', alignData: 'left'},
    { text: 'Name', value: 'employee_full_name'},
    { text: 'Status', value: 'employee_current_employment_profile'},
    { text: 'Type', value: 'employee_current_employment_type'},
    { text: 'Department', value: 'employee_department'},
    { text: 'Designation', value: 'employee_designation'},
    { text: 'Code', value: 'leave_type_code'},
    { text: 'Balance upon eligibility', value: 'leave_type_initial_balance_upon_eligibility'},
    { text: '', value: 'leave_type_assignment_override_balance_upon_eligibility'},
    { text: '', value: 'leave_type_assignment_balance_upon_eligibility'},
]);

const leaveTypeAssignments = reactive<{
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
let paramsComputed = computed(() => {
    return {
        page: filters.page,
        perPage: filters.perPage,
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            search: filters.search.keyword,
            employment_status: employmentStatusOptions.selected,
            employment_type: employmentTypeOptions.selected,
            assigned_employee_group_ids: employeeGroupOptions.selected,
            department_ids: departmentOptions.selected,
            designation_ids: designationOptions.selected,
        }
    };
});
const leaveTypeAssignmentsPending = ref(false);
const selectedLeaveTypeAssignments = ref([]);
const deleting = ref(false);

const disableActions = computed(() => {
    return leaveTypeAssignmentsPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return leaveTypeAssignmentsPending.value || deleting.value || companyAssociationPendingState().value;
});
const leaveTypeAssignmentsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    leaveTypeAssignmentsPending.value = true;

    await laraFetch(`/api/leave-type-assignments`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            leaveTypeAssignmentsPending.value = false;
        },
        onResponse: () => {
            leaveTypeAssignmentsPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            leaveTypeAssignments.data = _get(response, '_data.values.data', []).map(leaveTypeAssignment => {

                let shade = _get(leaveTypeAssignment, 'employee_current_employment_profile.is_active', false)
                    ? 'success'
                    : 'default';

                return {
                    ...leaveTypeAssignment,
                    _payload: {
                        'label_shade': {
                            'cell': ['employee_current_employment_profile', 'employee_current_employment_type'],
                            'value': shade
                        }
                    }
                };
            });

            leaveTypeAssignments.meta = _get(response, '_data.values.meta', {
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
await leaveTypeAssignmentsExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedLeaveTypeAssignments.value = [];
    }

    if(filters.page === page){
        leaveTypeAssignmentsExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const confirmDeleteSelected = () => {

    if(selectedLeaveTypeAssignments.value.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected leave type assignments to delete.`,
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
        message: `Confirm delete selected leave type assignments`,
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

    selectedIds = selectedLeaveTypeAssignments.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;
    emit('update:pending', true);

    await laraFetch("/api/leave-type-assignments", {
        method: 'DELETE',
        body: {
            company_id: selectedAssociatedCompanyId.value,
            shift_assignment_ids: selectedIds,
        },
    },{
        onRequestError: (request, options, error) => {
            deleting.value = false;
            emit('update:pending', false);
        },
        onResponse: () => {
            deleting.value = false;
            emit('update:pending', false);
        },
        onSuccessResponse: async (request, options, response) => {

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: `Leave type assignments deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedLeaveTypeAssignments.value = [];
    await leaveTypeAssignmentsExecute();
}

defineExpose({
    paginate,
    rebuildSelections
});
</script>

<style scoped>

</style>