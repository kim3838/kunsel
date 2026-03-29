<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-lg">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
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
                    :show="selectingEmployee"
                    :max-width="'480px'"
                    :closeable="false">
                    <template #title>

                    </template>
                    <template #content>
                        <div>
                            <fieldset class="neutral-border px-2 pb-2 space-y-2">
                                <legend class="text-base font-header">Create Employee Identification</legend>

                                <div class="grid gap-2 grid-cols-3">
                                    <div class="col-span-3 md:col-span-2">
                                        <InputLabel :size="'sm'" value="Select Employee"/>
                                        <SingleSelectPaginated
                                            :key="employeeOptionsKey"
                                            drop-shadow
                                            value-persist
                                            :selection-max-viewable-line="10"
                                            :label="'Select employee'"
                                            :size="'md'"
                                            :icon="'mdi:badge-account-outline'"
                                            @valueChange="setSelectedEmployee"
                                            :payload="employeeOptions"/>
                                    </div>
                                    <div v-if="$coreStore.hasNonPromptableServicePayloadMessage" class="col-span-full block">
                                        <Label invert :size="'sm'" :type="'danger'" :label="$coreStore.servicePayloadMessage" />
                                    </div>
                                </div>
                            </fieldset>

                        </div>
                    </template>
                    <template #footer>
                        <div class="mx-auto max-w-screen-xl">
                            <div class="flex space-x-2 justify-between">
                                <div class="space-x-2 inline-flex items-center">
                                </div>
                                <div class="space-x-2 inline-flex items-center">
                                    <Button
                                        class="w-min"
                                        :variant=" 'outline'"
                                        :size="'md'"
                                        :label="'Cancel'"
                                        @click="cancelSelectEmployee"/>
                                    <Button
                                        class="w-min"
                                        :variant="'default'"
                                        :size="'md'"
                                        :label="'Next'"
                                        @click="resolveSelectEmployee"/>
                                </div>
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <EmployeeIdentificationModal
                    v-model:creatingOrEditing="creatingOrEditing"
                    v-model:employeePayload="stagedEmployee"
                    v-model:editPayload="employeeIdentificationEditPayload"
                    isolated
                    @resolved="employeeIdentificationResolved"
                    @cancelled="employeeIdentificationCancelled"
                ></EmployeeIdentificationModal>

                <div class="px-[20px] space-y-2">

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[disableActions ? 'pointer-events-none' : '']">
                        <Button v-if="employeeIdentifications.successful" @click="selectEmployee" class="w-min" :disabled="disableActions" :size="'sm'" :icon="'mdi:plus'"></Button>
                        <div v-if="employeeIdentifications.successful" class="scaffold-border px-2 font-[National_Park]">
                            <span><span class="font-semibold">{{selectedEmployeeIdentifications.length}}</span> Selected</span>
                        </div>
                        <Button
                            v-if="employeeIdentifications.successful"
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'ph:backspace'"
                            :disabled="disableActions"
                            :label="'Clear selection'"
                            @click="selectedEmployeeIdentifications = []" />
                        <Button v-if="employeeIdentifications.successful" :variant="'outline'" :size="'sm'" :icon="'ph:trash-simple'" :disabled="disableActions" :label="'Bulk delete'" @click="confirmDeleteSelected()"/>
                        <Label v-if="!employeeIdentifications.successful" invert :size="'md'" :type="'danger'" :label="employeeIdentifications.message" />
                    </div>

                    <DataTable
                        v-if="employeeIdentifications.successful"
                        :sup-headers="employeeIdentificationsSupHeaders"
                        :headers="employeeIdentificationsHeaders"
                        :size="'lg'"
                        :rows="employeeIdentifications.data"
                        :disabled="disableDataTable"
                        v-model="selectedEmployeeIdentifications"
                        selection>
                        <template v-slot:cell.actions="{cell,slot: cellSlot}">
                            <div class="text-base h-[32px] px-2 gap-0.5 flex items-center justify-center cursor-pointer accent-hover" @click="put(cell)">
                                <span class="font-narrow-thin">Edit</span>
                                <Icon class="h-5 w-5" :name="'gg:external'"/>
                            </div>
                        </template>
                        <template v-slot:cell.employee_number="{cell,slot}">
                            <div class="p-[3px]">{{cell.employee.number}}</div>
                        </template>
                        <template v-slot:cell.employee_full_name="{cell,slot}">
                            <div class="p-[3px]">{{cell.employee.full_name}}</div>
                        </template>

                        <template v-slot:cell.type="{cell, slot, scrollReference}">
                            <div class="p-[3px]">{{cell.type.text}}</div>
                        </template>
                    </DataTable>

                    <div>
                        <PageInformation :pagination="employeeIdentifications.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="employeeIdentifications.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {EmployeeSelectionItemT, EmployeeT} from "@/public/js/types/employee";

