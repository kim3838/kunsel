<template>
    <div :class="[compact ? '' : 'px-[20px]']">
        <form @submit.prevent="paginate(1, clearSelectionOnFormSubmit)" class="space-y-2" :class="[compact ? '' : 'pb-[20px]']">
            <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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

            <div class="grid gap-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                <div class="col-span-2">
                    <InputLabel :size="'sm'" value="Assigned Shift" />
                    <MultiSelectPaginated
                        :key="assignedShiftSelectionsOptionsKey"
                        :icon="'tdesign:component-checkbox'"
                        :disabled="disableActions"
                        glint
                        drop-shadow
                        :size="'md'"
                        :label="'Filter Shift(s)'"
                        :payload="assignedShiftSelectionsOptions"
                    />
                </div>
                <div class="col-span-2">
                    <InputLabel :size="'sm'" value="Not Assigned Shift" />
                    <MultiSelectPaginated
                        :key="notAssignedShiftSelectionsOptionsKey"
                        :icon="'tdesign:component-checkbox'"
                        :disabled="disableActions"
                        glint
                        drop-shadow
                        :size="'md'"
                        :label="'Filter Shift(s)'"
                        :payload="notAssignedShiftSelectionsOptions"
                    />
                </div>
                <div v-if="compact" class="flex flex-col">
                    <div class="flex-none h-[1rem]"></div>
                    <div class="grow">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                    </div>
                </div>
            </div>

            <div v-if="!compact" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
            </div>

            <div>
                <PageInformation :pagination="employees.meta.pagination" :pending="disableDataTable"/>
                <div class="flex items-center gap-2">
                    <Pagination
                        :size="'lg'"
                        :pagination="employees.meta.pagination"
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

        <div class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[compact ? 'mt-2' : '']">
            <div v-if="employees.successful" class="scaffold-border px-2 font-[National_Park]">
                <span><span class="font-semibold">{{proxySelectedEmployees.length}}</span> {{selectedLabel}}</span>
            </div>
            <Button
                v-if="employees.successful"
                :variant="'outline'"
                :size="'sm'"
                :icon="'tdesign:close'"
                :disabled="disableActions"
                :label="clearSelectionLabel"
                @click="proxySelectedEmployees = []" />
            <label v-if="employees.successful" class="scaffold-border">
                <Checkbox
                    :disabled="disableActions"
                    @valueChanged="selectedFlagInteracted"
                    class="px-[0.3rem]"
                    v-model="showOnlySelected"
                    :size="'md'"
                    :label="showOnlySelectedLabel" />
            </label>
            <slot v-if="employees.successful" name="selection-actions"></slot>
            <Label v-if="!employees.successful" invert :size="'md'" :type="'danger'" :label="employees.message" />
        </div>

        <DataTable
            v-if="employees.successful"
            class="mt-2"
            :sup-headers="employeeSupHeaders"
            :headers="employeeHeaders"
            :size="'lg'"
            :rows="employees.data"
            :disabled="disableDataTable"
            :show-no-data="false"
            :pending="proxyPending"
            v-model="proxySelectedEmployees"
            selection>
            <template v-slot:cell.employee_current_employment_profile="{cell,slot}">
                <div class="flex space-x-1 px-[0.3rem] items-center">
                    <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.employee_current_employment_profile?.status?.text" />
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
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection, StringEnumInterface} from "@/public/js/common/type";
import type {LabelTypeT} from "@/public/js/types/theme";
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
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

const props = defineProps({
    selected: {
        type: Array,
        default: () => {
            return [];
        }
    },
    pending: {
        type: Boolean,
    },
    disableActions: {
        type: Boolean,
        default: false,
    },
    compact: {
        type: Boolean,
        default: false,
    },
    clearSelectionOnFormSubmit: {
        type: Boolean,
        default: true,
    },
    selectedLabel: {
        type: String,
        default: 'Selected'
    },
    clearSelectionLabel: {
        type: String,
        default: 'Clear selection'
    },
    showOnlySelectedLabel: {
        type: String,
        default: 'Show only selected'
    },
    filters: {
        type: Object,
        default: function () {
            return {}
        }
    },
});

