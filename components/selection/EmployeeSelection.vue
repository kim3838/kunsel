<template>
    <div class="space-y-2" :class="[compact ? '' : 'px-[20px]']">
        <form @submit.prevent="paginate(1, true)" class="space-y-2" :class="[compact ? '' : 'pb-[20px]']">
            <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
                <PageInformation :pagination="employees.meta.pagination" :pending="employeesPending"/>
                <div class="flex items-center gap-2">
                    <Pagination :size="'lg'" :pagination="employees.meta.pagination" :pending="employeesPending" v-model="pageComputed"/>
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
                <span><span class="font-semibold">{{proxySelectedEmployees.length}}</span> Selected</span>
            </div>
            <Button
                :variant="'outline'"
                :size="'sm'"
                :icon="'tdesign:close'"
                :disabled="disableActions"
                :label="'Clear selection'"
                :override="{font_family: 'National Park'}"
                @click="proxySelectedEmployees = []" />

            <slot name="selection-actions"></slot>
        </div>

        <DataTable
            :sup-headers="employeeSupHeaders"
            :headers="employeeHeaders"
            :size="'lg'"
            :rows="employees.data"
            :disabled="disableDataTable"
            v-model="proxySelectedEmployees"
            selection>
            <template v-slot:cell.current_employment_profile="{cell,slot}">
                <div class="flex space-x-1 px-[0.3rem] items-center">
                    <Label :size="slot.labelSize" :type="cell._payload.label_shade.value" shade :label="cell.current_employment_profile.status.text" />
                </div>
            </template>
            <template v-slot:cell.current_employment_type="{cell,slot}">
                <div class="px-[3px]">{{cell.current_employment_profile?.employment_type?.text}}</div>
            </template>

            <template v-slot:cell.department="{cell,slot}">
                <div class="p-[3px]">{{cell.department?.name}}</div>
            </template>
            <template v-slot:cell.designation="{cell,slot}">
                <div class="p-[3px]">{{cell.designation?.name}}</div>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type {DataTableMeta, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";

import {storeToRefs} from "pinia";

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

const props = defineProps({
    selected: {
        type: Array,
        default: () => {
            return [];
        }
    },
    disableActions: {
        type: Boolean,
        default: false,
    },
    compact: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["update:selected"]);
const proxySelectedEmployees = computed({
    get() {
        return props.selected;
    },
    set(newValue) {
        emit("update:selected", newValue);
    }
});

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

const employeeSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},
    {text: 'Employee Full Name', alignHeader: 'left'},
    {text: 'Employment', colspan: 2, alignHeader: 'left'},
    {text: '', colspan: 2},
]);

const employeeHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: 'Employee #', value: 'number', alignData: 'left'},
    { text: 'Family, Middle, Given', value: 'full_name'},
    { text: 'Status', value: 'current_employment_profile'},
    { text: 'Type', value: 'current_employment_type'},
    { text: 'Department', value: 'department'},
    { text: 'Designation', value: 'designation'},
]);

console.log({
    'props.eagerLoad' : props.eagerLoad,
    'employeeSupHeaders' : employeeSupHeaders,
    'employeeHeaders' : employeeHeaders,
});

const employees = reactive<{
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
        }
    };
});
const employeesPending = ref(false)

const disableActions = computed(() => {
    return employeesPending.value || props.disableActions
});
const disableDataTable = computed(() => {
    return employeesPending.value || props.disableActions
});
const employeesExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    employeesPending.value = true;

    await laraFetch(`/api/employees`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            employeesPending.value = false;
        },
        onResponse: () => {
            employeesPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            employees.data = _get(response, '_data.values.data', []).map(employee => {

                let shade = _get(employee, 'current_employment_profile.is_active', false)
                    ? 'success'
                    : 'default';

                return {
                    ...employee,
                    _payload: {
                        'label_shade': {
                            'cell': ['current_employment_profile', 'current_employment_type'],
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

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        emit("update:selected", []);
    }

    if(filters.page === page){
        employeesExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

defineExpose({
    paginate,
});
</script>

<style scoped>

</style>