useHead({titleTemplate: (titleChunk) => {return `Employee Identifications`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const common = useCommon();
const coreStore = useCoreStore();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId,
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, async (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        await rebuildSelections();
        paginate();
    }
});

const rebuildSelections = async (selection: string[] = []) => {

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
}

const employeeIdentificationsSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},
    {text: 'Employee', colspan: 2,  alignHeader: 'left'},
    {text: 'Identification', colspan: 3,  alignHeader: 'left'},
]);

const employeeIdentificationsHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions', minWidth: '33px'},
    { text: '#', value: 'employee_number', alignData: 'left'},
    { text: 'Name', value: 'employee_full_name', alignData: 'left'},

    { text: 'Type', value: 'type'},
    { text: 'Number', value: 'number'},
    { text: 'Readable number', value: 'readable_number'},
]);

const employeeIdentifications = reactive<DataTableT>({
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

//Employee Organization Selections
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

const employeeIdentificationsPending = ref(false)
const selectedEmployeeIdentifications = ref([]);
const deleting = ref(false);

const disableActions = computed(() => {
    return employeeIdentificationsPending.value || createEditPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return employeeIdentificationsPending.value || companyAssociationPendingState().value;
});
const employeeIdentificationsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    employeeIdentificationsPending.value = true;

    await laraFetch(`/api/employee-identifications`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            employeeIdentificationsPending.value = false;
        },
        onResponse: (request, options, response) => {
            employeeIdentificationsPending.value = false;
            employeeIdentifications.successful = _get(response, '_data.successful', false);
            employeeIdentifications.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            employeeIdentifications.data = _get(response, '_data.values.data', [])
            employeeIdentifications.meta = _get(response, '_data.values.meta', {
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
employeeIdentificationsExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedEmployeeIdentifications.value = [];
    }

    if(filters.page === page){
        employeeIdentificationsExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const confirmDeleteSelected = () => {

    const selectedIds = selectedEmployeeIdentifications.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected identifications to delete.`,
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
        message: `Confirm delete identification${selectedIds.length > 1 ? 's' : ''}?`,
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

    selectedIds = selectedEmployeeIdentifications.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/employee-identifications", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            employee_identification_ids: selectedIds,
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
                message: `Employee identification${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedEmployeeIdentifications.value = [];
    await employeeIdentificationsExecute();
}

const stagedEmployee = ref<{
    'id': string | number | null,
    'ulid': string | null,
    'number': string
    'full_name': string
}>({
    'id': null,
    'ulid': null,
    'number': '',
    'full_name': '',
});

const creatingOrEditing = ref(false);
const createEditPending = ref(false);
const employeeIdentificationEditPayload = ref({});

const selectingEmployee = ref(false);
const selectEmployee = () => {

    coreStore.resetServiceError();

    stagedEmployee.value = {
        'id': null,
        'ulid': null,
        'number': '',
        'full_name': '',
    };

    selectingEmployee.value = true;
}

const setSelectedEmployee = (employee: EmployeeSelectionItemT) => {

    stagedEmployee.value = {
        'id': _get(employee.payload, 'id', null),
        'ulid': _get(employee.payload, 'ulid', null),
        'number': _get(employee.payload, 'number', ''),
        'full_name': _get(employee.payload, 'full_name', ''),
    }
}

const resetStaged = () => {
    employeeOptions.selected = null;
    employeeOptionsKey.value++;
    selectingEmployee.value = false;
    stagedEmployee.value = {
        'id': null,
        'ulid': null,
        'number': '',
        'full_name': '',
    };
}

const cancelSelectEmployee = () => {
    resetStaged();
}
const resolveSelectEmployee = () => {

    if(Boolean(employeeOptions.selected)){

        put({
            employee_id: employeeOptions.selected,
            employee: {
                number: _get(stagedEmployee.value, 'number', ''),
                full_name: _get(stagedEmployee.value, 'full_name', ''),
            }
        });

        selectingEmployee.value = false;

    } else {
        coreStore.setServiceError({
            prompt: false,
            payload: {
                message: 'No employee selected.'
            }
        });
    }
}

const put = async (row: TableRowT | {} = {}) => {

    stagedEmployee.value = {
        'id': _get(row, 'employee_id', null),
        'ulid': _get(row, 'employee.ulid', null),
        'number': _get(row, 'employee.number', ''),
        'full_name': _get(row, 'employee.full_name', ''),
    };

    //@ts-ignore
    employeeIdentificationEditPayload.value = row;

    employeeOptions.selected = null;
    employeeOptionsKey.value++;
    creatingOrEditing.value = true;
}

const employeeIdentificationCancelled = () => {
    resetStaged();
}

const employeeIdentificationResolved = (attributes, rowIndex = -1) => {
    resetStaged();
    employeeIdentificationsExecute();
}
</script>

<style scoped>

</style>