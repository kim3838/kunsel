<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Employee Status" />
                            <MultiSelect glint drop-shadow :selection-max-viewable-line="5" :size="'md'" :options="employmentStatusOptions" :icon="'mdi:checkbook'"/>
                        </div>
                    </div>

                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>

                    </div>

                    <div>
                        <PageInformation v-if="employees.meta.pagination.total > 0" :pagination="employees.meta.pagination" :no-record-label="'No Record Found'"/>
                        <Pagination :size="'lg'" :pagination="employees.meta.pagination" :pending="employeesPending" v-model="pageComputed"/>
                    </div>
                </form>

                <FansyFrame>
                    <template v-slot:content>
                        <div class="mb-2">
                            <NuxtLink
                                :to="`/workforce/employees/create-employee`">
                                <Button class="w-min" :variant="'outline'" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="'Create Employee'"></Button>
                            </NuxtLink>
                        </div>
                        <UnorderedList
                            v-if="disableActions"
                            :icon="'eos-icons:loading'"
                            :size="'md'"
                            :label="'Please wait...'"/>
                        <DataTable
                            :headers="employeesHeaders"
                            :size="'lg'"
                            :rows="employees.data"
                            :disabled="disableDataTable"
                            v-model="selectedEmployees"
                            selection>
                            <template v-slot:cell.action="{cell,slot}">
                                <div class="h-full mx-0.5 space-x-0.5 w-full flex items-center">
                                    <NuxtLink
                                        :to="`/workforce/employees/${cell.ulid}`">
                                        <Button type="button" :icon="'mdi:information-variant-circle-outline'" :size="slot.buttonSize" :label="'info'" :override="{font_family: `Quintessential`}"></Button>
                                    </NuxtLink>
                                </div>
                            </template>
                            <template v-slot:cell.gender="{cell,slot}">
                                <div class="p-[3px]">{{cell.gender.text}}</div>
                            </template>
                            <template v-slot:cell.marital_status="{cell,slot}">
                                <div class="p-[3px]">{{cell.marital_status.text}}</div>
                            </template>
                        </DataTable>
                    </template>
                </FansyFrame>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableMeta, TableHeaderT, TableRowT} from "@/public/js/types/data";
import {storeToRefs} from "pinia";

definePageMeta({middleware: ['auth', 'company-admin']});
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
    if(isAuthenticated.value){
        paginate();
    }
});

const employmentStatusOptions = reactive({
    search: '',
    data: [
        {text : 'Active', value: 0},
        {text : 'Inactive', value: 1},
    ],
    selection: [
        {text : 'Active', value: 0},
        {text : 'Inactive', value: 1},
    ],
    selected: []
});

const employeesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'action'},
    { text: 'Number', value: 'number', alignData: 'left'},
    { text: 'Name', value: 'full_name'},
    { text: 'Gender', value: 'gender'},
    { text: 'Marital Status', value: 'marital_status'},
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