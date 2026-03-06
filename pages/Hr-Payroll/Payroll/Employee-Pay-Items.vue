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
                        <div>
                            <InputLabel :size="'sm'" value="Formulable Type" />
                            <MultiSelect
                                :key="formulableTypeOptionsKey"
                                :icon="'tdesign:component-checkbox'"
                                :disabled="disableActions"
                                glint
                                drop-shadow
                                :selection-max-viewable-line="5"
                                :size="'md'"
                                :label="'Filter Formulable Type'"
                                :options="formulableTypeOptions"
                            />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Payroll Component Type" />
                            <MultiSelect
                                :key="payrollComponentTypeOptionsKey"
                                :icon="'tdesign:component-checkbox'"
                                :disabled="disableActions"
                                glint
                                drop-shadow
                                :selection-max-viewable-line="20"
                                :size="'md'"
                                :label="'Filter Payroll Component Type'"
                                :options="payrollComponentTypeOptions"
                            />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Payroll Item" />
                            <MultiSelect
                                :key="payrollComponentNameOptionsKey"
                                :icon="'tdesign:component-checkbox'"
                                :disabled="disableActions"
                                glint
                                drop-shadow
                                :selection-max-viewable-line="20"
                                :size="'md'"
                                :label="'Filter Payroll Item'"
                                :options="payrollComponentNameOptions"
                            />
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
                </form>

                <DialogModal
                    :show="selectingEmployee"
                    :max-width="'680px'"
                    :closeable="false">
                    <template #title>

                    </template>
                    <template #content>
                        <div>
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
                                        :payload="employeeOptions"
                                        @valueChange="setSelectedEmployee"/>
                                </div>
                            </div>

                            <div v-if="$coreStore.hasNonPromptableServicePayloadMessage" class="block">
                                <Label invert :size="'sm'" :type="'danger'" :label="$coreStore.servicePayloadMessage" />
                            </div>
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

                <PayrollComponentAssignmentModal
                    :single-formulable-mode="false"
                    v-model:creatingOrEditing="creatingOrEditing"
                    v-model:employeePayload="stagedEmployee"
                    v-model:editPayload="payrollComponentEditPayload"
                    v-model:payrollComponentFormulable="creatingOrEditingPayrollComponentFormulable"
                    v-model:payFrequency="stagedEmployeePayFrequency"
                    @resolved="payrollComponentResolved"
                    @cancelled="payrollComponentCancelled"
                ></PayrollComponentAssignmentModal>

                <div class="px-[20px] space-y-2">
                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[disableActions ? 'pointer-events-none' : '']">
                        <Button v-if="payrollComponents.successful" @click="selectEmployee" class="w-min" :disabled="disableActions" :size="'sm'" :icon="'mdi:plus'"></Button>
                        <div v-if="payrollComponents.successful" class="scaffold-border px-2 font-[National_Park]">
                            <span><span class="font-semibold">{{selectedPayrollComponents.length}}</span> Selected</span>
                        </div>
                        <Button
                            v-if="payrollComponents.successful"
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'tdesign:close'"
                            :disabled="disableActions"
                            :label="'Clear selection'"
                            @click="selectedPayrollComponents = []" />
                        <Button
                            v-if="payrollComponents.successful"
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'mdi:delete-outline'"
                            :disabled="disableActions"
                            :label="'Bulk delete'"
                            @click="confirmDeleteSelected()"/>
                        <Label v-if="!payrollComponents.successful" invert :size="'md'" :type="'danger'" :label="payrollComponents.message" />
                    </div>

                    <DataTable
                        v-if="payrollComponents.successful"
                        :sup-headers="payrollComponentsSupHeaders"
                        :headers="payrollComponentsHeaders"
                        :size="'lg'"
                        :rows="payrollComponents.data"
                        :disabled="disableDataTable"
                        v-model="selectedPayrollComponents"
                        selection>
                        <template v-slot:cell.actions="{cell,slot: cellSlot}">
                            <div class="text-base h-[32px]">
                                <div class="h-full flex items-center px-2 cursor-pointer accent-hover" @click="put(cell)">
                                    <span class="text-base font-sans">Edit</span>
                                </div>
                            </div>
                        </template>
                        <template v-slot:cell.employee_number="{cell,slot}">
                            <div class="p-[3px]">{{cell.employee.number}}</div>
                        </template>
                        <template v-slot:cell.employee_full_name="{cell,slot}">
                            <div class="p-[3px]">{{cell.employee.full_name}}</div>
                        </template>
                        <template v-slot:cell.employee_payroll_group="{cell,slot}">
                            <div class="p-[3px]">{{cell.employee.payroll_group?.type?.text}}</div>
                        </template>
                        <template v-slot:cell.formulable="{cell, slot, scrollReference}">
                            <div class="p-[3px]">{{cell.formulable_type?.text}}</div>
                        </template>
                        <template v-slot:cell.type="{cell, slot, scrollReference}">
                            <div class="p-[3px]">{{cell.payroll_componentable.type?.text}}</div>
                        </template>
                        <template v-slot:cell.name="{cell, slot, scrollReference}">
                            <div class="p-[3px]">{{cell.payroll_componentable.name}}</div>
                        </template>
                        <template v-slot:cell.pay_period="{cell, slot, scrollReference}">
                            <div class="p-[3px]">{{cell.pay_period?.text}}</div>
                        </template>
                        <template v-slot:cell.pay_type="{cell, slot, scrollReference}">
                            <div class="p-[3px]">{{cell.pay_type?.text}}</div>
                        </template>
                        <template v-slot:cell.pay_frequency="{cell, slot, scrollReference}">
                            <div class="p-[3px]">{{cell.pay_frequency?.type?.text}}</div>
                        </template>
                        <template v-slot:cell.amountable_start="{cell, slot, scrollReference}">
                            <div class="p-[3px]">
                                <span v-if="cell.amountable_start?.value == AMOUNTABLE_PAYROLL_COMPONENT_START.CUSTOM_DATE">{{cell.start_date}}</span>
                                <span v-else>{{cell.amountable_start?.text}}</span>
                            </div>
                        </template>
                        <template v-slot:cell.amountable_end="{cell, slot, scrollReference}">
                            <div class="p-[3px]">
                                <span v-if="cell.amountable_end?.value == AMOUNTABLE_PAYROLL_COMPONENT_END.CUSTOM_DATE">{{cell.end_date}}</span>
                                <span v-else>{{cell.amountable_end?.text}}</span>
                            </div>
                        </template>
                    </DataTable>

                    <div>
                        <PageInformation :pagination="payrollComponents.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="payrollComponents.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection, PayFrequencyOptionT, StringEnumInterface} from "@/public/js/common/type";

