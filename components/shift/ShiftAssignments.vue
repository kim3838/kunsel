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
                    <MultiSelect glint drop-shadow :selection-max-viewable-line="15" :size="'md'" :options="employmentStatusOptions" :disabled="disableActions" :icon="'tdesign:component-checkbox'"/>
                </div>
                <div>
                    <InputLabel :size="'sm'" value="Employment Type"/>
                    <MultiSelect glint drop-shadow :selection-max-viewable-line="15" :size="'md'" :options="employmentTypeOptions" :disabled="disableActions" :icon="'tdesign:component-checkbox'"/>
                </div>
                <div>
                    <InputLabel :size="'sm'" value="Department" />
                    <MultiSelect glint drop-shadow :selection-max-viewable-line="15" :size="'md'" :options="departmentOptions" :disabled="disableActions" :icon="'ic:baseline-all-inbox'"/>
                </div>
                <div>
                    <InputLabel :size="'sm'" value="Designation" />
                    <MultiSelect glint drop-shadow :selection-max-viewable-line="15" :size="'md'" :options="designationOptions" :disabled="disableActions" :icon="'ic:baseline-inbox'"/>
                </div>
            </div>
            <div class="grid gap-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                <div class="col-span-2">
                    <InputLabel :size="'sm'" value="Assigned Shift" />
                    <LazyMultiSelectPaginated
                        hydrate-on-interaction="mouseover"
                        :icon="'tdesign:component-checkbox'"
                        :disabled="disableActions"
                        drop-shadow
                        :size="'md'"
                        :label="'Filter Shift(s)'"
                        :payload="assignedShiftSelectionsOptions"
                    />
                </div>
            </div>

            <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
            </div>

            <div>
                <PageInformation :pagination="shiftAssignments.meta.pagination" :pending="shiftAssignmentsPending"/>
                <Pagination
                    :size="'lg'"
                    :pagination="shiftAssignments.meta.pagination"
                    :pending="shiftAssignmentsPending"
                    v-model="pageComputed"/>
            </div>
        </form>

        <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
            <div class="scaffold-border px-2 font-[National_Park]">
                <span><span class="font-semibold">{{selectedShiftAssignments.length}}</span> Selected</span>
            </div>
            <Button
                :variant="'outline'"
                :size="'sm'"
                :icon="'tdesign:close'"
                :disabled="disableActions"
                :label="'Clear selection'"
                :override="{font_family: 'National Park'}"
                @click="selectedShiftAssignments = []" />
            <Button
                :variant="'outline'"
                :size="'sm'"
                :icon="'mdi:delete-outline'"
                :disabled="disableActions"
                :label="'Delete selected shift assignments'"
                :override="{font_family: 'National Park'}"
                @click="confirmDeleteSelected()" />
            <UnorderedList
                v-if="disableActions"
                :icon="'eos-icons:loading'"
                :size="'md'"
                :label="'Please wait...'"/>
        </div>

        <DataTable
            :sup-headers="shiftAssignmentSupHeaders"
            :headers="shiftAssignmentHeaders"
            :size="'lg'"
            :rows="shiftAssignments.data"
            :disabled="disableDataTable"
            v-model="selectedShiftAssignments"
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
                            {type: 'action', title: 'Edit shift settings',callback: () => {$emit('editShiftSettings', cell)}}
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
            <template v-slot:cell.shift_code="{cell,slot}">
                <div class="p-[3px] font-semibold">
                    <NuxtLink :to="`/policies/shifts/${cell.shift_ulid}`" target="_blank" rel="noopener noreferrer" class="hover:underline">
                        {{cell.shift_code}}
                    </NuxtLink>
                </div>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type {DataTableMeta, TableHeaderT, TableRowT, TableSupHeaderT} from "~/public/js/types/data";

import {storeToRefs} from "pinia";

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const coreStore = useCoreStore();
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

const emit = defineEmits(['editShiftSettings', 'update:pending'])

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        paginate(1, true);
    }
})