const emit = defineEmits(["update:selected", "update:pending"]);
const proxySelectedEmployees = computed({
    get() {
        return props.selected;
    },
    set(newValue) {
        emit("update:selected", newValue);
    }
});
const proxyPending = computed({
    get() {
        return props.pending;
    },
    set(newValue) {
        emit("update:pending", newValue);
    }
});

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        rebuildSelections();
        paginate(1, true);
    }
})

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

    if(_isEmpty(selection) || selection.indexOf('assigned_shift') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            assignedShiftSelectionsOptions, assignedShiftSelectionsOptionsKey, SELECT.MULTI_PAGINATED
        );
    }

    if(_isEmpty(selection) || selection.indexOf('not_assigned_shift') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            notAssignedShiftSelectionsOptions, notAssignedShiftSelectionsOptionsKey, SELECT.MULTI_PAGINATED
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

const assignedShiftSelectionsOptionsKey = shallowRef(0);
const assignedShiftSelectionsOptions = reactive({
    fetch: {
        url: '/api/shift-selections',
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: [],
});

const notAssignedShiftSelectionsOptionsKey = shallowRef(0);
const notAssignedShiftSelectionsOptions = reactive({
    fetch: {
        url: '/api/shift-selections',
        filters: {
            company_id: selectedAssociatedCompanyId.value,
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

const employeeSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: 'Employee', colspan: 2, alignHeader: 'left'},
    {text: 'Employment', colspan: 2, alignHeader: 'left'},
    {text: '', colspan: 2},
    {text: 'Shift', colspan: 4},
]);

const employeeHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: 'Employee #', value: 'employee_number', alignData: 'left'},
    { text: 'Name', value: 'employee_full_name'},
    { text: 'Status', value: 'employee_current_employment_profile'},
    { text: 'Type', value: 'employee_current_employment_type'},
    { text: 'Department', value: 'employee_department'},
    { text: 'Designation', value: 'employee_designation'},
    { text: 'Code', value: 'assigned_shift_codes'},
]);

const employees = reactive<DataTableT>({
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
const clearData = () => {
    employees.data = [];
    employees.meta = {
        pagination: {
            total: 0,
            count: 0,
            per_page: 0,
            current_page: 0,
            total_pages: 0
        }
    };
};

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

let filterSelectedComputed = computed(() => {
    return {
        employee_ids: proxySelectedEmployees.value
    }
});
const showOnlySelected = ref(false);
const clearFlags = () => {
    showOnlySelected.value = false;
}

const selectedFlagInteracted = async () => {

    if(showOnlySelected.value && proxySelectedEmployees.value.length == 0){
        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: null,
            message: 'No selected.',
            action: {
                callback: () => {
                    showOnlySelected.value = false
                },
                label: 'Okay'
            }
        });

        return;
    }

    await nextTick();
    await paginate(1, false);
}

let paramsComputed = computed(() => {
    return {
        page: filters.page,
        perPage: filters.perPage,
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        filters: {
            ...props.filters,
            ...(showOnlySelected.value ? filterSelectedComputed.value : {}),
            company_id: selectedAssociatedCompanyId.value,
            search: filters.search.keyword,
            employment_status: employmentStatusOptions.selected,
            employment_type: employmentTypeOptions.selected,
            assigned_employee_group_ids: employeeGroupOptions.selected,
            department_ids: departmentOptions.selected,
            designation_ids: designationOptions.selected,
            assigned_shift_ids: assignedShiftSelectionsOptions.selected,
            not_assigned_shift_ids: notAssignedShiftSelectionsOptions.selected,
        }
    };
});
const employeesPending = ref(false)

const disableActions = computed(() => {
    return employeesPending.value || props.disableActions || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return employeesPending.value || props.disableActions || companyAssociationPendingState().value;
});
const employeesExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    employeesPending.value = true;
    emit("update:pending", true);

    await laraFetch(`/api/shifts-by-employees`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            employeesPending.value = false;
            emit("update:pending", false);
        },
        onResponse: (request, options, response) => {
            employeesPending.value = false;
            emit("update:pending", false);
            employees.successful = _get(response, '_data.successful', false);
            employees.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            employees.data = _get(response, '_data.values.data', []).map((employee: TableRowT) => {

                let shade = _get(employee, 'employee_current_employment_profile.is_active', false)
                    ? 'success'
                    : 'default';

                return {
                    ...employee,
                    _payload: {
                        'label_shade': {
                            'cell': ['employee_current_employment_profile', 'employee_current_employment_type'],
                            'value': shade
                        }
                    }
                };
            });

            employees.meta = _get(response, '_data.values.meta', {
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
await employeesExecute();

const paginate = async (page: number = 1, clearSelection: boolean = false) => {
    clearTimeout(filters.search.callback);

    if(clearSelection){
        emit("update:selected", []);
    }

    if(filters.page === page){
        await employeesExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const reset = async () => {
    clearFlags();
    clearData();
    await paginate(1, true);
}
defineExpose({
    paginate,
    clearFlags,
    clearData,
    reset,
    rebuildSelections
});
</script>

<style scoped>

</style>