<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Employee Status" />
                            <MultiSelect glint drop-shadow :selection-max-viewable-line="5" :size="'md'" :options="employmentStatusOptions" :icon="'mdi:checkbook'"/>
                        </div>
                    </div>

                    <div class="flex flex-row flex-wrap gap-2">
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
                        <PageInformation :pagination="employees.meta.pagination" :pending="employeesPending"/>
                        <Pagination :size="'lg'" :pagination="employees.meta.pagination" :pending="employeesPending" v-model="pageComputed"/>
                    </div>
                </form>

                <div class="px-[20px]">
                    <div class="mb-2 flex">
                        <NuxtLink
                            :to="`/workforce/employees/create-employee`">
                            <Button class="w-min" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="disableActions ? 'Please wait' : ''"></Button>
                        </NuxtLink>
                    </div>

                    <div v-if="viewMode.selected == DATA_VIEW_MODE.FLEX" class="flex flex-row flex-wrap gap-4">

                        <div v-for="employee in employees.data" :key="employee.id" class="flex-grow scaffold-border p-4 space-y-2">
                            <div>
                                <div class="text-base"><span class="font-semibold">{{employee.number}}</span>&nbsp;{{employee.full_name}}</div>
                                <div class="text-sm"><span>Gender: </span>{{employee.gender.text}}</div>
                                <div class="text-sm"><span>Marital Status: </span>{{employee.marital_status.text}}</div>
                            </div>

                            <div class="w-full space-x-0.5 flex items-center">
                                <NuxtLink
                                    :to="`/workforce/employees/${employee.ulid}`">
                                    <Button type="button" :variant="'outline'" :icon="'mdi:information-variant-circle-outline'" :size="'sm'"  :label="'info'" :override="{font_family: `GG Sans`}"></Button>
                                </NuxtLink>
                            </div>

                            <div>
                                <div class="text-sm"><span>Department: </span>{{employee.department?.name ?? 'None'}}</div>
                                <div class="text-sm"><span>Designation: </span>{{employee.designation?.name ?? 'None'}}</div>
                                <div class="text-sm"><span>Manager: </span>{{employee.manager?.name ?? 'None'}}</div>
                            </div>
                        </div>
                        <div v-if="noEmployeeRecords">
                            No Record Found.
                        </div>
                    </div>

                    <DataTable
                        v-if="viewMode.selected == DATA_VIEW_MODE.LIST"
                        :headers="employeesHeaders"
                        :size="'lg'"
                        :rows="employees.data"
                        :disabled="disableDataTable"
                        v-model="selectedEmployees"
                        selection>
                        <template v-slot:cell.actions="{cell,slot}">
                            <div class="h-full mx-0.5 space-x-0.5 w-full flex items-center">
                                <NuxtLink
                                    :to="`/workforce/employees/${cell.ulid}`">
                                    <Button type="button" :variant="'default'" :icon="'mdi:information-variant-circle-outline'" :size="slot.buttonSize" :label="'info'" :override="{font_family: `GG Sans`}"></Button>
                                </NuxtLink>
                            </div>
                        </template>
                        <template v-slot:cell.gender="{cell,slot}">
                            <div class="p-[3px]">{{cell.gender.text}}</div>
                        </template>
                        <template v-slot:cell.marital_status="{cell,slot}">
                            <div class="p-[3px]">{{cell.marital_status.text}}</div>
                        </template>
                        <template v-slot:cell.department="{cell,slot}">
                            <div class="p-[3px]">{{cell.department?.name}}</div>
                        </template>
                        <template v-slot:cell.designation="{cell,slot}">
                            <div class="p-[3px]">{{cell.designation?.name}}</div>
                        </template>
                        <template v-slot:cell.manager="{cell,slot}">
                            <div class="p-[3px]">{{cell.manager?.full_name}}</div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableMeta, TableHeaderT, TableRowT} from "@/public/js/types/data";
import {storeToRefs} from "pinia";

definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid', 'Employees.vue');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompany
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompany.value){
        paginate();
    }
});

const employmentStatusOptions = reactive({
    search: '',
    selection: [
        {text : 'Active', value: USER_STATUS.ACTIVE},
        {text : 'Inactive', value: USER_STATUS.INACTIVE},
    ],
    selected: []
});

const employeesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions'},
    { text: 'Employee #', value: 'number', alignData: 'left'},
    { text: 'Full Name (Family, Middle, Given)', value: 'full_name'},
    { text: 'Gender', value: 'gender'},
    { text: 'Marital Status', value: 'marital_status'},
    { text: 'Department', value: 'department'},
    { text: 'Designation', value: 'designation'},
    { text: 'Manager', value: 'manager'},
]);

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
const noEmployeeRecords = computed(() => {
    return employees.meta.pagination.total === 0;
})
const viewMode = reactive<{
    selection: Array<{text: string, value: number}>;
    selected: number | null;
}>({
    selection: [
        {text : 'Flex', value: DATA_VIEW_MODE.FLEX},
        {text : 'List', value: DATA_VIEW_MODE.LIST},
    ],
    selected: DATA_VIEW_MODE.FLEX
});
watch(() => viewMode.selected,async viewModeType => {
    await nextTick();
    selectedEmployees.value = [];
    paginate(1, true);
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
            company_id: selectedAssociatedCompany.value,
            search: filters.search.keyword,
        }
    };
});
const employeesPending = ref(false)
const selectedEmployees = ref([]);

const disableActions = computed(() => {
    return employeesPending.value
});
const disableDataTable = computed(() => {
    return employeesPending.value
});
const employeesExecute = async() =>{

    if(!selectedAssociatedCompany.value){
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
            employees.data = _get(response, '_data.values.data', []);
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
        selectedEmployees.value = [];
    }

    if(filters.page === page){
        employeesExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});
</script>


<style scoped>

</style>