useHead({titleTemplate: (titleChunk) => {return `Employee Pay Items`}});
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

    if(_isEmpty(selection) || selection.indexOf('formulable_type') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            formulableTypeOptions, formulableTypeOptionsKey, SELECT.MULTI_STATIC, formulableSelections
        );
    }

    if(_isEmpty(selection) || selection.indexOf('payroll_component_type') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            payrollComponentTypeOptions, payrollComponentTypeOptionsKey, SELECT.MULTI_STATIC, companyOrganizationSelections.value.payroll_component.types
        );
    }

    if(_isEmpty(selection) || selection.indexOf('payroll_component_name') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            payrollComponentNameOptions, payrollComponentNameOptionsKey, SELECT.MULTI_STATIC, companyOrganizationSelections.value.payroll_component.names
        );
    }

    if(_isEmpty(selection) || selection.indexOf('employee') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            employeeOptions, employeeOptionsKey, SELECT.SINGLE_PAGINATED
        );
    }
}

const payrollComponentsSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},
    {text: 'Employee', colspan: 2,  alignHeader: 'left'},
    {text: ''},
    {text: 'Formulable', colspan: 1,  alignHeader: 'left'},
    {text: 'Payroll Component', colspan: 8,  alignHeader: 'left'},
]);

const payrollComponentsHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions', minWidth: '33px'},
    { text: 'Employee #', value: 'employee_number', alignData: 'left'},
    { text: 'Name', value: 'employee_full_name', alignData: 'left'},

    { text: 'Payroll Group', value: 'employee_payroll_group', alignData: 'left'},

    { text: '', value: 'formulable'},

    { text: 'Type', value: 'type'},
    { text: 'Name', value: 'name'},
    { text: 'Amount', value: 'amount', alignData: 'right'},
    { text: 'Currency', value: 'currency'},
    { text: 'Pay Period', value: 'pay_period'},
    { text: 'Pay Type', value: 'pay_type'},
    { text: 'From', value: 'amountable_start'},
    { text: 'To', value: 'amountable_end'},
]);

const payrollComponents = reactive<DataTableT>({
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
    perPage: 15,
    search: {
        keyword: '',
        callback: 1
    }
});

const viewMode = reactive<{
    selection: EnumSelection;
    selected: number | null;
}>({
    selection: [
        {text : 'Flex', value: DATA_VIEW_MODE.FLEX} as EnumOption,
        {text : 'List', value: DATA_VIEW_MODE.LIST} as EnumOption,
    ],
    selected: DATA_VIEW_MODE.LIST as number
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

//Common Selections
const formulableSelections = [
    $enumerableOption(FORMULABLE_NAME, FORMULABLE.EARNINGS as number),
    $enumerableOption(FORMULABLE_NAME, FORMULABLE.DEDUCTIONS as number),
    $enumerableOption(FORMULABLE_NAME, FORMULABLE.INCOME_TAX as number),
];

const formulableTypeOptionsKey = shallowRef(0);
const formulableTypeOptions = reactive({
    search: '',
    selection: formulableSelections,
    selected: []
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
            payroll_componentable_morph_to_type: payrollComponentTypeOptions.selected,
            payroll_componentable_component_sub_types: payrollComponentNameOptions.selected,
            formulable_types: formulableTypeOptions.selected,
        }
    };
});

