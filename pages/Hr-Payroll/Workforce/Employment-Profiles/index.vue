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
                                <legend class="text-base font-header">Create Employment Profile</legend>

                                <div class="grid gap-2 grid-cols-3">
                                    <div class="col-span-3 md:col-span-2">
                                        <InputLabel :size="'sm'" value="Select Employee"/>
                                        <SingleSelectPaginated
                                            :key="employeeOptionsKey"
                                            drop-shadow
                                            value-persist
                                            :selection-max-viewable-line="10"
                                            :label="'Select Employee'"
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

                <EmploymentProfileModal
                    v-model:creatingOrEditing="creatingOrEditing"
                    v-model:employeePayload="stagedEmployee"
                    v-model:editPayload="employmentProfileEditPayload"
                    isolated
                    @resolved="employmentProfileResolved"
                    @cancelled="employmentProfileCancelled"
                ></EmploymentProfileModal>

                <div class="px-[20px] space-y-2">

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[disableActions ? 'pointer-events-none' : '']">
                        <Button v-if="employmentProfiles.successful" @click="selectEmployee" class="w-min" :disabled="disableActions" :size="'sm'" :icon="'mdi:plus'"></Button>
                        <div v-if="employmentProfiles.successful" class="scaffold-border px-2 font-[National_Park]">
                            <span><span class="font-semibold">{{selectedEmploymentProfiles.length}}</span> Selected</span>
                        </div>
                        <Button
                            v-if="employmentProfiles.successful"
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'ph:backspace'"
                            :disabled="disableActions"
                            :label="'Clear selection'"
                            @click="selectedEmploymentProfiles = []" />
                        <Button v-if="employmentProfiles.successful" :variant="'outline'" :size="'sm'" :icon="'ph:trash-simple'" :disabled="disableActions" :label="'Bulk delete'" @click="confirmDeleteSelected()"/>
                        <Label v-if="!employmentProfiles.successful" invert :size="'md'" :type="'danger'" :label="employmentProfiles.message" />
                    </div>

                    <DataTable
                        v-if="employmentProfiles.successful"
                        :sup-headers="employmentProfilesSupHeaders"
                        :headers="employmentProfilesHeaders"
                        :size="'lg'"
                        :rows="employmentProfiles.data"
                        :disabled="disableDataTable"
                        v-model="selectedEmploymentProfiles"
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

                        <template v-slot:cell.status="{cell, slot, scrollReference}">
                            <div class="p-[3px]">{{cell.status.text}}</div>
                        </template>
                        <template v-slot:cell.employment_type="{cell, slot, scrollReference}">
                            <div class="p-[3px]">{{cell.employment_type.text}}</div>
                        </template>
                        <template v-slot:cell.end_of_service_type="{cell, slot, scrollReference}">
                            <div class="p-[3px]">{{cell.end_of_service_type?.text}}</div>
                        </template>
                        <template v-slot:cell.start_date="{cell, slot, scrollReference}">
                            <div class="p-[3px]">{{cell.start_date_readable}}</div>
                        </template>
                        <template v-slot:cell.end_date="{cell, slot, scrollReference}">
                            <div class="p-[3px]">{{cell.end_date_readable}}</div>
                        </template>
                    </DataTable>

                    <div>
                        <PageInformation :pagination="employmentProfiles.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="employmentProfiles.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection, StringEnumInterface} from "@/public/js/common/type";
import type {EmployeeSelectionItemT} from "~/public/js/types/employee";

useHead({titleTemplate: (titleChunk) => {return `Employment Profiles`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const common = useCommon();
const coreStore = useCoreStore();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId
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

const employmentProfilesSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},
    {text: 'Employee', colspan: 2,  alignHeader: 'left'},
    {text: 'Employment', colspan: 5,  alignHeader: 'left'},
]);

const employmentProfilesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions', minWidth: '33px'},
    { text: '#', value: 'employee_number', alignData: 'left'},
    { text: 'Name', value: 'employee_full_name', alignData: 'left'},

    { text: 'Status', value: 'status'},
    { text: 'Employment Type', value: 'employment_type'},
    { text: 'Start Date', value: 'start_date'},
    { text: 'End Of Service Type', value: 'end_of_service_type'},
    { text: 'End Date', value: 'end_date'},
]);

const employmentProfiles = reactive<DataTableT>({
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
    perPage: 25,
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

const employmentProfilesPending = ref(false)
const selectedEmploymentProfiles = ref([]);
const deleting = ref(false);

const disableActions = computed(() => {
    return employmentProfilesPending.value || createEditPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return employmentProfilesPending.value || companyAssociationPendingState().value;
});
const employmentProfilesExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    employmentProfilesPending.value = true;

    await laraFetch(`/api/employment-profiles`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            employmentProfilesPending.value = false;
        },
        onResponse: (request, options, response) => {
            employmentProfilesPending.value = false;
            employmentProfiles.successful = _get(response, '_data.successful', false);
            employmentProfiles.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            employmentProfiles.data = _get(response, '_data.values.data', [])
            employmentProfiles.meta = _get(response, '_data.values.meta', {
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
employmentProfilesExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedEmploymentProfiles.value = [];
    }

    if(filters.page === page){
        employmentProfilesExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const confirmDeleteSelected = () => {

    const selectedIds = selectedEmploymentProfiles.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected employment profile to delete.`,
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
        message: `Confirm delete employment profile${selectedIds.length > 1 ? 's' : ''}?`,
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

    selectedIds = selectedEmploymentProfiles.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/employment-profiles", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            employment_profile_ids: selectedIds,
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
                message: `Employment profile${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedEmploymentProfiles.value = [];
    await employmentProfilesExecute();
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
const employmentProfileEditPayload = ref({});

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
    employmentProfileEditPayload.value = row;

    employeeOptions.selected = null;
    employeeOptionsKey.value++;
    creatingOrEditing.value = true;
}

const employmentProfileCancelled = () => {
    resetStaged();
}

const employmentProfileResolved = (attributes, rowIndex = -1) => {
    resetStaged();
    employmentProfilesExecute();
}
</script>

<style scoped>

</style>