const employmentStatusOptions = reactive({
    search: '',
    selection: [
        {text : 'Active', value: USER_STATUS.ACTIVE},
        {text : 'Inactive', value: USER_STATUS.INACTIVE},
    ],
    selected: [USER_STATUS.ACTIVE]
});
const employmentTypeOptions = reactive({
    search: '',
    selection: [
        {text : EMPLOYMENT_TYPE_NAME[EMPLOYMENT_TYPE.OJT], value: EMPLOYMENT_TYPE.OJT},
        {text : EMPLOYMENT_TYPE_NAME[EMPLOYMENT_TYPE.INTERN], value: EMPLOYMENT_TYPE.INTERN},
        {text : EMPLOYMENT_TYPE_NAME[EMPLOYMENT_TYPE.PROBATIONARY], value: EMPLOYMENT_TYPE.PROBATIONARY},
        {text : EMPLOYMENT_TYPE_NAME[EMPLOYMENT_TYPE.FULL_TIME], value: EMPLOYMENT_TYPE.FULL_TIME},
        {text : EMPLOYMENT_TYPE_NAME[EMPLOYMENT_TYPE.PART_TIME], value: EMPLOYMENT_TYPE.PART_TIME},
        {text : EMPLOYMENT_TYPE_NAME[EMPLOYMENT_TYPE.CONTRACT], value: EMPLOYMENT_TYPE.CONTRACT},
        {text : EMPLOYMENT_TYPE_NAME[EMPLOYMENT_TYPE.NOT_SPECIFIED], value: EMPLOYMENT_TYPE.NOT_SPECIFIED},
    ],
    selected: []
});

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

//Employee Organization
const companyOrganizationSelections = companyOrganizationSelectionsState();
const departmentOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.departments,
    selected: []
});
const designationOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.designations,
    selected: []
});

const shiftAssignmentSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},
    {text: ''},
    {text: 'Employee Full Name', alignHeader: 'left'},
    {text: 'Employment', colspan: 2, alignHeader: 'left'},
    {text: '', colspan: 2},
    {text: 'Shift', colspan: 4},
]);

const shiftAssignmentHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions'},
    { text: 'Employee #', value: 'employee_number', alignData: 'left'},
    { text: 'Family, Middle, Given', value: 'employee_full_name'},
    { text: 'Status', value: 'employee_current_employment_profile'},
    { text: 'Type', value: 'employee_current_employment_type'},
    { text: 'Department', value: 'employee_department'},
    { text: 'Designation', value: 'employee_designation'},
    { text: 'Code', value: 'shift_code'},
    { text: 'Name', value: 'shift_name'},
    { text: 'Start Date', value: 'shift_start_date'},
    { text: 'End Date', value: 'shift_end_date'},
]);

const shiftAssignments = reactive<{
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
            department_ids: departmentOptions.selected,
            designation_ids: designationOptions.selected,
            assigned_shift_ids: assignedShiftSelectionsOptions.selected,
        }
    };
});
const shiftAssignmentsPending = ref(false);
const selectedShiftAssignments = ref([]);
const deleting = ref(false);

const disableActions = computed(() => {
    return shiftAssignmentsPending.value || deleting.value;
});
const disableDataTable = computed(() => {
    return shiftAssignmentsPending.value || deleting.value;
});
const shiftAssignmentsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    shiftAssignmentsPending.value = true;

    await laraFetch(`/api/shift-assignments`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            shiftAssignmentsPending.value = false;
        },
        onResponse: () => {
            shiftAssignmentsPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            shiftAssignments.data = _get(response, '_data.values.data', []).map(shiftAssignment => {

                let shade = _get(shiftAssignment, 'employee_current_employment_profile.is_active', false)
                    ? 'success'
                    : 'default';

                return {
                    ...shiftAssignment,
                    _payload: {
                        'label_shade': {
                            'cell': ['employee_current_employment_profile', 'employee_current_employment_type'],
                            'value': shade
                        }
                    }
                };
            });

            shiftAssignments.meta = _get(response, '_data.values.meta', {
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
await shiftAssignmentsExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedShiftAssignments.value = [];
    }

    if(filters.page === page){
        shiftAssignmentsExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const confirmDeleteSelected = () => {

    if(selectedShiftAssignments.value.length == 0){

        coreStore.setServiceError({
            prompt: true,
            payload: {
                message: 'No selected shift assignments to delete.'
            }
        });

        return false;
    }

    useNuxtApp().$promptStore.setPrompt({
        resetable: true,
        icon: null,
        title: `Confirm delete selected shift assignments`,
        message: null,
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

    selectedIds = selectedShiftAssignments.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;
    emit('update:pending', true);

    await laraFetch("/api/shift-assignments", {
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

            coreStore.setServiceError({
                prompt: true,
                payload: {
                    message: 'Shift assignments deleted successfully.'
                }
            });
        }
    });

    selectedShiftAssignments.value = [];
    await shiftAssignmentsExecute();
}

defineExpose({
    paginate,
});
</script>

<style scoped>

</style>