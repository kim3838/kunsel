<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Employee Status" />
                            <MultiSelect glint drop-shadow :selection-max-viewable-line="5" :size="'md'" :options="employmentStatusOptions" :icon="'tdesign:component-checkbox'"/>
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
                        <PageInformation :pagination="employees.meta.pagination" :pending="employeesPending"/>
                        <Pagination :size="'lg'" :pagination="employees.meta.pagination" :pending="employeesPending" v-model="pageComputed"/>
                    </div>
                </form>

                <div class="px-[20px]">
                    <div class="mb-2 flex items-center min-h-8">
                        <UnorderedList
                            v-if="disableActions"
                            :icon="'eos-icons:loading'"
                            :size="'md'"
                            :label="'Please wait...'"/>
                        <NuxtLink
                            v-else
                            :to="`/workforce/employees/create-employee`">
                            <Button class="w-min" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="disableActions ? 'Please wait' : ''"></Button>
                        </NuxtLink>
                    </div>

                    <div v-if="viewMode.selected == DATA_VIEW_MODE.FLEX" class="flex flex-row flex-wrap gap-4">

                        <div v-for="employee in employees.data" :key="employee.id" class="flex-grow scaffold-border p-4 space-y-2">
                            <div>
                                <div class="mb-2 flex justify-between min-h-8">
                                    <div>
                                        <div class="text-xs">Family name,(Middle), Given</div>
                                        <NuxtLink
                                            :to="`/workforce/employees/${employee.ulid}`">
                                            <span class="text-lg font-header cursor-pointer hover:underline">{{employee.full_name}}</span>
                                        </NuxtLink>
                                    </div>

                                    <NuxtLink
                                        v-if="false"
                                        :to="`/workforce/employees/${employee.ulid}`">
                                        <Button type="button" :variant="'outline'" :icon="'mdi:checkbook'" :size="'sm'"  :label="'info'"></Button>
                                    </NuxtLink>
                                </div>

                                <table class="border-separate font-sans">
                                    <tbody>
                                        <tr><td class="">Number:</td><td class="pl-2 font-semibold">{{ _get(employee, 'number', null) }}</td></tr>
                                        <tr>
                                            <td class="flex justify-start">Contact:</td>
                                            <td class="pl-2">
                                                <span v-if="_isEmpty(_compact([employee.contact?.office_email, employee.contact?.personal_email, employee.contact?.office_phone, employee.contact?.personal_phone]))">None</span>
                                                <div v-else class="text-sm" :class="index == 0 ? 'inline-block' : 'block'" v-for="(contact, index) in _compact([employee.contact?.office_email, employee.contact?.personal_email, employee.contact?.office_phone, employee.contact?.personal_phone])">{{contact}}</div>
                                            </td>
                                        </tr>
                                        <tr><td class="">Department:</td><td class="pl-2">{{ _get(employee, 'department.name', null) }}</td></tr>
                                        <tr><td class="">Designation:</td><td class="pl-2">{{ _get(employee, 'designation.name', null) }}</td></tr>
                                        <tr>
                                            <td class="">Manager:</td>
                                            <td class="pl-2">
                                                <NuxtLink
                                                    :to="`/workforce/employees/${_get(employee, 'manager.ulid', null)}`">
                                                    <span class="cursor-pointer hover:underline">{{ _get(employee, 'manager.full_name', null) }}</span>
                                                </NuxtLink>
                                            </td>
                                        </tr>
                                        <tr><td class="">Gender:</td><td class="pl-2">{{ _get(employee, 'gender.text', null) }}</td></tr>
                                        <tr><td class="">Marital Status:</td><td class="pl-2">{{ _get(employee, 'marital_status.text', null) }}</td></tr>
                                    </tbody>
                                </table>
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
                        <template v-slot:cell.actions="{cell,slot: cellSlot}">
                            <div class="flex items-center">
                                <NavDrop
                                    class="z-10"
                                    :disabled="disableActions"
                                    :parent-icon="'ic:baseline-arrow-right'"
                                    in-horizontal-scrollable
                                    :size="`sm`"
                                    :drop-shadow-size="`lg`"
                                    :title="'Menu'"
                                    :drop-align="'top'"
                                    :drop-justify="'right'"
                                    :drop-options="[
                                        {type: 'link',title: 'Details',to: `/workforce/employees/${cell.ulid}`},
                                        {type: 'action',title: 'Basic Info',callback: () => {},},
                                        {type: 'action',title: 'Contact Info',callback: () => {},},
                                        {type: 'action',title: 'Employment Status',callback: () => {},},
                                        {type: 'action',title: 'Payroll Components',callback: () => {},},
                                    ]">
                                </NavDrop>
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
                        <template v-slot:cell.office_email="{cell,slot}">
                            <div class="p-[3px]">
                                {{cell.contact?.office_email}}
                            </div>
                        </template>
                        <template v-slot:cell.personal_email="{cell,slot}">
                            <div class="p-[3px]">
                                {{cell.contact?.personal_email}}
                            </div>
                        </template>
                        <template v-slot:cell.office_phone="{cell,slot}">
                            <div class="p-[3px]">
                                {{cell.contact?.office_phone}}
                            </div>
                        </template>
                        <template v-slot:cell.personal_phone="{cell,slot}">
                            <div class="p-[3px]">
                                {{cell.contact?.personal_phone}}
                            </div>
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
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
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
    { text: 'Family name, Middle, Given', value: 'full_name'},
    { text: 'Department', value: 'department'},
    { text: 'Designation', value: 'designation'},
    { text: 'Manager', value: 'manager'},
    { text: 'Email', value: 'office_email'},
    { text: '', value: 'personal_email'},
    { text: 'Phone', value: 'office_phone'},
    { text: '', value: 'personal_phone'},
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
    selected: DATA_VIEW_MODE.LIST
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
            company_id: selectedAssociatedCompanyId.value,
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