const payrollComponentTypeOptionsKey = shallowRef(0);
const payrollComponentTypeOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.payroll_component.types,
    selected: []
});

const payrollComponentNameOptionsKey = shallowRef(0);
const payrollComponentNameOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.payroll_component.names,
    selected: []
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

const payrollComponentsPending = ref(false)
const selectedPayrollComponents = ref([]);
const deleting = ref(false);

const disableActions = computed(() => {
    return payrollComponentsPending.value || createEditPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return payrollComponentsPending.value || companyAssociationPendingState().value;
});
const payrollComponentsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    payrollComponentsPending.value = true;

    await laraFetch(`/api/employee-payroll-components`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            payrollComponentsPending.value = false;
        },
        onResponse: (request, options, response) => {
            payrollComponentsPending.value = false;
            payrollComponents.successful = _get(response, '_data.successful', false);
            payrollComponents.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            payrollComponents.data = _get(response, '_data.values.data', [])
            payrollComponents.meta = _get(response, '_data.values.meta', {
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
payrollComponentsExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedPayrollComponents.value = [];
    }

    if(filters.page === page){
        payrollComponentsExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const confirmDeleteSelected = () => {

    const selectedIds = selectedPayrollComponents.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected payroll component to delete.`,
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
        message: `Confirm delete payroll component${selectedIds.length > 1 ? 's' : ''}?`,
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

    selectedIds = selectedPayrollComponents.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/employee-payroll-components", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            payroll_component_ids: selectedIds,
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
                message: `Payroll component${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedPayrollComponents.value = [];
    await payrollComponentsExecute();
}


const stagedEmployee = ref<{
    'id': string | number | null,
    'ulid': string | null,
}>({
    'id': null,
    'ulid': null,
});

const creatingOrEditing = ref(false);
const createEditPending = ref(false);
const creatingOrEditingPayrollComponentFormulable = ref<number | undefined>(FORMULABLE.EARNINGS);
const payrollComponentEditPayload = ref({});

const selectingEmployee = ref(false);
const selectEmployee = () => {

    coreStore.resetServiceError();

    stagedEmployee.value = {
        'id': null,
        'ulid': null,
    };

    selectingEmployee.value = true;
}

const resetStaged = () => {
    employeeOptions.selected = null;
    stagedEmployeePayFrequency.value = null;
    employeeOptionsKey.value++;
    selectingEmployee.value = false;
    stagedEmployee.value = {
        'id': null,
        'ulid': null,
    };
}

const cancelSelectEmployee = () => {
    resetStaged();
}

const stagedEmployeePayFrequency = ref<PayFrequencyOptionT | null>(null);
const setSelectedEmployee = (employee: {payroll_group:PayFrequencyOptionT}) => {
    coreStore.resetServiceError();

    stagedEmployeePayFrequency.value = employee.payroll_group ? {
        value: employee.payroll_group?.value,
        type_value: employee.payroll_group?.type_value,
    } : null;
}
const resolveSelectEmployee = () => {

    if(!Boolean(employeeOptions.selected)){
        coreStore.setServiceError({
            prompt: false,
            payload: {
                message: 'No employee selected.'
            }
        });
        return
    }

    if(!Boolean(stagedEmployeePayFrequency.value?.value)){
        coreStore.setServiceError({
            prompt: false,
            payload: {
                message: 'Employee payroll group not found.'
            }
        });
        return

    }

    put({employee_id: employeeOptions.selected}, true);

    selectingEmployee.value = false;
}

const put = async (row: TableRowT | {} = {}, createPayrollComponent = false) => {
    stagedEmployee.value = {
        'id': _get(row, 'employee_id', null),
        'ulid': _get(row, 'employee.ulid', null),
    };

    if(!createPayrollComponent){

        stagedEmployeePayFrequency.value = row.employee.payroll_group ? {
            value: row.employee.payroll_group?.id,
            type_value: row.employee.payroll_group?.type?.value,
        } : null;
    }


    //@ts-ignore
    payrollComponentEditPayload.value = row;
    creatingOrEditingPayrollComponentFormulable.value = _get(row, 'formulable_type.value', FORMULABLE.EARNINGS);

    employeeOptions.selected = null;
    employeeOptionsKey.value++;
    creatingOrEditing.value = true;
}

const payrollComponentCancelled = () => {
    resetStaged();
}

const payrollComponentResolved = (component, attributes, rowIndex = -1) => {
    resetStaged();
    payrollComponentsExecute();
}
</script>

<style scoped>

</style>