<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <div class="p-[20px] space-y-2">
                    <div class="flex">
                        <NuxtLink
                            :to="`/workforce/employees`">
                            <Button class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'ic:sharp-keyboard-arrow-left'" :label="disableActions ? 'Please wait' : ''"></Button>
                        </NuxtLink>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <fieldset class="neutral-border px-2 pb-2 space-y-2">
                            <legend class="text-lg font-medium font-header">Employee Information</legend>

                            <div v-if="false">
                                <span class="font-semibold">Employee:</span> {{employee}}<br>
                                <span class="font-semibold">Employee Exists:</span> {{employeeExists}}<br>
                                <span class="font-semibold">Child Component Employee Payload:</span> {{childComponentEmployeePayload}}<br>
                            </div>

                            <div class="grid gap-2 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
                                <div>
                                    <InputLabel :size="'sm'" value="Employee number"/>
                                    <Input :size="'md'" v-model="employeeNumber" type="text"/>
                                </div>
                            </div>

                            <div class="grid gap-2 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
                                <div>
                                    <InputLabel :size="'sm'" value="Family name"/>
                                    <Input :size="'md'" v-model="employeeFamilyName" type="text"/>
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="Middle name"/>
                                    <Input :size="'md'" v-model="employeeMiddleName" type="text"/>
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="Given name"/>
                                    <Input :size="'md'" v-model="employeeGivenName" type="text"/>
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="Gender"/>
                                    <SingleSelect drop-shadow value-persist :size="'md'" :options="genderOptions"/>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset class="neutral-border px-2 pb-2 space-y-2">
                            <legend class="text-lg font-medium font-header">Organization</legend>

                            <div class="grid gap-2 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6">
                                <div class="lg:col-span-2">
                                    <InputLabel :size="'sm'" value="Department"/>
                                    <SingleSelect drop-shadow :size="'md'" :options="departmentOptions"/>
                                </div>
                                <div class="lg:col-span-2">
                                    <InputLabel :size="'sm'" value="Designation"/>
                                    <SingleSelect drop-shadow :size="'md'" :options="designationOptions"/>
                                </div>
                                <div class="hidden lg:block"></div>
                                <div class="col-span-2">
                                    <InputLabel :size="'sm'" value="Manager"/>
                                    <SingleSelectPaginated
                                        drop-shadow
                                        :selection-max-viewable-line="10"
                                        :label="'Select Manager'"
                                        :size="'md'"
                                        :icon="'mdi:badge-account-outline'"
                                        :payload="managerOptions"/>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <PayrollComponentAssignmentModal
                        v-model:creatingOrEditing="creatingOrEditingPayrollComponent"
                        v-model:employeePayload="childComponentEmployeePayload"
                        v-model:editPayloadIndex="editPayrollComponentPayloadIndex"
                        v-model:editPayload="payrollComponentEditPayload"
                        v-model:payrollComponentFormulable="creatingOrEditingPayrollComponentFormulable"
                        :pay-period-selection="payPeriodSelection"
                        :pay-type-selection="payTypeSelection"
                        :pay-frequency-selection="payFrequencySelection"
                        @resolved="payrollComponentResolved"
                    ></PayrollComponentAssignmentModal>

                    <fieldset class="neutral-border px-2 pb-2 space-y-2">
                        <legend class="text-lg font-medium font-header">Payroll Information</legend>

                        <div v-if="false">
                            <span class="font-semibold">Edit Payload Index:</span> {{editPayrollComponentPayloadIndex}}<br>
                        </div>

                        <div class="grid gap-2 grid-cols-1">
                            <fieldset class="neutral-border px-2 pb-2 grid gap-2 grid-cols-1">
                                <legend class="text-sm">Compensations</legend>
                                <div v-if="false">
                                    <span class="font-semibold">Employee Compensations:</span> {{employeeCompensationData}}<br>
                                    <span class="font-semibold">Employee Compensations[1]:</span> {{employeeCompensationData[1]}}<br>
                                    <span class="font-semibold">Selected Employee Compensations:</span> {{selectedEmployeeCompensation}}<br>
                                </div>
                                <div class="space-x-1 mt-2 inline-flex items-center">
                                    <Button
                                        class="w-min"
                                        :variant=" 'outline'"
                                        :size="'sm'"
                                        :disabled="disableEmployeeCompensationActions"
                                        :icon="'mdi:plus'"
                                        @click="createOrEditPayrollComponent(FORMULABLE.EARNINGS)"/>
                                    <Button
                                        v-if="employeeExists"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="'sm'"
                                        :icon="'mdi:delete-outline'"
                                        :disabled="disableEmployeeCompensationActions"
                                        @click="deleteSelected(FORMULABLE.EARNINGS)" />
                                    <Button
                                        v-if="employeeExists"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="'sm'"
                                        :icon="'ic:sharp-restart-alt'"
                                        :disabled="disableEmployeeCompensationActions"
                                        @click="employeeCompensationExecute" />
                                </div>
                                <UnorderedList
                                    v-if="disableEmployeeCompensationActions"
                                    :icon="'eos-icons:loading'"
                                    :size="'md'"
                                    :label="'Please wait...'"/>
                                <DataTable
                                    :headers="employeeCompensationHeaders"
                                    :size="'lg'"
                                    :rows="employeeCompensationData"
                                    :disabled="disableEmployeeCompensationDataTable"
                                    v-model="selectedEmployeeCompensation"
                                    selection>
                                    <template v-slot:cell.action="{cell,slot, headerIndex, rowIndex}">
                                        <div class="h-full mx-0.5 space-x-0.5 w-full flex items-center">
                                            <Button
                                                v-if="!employeeExists"
                                                class="w-min"
                                                :variant="'outline'"
                                                :size="slot.buttonSize"
                                                :disabled="disableEmployeeCompensationActions"
                                                :icon="'mdi:delete-forever'"
                                                @click="deleteRow(FORMULABLE.EARNINGS, rowIndex)"/>
                                            <Button
                                                class="w-min"
                                                :variant="'outline'"
                                                :size="slot.buttonSize"
                                                :disabled="disableEmployeeCompensationActions"
                                                :icon="'mdi:pen'"
                                                @click="createOrEditPayrollComponent(FORMULABLE.EARNINGS, cell, rowIndex)"/>
                                        </div>
                                    </template>
                                    <template v-slot:cell.name="{cell, slot, scrollReference}">
                                        <div class="p-[3px]">{{cell.payroll_componentable.name}}</div>
                                    </template>
                                    <template v-slot:cell.type="{cell, slot, scrollReference}">
                                        <div class="p-[3px]">{{cell.payroll_componentable.type?.text}}</div>
                                    </template>
                                    <template v-slot:cell.pay_period="{cell, slot, scrollReference}">
                                        <div class="p-[3px]">{{cell.pay_period?.text}}</div>
                                    </template>
                                    <template v-slot:cell.pay_type="{cell, slot, scrollReference}">
                                        <div class="p-[3px]">{{cell.pay_type?.text}}</div>
                                    </template>
                                    <template v-slot:cell.pay_frequency="{cell, slot, scrollReference}">
                                        <div class="p-[3px]">{{cell.pay_frequency?.text}}</div>
                                    </template>
                                </DataTable>
                            </fieldset>

                            <fieldset class="neutral-border px-2 pb-2 grid gap-2 grid-cols-1">
                                <legend class="text-sm">Deductions</legend>
                                <div v-if="false">
                                    <span class="font-semibold">Employee Deductions:</span> {{employeeDeductionData}}<br>
                                    <span class="font-semibold">Employee Deductions[1]:</span> {{employeeDeductionData[1]}}<br>
                                    <span class="font-semibold">Selected Employee Deductions:</span> {{selectedEmployeeDeduction}}<br>
                                </div>
                                <div class="space-x-1 mt-2 inline-flex items-center">
                                    <Button
                                        class="w-min"
                                        :variant=" 'outline'"
                                        :size="'sm'"
                                        :disabled="disableEmployeeDeductionActions"
                                        :icon="'mdi:plus'"
                                        @click="createOrEditPayrollComponent(FORMULABLE.DEDUCTIONS)"/>
                                    <Button
                                        v-if="employeeExists"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="'sm'"
                                        :icon="'mdi:delete-outline'"
                                        :disabled="disableEmployeeDeductionActions"
                                        @click="deleteSelected(FORMULABLE.DEDUCTIONS)" />
                                    <Button
                                        v-if="employeeExists"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="'sm'"
                                        :icon="'ic:sharp-restart-alt'"
                                        :disabled="disableEmployeeDeductionActions"
                                        @click="employeeDeductionExecute" />
                                </div>
                                <UnorderedList
                                    v-if="disableEmployeeDeductionActions"
                                    :icon="'eos-icons:loading'"
                                    :size="'md'"
                                    :label="'Please wait...'"/>
                                <DataTable
                                    :headers="employeeDeductionHeaders"
                                    :size="'lg'"
                                    :rows="employeeDeductionData"
                                    :disabled="disableEmployeeDeductionDataTable"
                                    v-model="selectedEmployeeDeduction"
                                    selection>
                                    <template v-slot:cell.action="{cell,slot, headerIndex, rowIndex}">
                                        <div class="h-full mx-0.5 space-x-0.5 w-full flex items-center">
                                            <Button
                                                v-if="!employeeExists"
                                                class="w-min"
                                                :variant="'outline'"
                                                :size="slot.buttonSize"
                                                :disabled="disableEmployeeDeductionActions"
                                                :icon="'mdi:delete-forever'"
                                                @click="deleteRow(FORMULABLE.DEDUCTIONS, rowIndex)"/>
                                            <Button
                                                class="w-min"
                                                :variant="'outline'"
                                                :size="slot.buttonSize"
                                                :disabled="disableEmployeeDeductionActions"
                                                :icon="'mdi:pen'"
                                                @click="createOrEditPayrollComponent(FORMULABLE.DEDUCTIONS, cell, rowIndex)"/>
                                        </div>
                                    </template>
                                    <template v-slot:cell.name="{cell, slot, scrollReference}">
                                        <div class="p-[3px]">{{cell.payroll_componentable.name}}</div>
                                    </template>
                                    <template v-slot:cell.type="{cell, slot, scrollReference}">
                                        <div class="p-[3px]">{{cell.payroll_componentable.type?.text}}</div>
                                    </template>
                                </DataTable>
                            </fieldset>

                            <fieldset class="neutral-border px-2 pb-2 grid gap-2 grid-cols-1">
                                <legend class="text-sm">Income Tax</legend>
                                <div v-if="false">
                                    <span class="font-semibold">Employee Income Taxes:</span> {{employeeIncomeTaxData}}<br>
                                    <span class="font-semibold">Employee Income Taxes[1]:</span> {{employeeIncomeTaxData[1]}}<br>
                                    <span class="font-semibold">Selected Employee Income Taxes:</span> {{selectedEmployeeIncomeTax}}<br>
                                </div>
                                <div class="space-x-1 mt-2 inline-flex items-center">
                                    <Button
                                        class="w-min"
                                        :variant=" 'outline'"
                                        :size="'sm'"
                                        :disabled="disableEmployeeIncomeTaxActions"
                                        :icon="'mdi:plus'"
                                        @click="createOrEditPayrollComponent(FORMULABLE.INCOME_TAX)"/>
                                    <Button
                                        v-if="employeeExists"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="'sm'"
                                        :icon="'mdi:delete-outline'"
                                        :disabled="disableEmployeeIncomeTaxActions"
                                        @click="deleteSelected(FORMULABLE.INCOME_TAX)" />
                                    <Button
                                        v-if="employeeExists"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="'sm'"
                                        :icon="'ic:sharp-restart-alt'"
                                        :disabled="disableEmployeeIncomeTaxActions"
                                        @click="employeeIncomeTaxExecute" />
                                </div>
                                <UnorderedList
                                    v-if="disableEmployeeIncomeTaxActions"
                                    :icon="'eos-icons:loading'"
                                    :size="'md'"
                                    :label="'Please wait...'"/>
                                <DataTable
                                    :headers="employeeIncomeTaxHeaders"
                                    :size="'lg'"
                                    :rows="employeeIncomeTaxData"
                                    :disabled="disableEmployeeIncomeTaxDataTable"
                                    v-model="selectedEmployeeIncomeTax"
                                    selection>
                                    <template v-slot:cell.action="{cell,slot, headerIndex, rowIndex}">
                                        <div class="h-full mx-0.5 space-x-0.5 w-full flex items-center">
                                            <Button
                                                v-if="!employeeExists"
                                                class="w-min"
                                                :variant="'outline'"
                                                :size="slot.buttonSize"
                                                :disabled="disableEmployeeIncomeTaxActions"
                                                :icon="'mdi:delete-forever'"
                                                @click="deleteRow(FORMULABLE.INCOME_TAX, rowIndex)"/>
                                            <Button
                                                class="w-min"
                                                :variant="'outline'"
                                                :size="slot.buttonSize"
                                                :disabled="disableEmployeeIncomeTaxActions"
                                                :icon="'mdi:pen'"
                                                @click="createOrEditPayrollComponent(FORMULABLE.INCOME_TAX, cell, rowIndex)"/>
                                        </div>
                                    </template>
                                    <template v-slot:cell.name="{cell, slot, scrollReference}">
                                        <div class="p-[3px]">{{cell.payroll_componentable.name}}</div>
                                    </template>
                                    <template v-slot:cell.type="{cell, slot, scrollReference}">
                                        <div class="p-[3px]">{{cell.payroll_componentable.type?.text}}</div>
                                    </template>
                                </DataTable>
                            </fieldset>
                        </div>
                    </fieldset>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {TableHeaderT} from "@/public/js/types/data";

useLayout().setNavigationMode('solid', 'Employees/[id].vue');

const route = useRoute();
const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompany
} = storeToRefs(nuxtApp.$authStore);
const employee = ref(null);

const childComponentEmployeePayload = computed(() => {
   return {
       'id': _get(employee.value, 'id', null),
       'ulid': _get(employee.value, 'ulid', null),
   };
});

definePageMeta({
    middleware: ['auth', 'admin-of-selected-company'],
    validate: async (route) => {

        if (import.meta.server) return true;

        let createEmployee = route.params.id === 'create-employee';

        if(createEmployee){return true;}

        await laraUseFetch(`/api/employee/${route.params.id}`, {
            lazy: false,
            method: 'GET'
        }, {
            onSuccessResponse: async (request, options, response) => {
                employee.value = _get(response, '_data.values.employee', null);
            }
        }, false);

        return !_isEmpty(employee.value);
    }
});

//Employee Information
const employeeNumber = ref('');
const employeeFamilyName = ref('');
const employeeMiddleName = ref('');
const employeeGivenName = ref('');
const genderOptions = reactive({
    search: '',
    selection: [
        {text : 'Not Specified', value: GENDER.NOT_SPECIFIED},
        {text : 'Male', value: GENDER.MALE},
        {text : 'Female', value: GENDER.FEMALE},
    ],
    selected: GENDER.NOT_SPECIFIED
});

//Employee Organization
const departmentOptions = reactive({
    search: '',
    selection: [],
    selected: null
});
const designationOptions = reactive({
    search: '',
    selection: [],
    selected: null
});
const managerOptions = reactive({
    fetch: {
        url: '/api/employee-selections',
        filters: {
            'company_id': selectedAssociatedCompany.value,
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: null,
});
const designationsPending = ref(false);
const designationsExecute = async () => {
    designationsPending.value = true;

    await laraFetch("/api/designation-selections", {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompany.value,
            }
        }
    }, {
        onRequestError: () => {
            designationsPending.value = false;
        },
        onResponse: () => {
            designationsPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            designationOptions.selection = _get(response, '_data.values.selection', []);
        }
    });
}
await designationsExecute();

const departmentsPending = ref(false);
const departmentsExecute = async () => {
    departmentsPending.value = true;

    await laraFetch("/api/department-selections", {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompany.value,
            }
        }
    }, {
        onRequestError: () => {
            departmentsPending.value = false;
        },
        onResponse: () => {
            departmentsPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            departmentOptions.selection = _get(response, '_data.values.selection', []);
        }
    });
}
await departmentsExecute();

const employeeExists = computed(() => {
    return !_isEmpty(employee.value);
});

//Fetch Employee Information
const fetchEmployee = async () => {
    await laraFetch(`/api/employee/${route.params.id}`, {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            employee.value = _get(response, '_data.values.employee', null);
            employeeNumber.value = _get(response, '_data.values.employee.number', '');
            employeeFamilyName.value = _get(response, '_data.values.employee.family_name', '');
            employeeMiddleName.value = _get(response, '_data.values.employee.middle_name', '');
            employeeGivenName.value = _get(response, '_data.values.employee.given_name', '');
            genderOptions.selected = _get(response, '_data.values.employee.gender.value', GENDER.NOT_SPECIFIED);
            departmentOptions.selected = _get(response, '_data.values.employee.department_id', null);
            designationOptions.selected = _get(response, '_data.values.employee.designation_id', null);
            managerOptions.selected = _get(response, '_data.values.employee.manager_id', null);
        },
    });
};
await fetchEmployee();

const payPeriodSelection = ref([]);
const payTypeSelection = ref([]);
const payFrequencySelection = ref([]);
const fetchPayPeriodSelection = async () => {
    await laraFetch(`/api/enum-selections/pay_period`, {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            payPeriodSelection.value = _get(response, '_data.values.data', []);
        },
    });
};
const fetchPayTypeSelection = async () => {
    await laraFetch(`/api/enum-selections/pay_type`, {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            payTypeSelection.value = _get(response, '_data.values.data', []);
        },
    });
};
const fetchPayFrequencySelection = async () => {
    await laraFetch(`/api/enum-selections/pay_frequency`, {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            payFrequencySelection.value = _get(response, '_data.values.data', []);
        },
    });
};

await fetchPayPeriodSelection();
await fetchPayTypeSelection();
await fetchPayFrequencySelection();

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value){
        navigateTo("/workforce/employees", {replace: true});
    }
});

const creatingOrEditingPayrollComponent = ref(false);
const deletingPayrollComponent = ref(false);
const creatingOrEditingPayrollComponentFormulable = ref<number | undefined>(undefined);
const editPayrollComponentPayloadIndex = ref(-1);
const payrollComponentEditPayload = ref({});
const createOrEditPayrollComponent = (payrollComponent: number, payrollComponentAttributes = {}, rowIndex = -1) => {
    creatingOrEditingPayrollComponent.value = true;
    if(!employeeExists.value){
        editPayrollComponentPayloadIndex.value = rowIndex;
    }
    creatingOrEditingPayrollComponentFormulable.value = payrollComponent;

    payrollComponentEditPayload.value = payrollComponentAttributes;
};

//Employee Compensation DataTable
const employeeCompensationHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'action'},
    { text: 'Compensation', value: 'name'},
    { text: 'Type', value: 'type'},
    { text: 'Amount', value: 'amount'},
    { text: 'Currency', value: 'currency'},
    { text: 'Pay Period', value: 'pay_period'},
    { text: 'Pay Type', value: 'pay_type'},
    { text: 'Pay Frequency', value: 'pay_frequency'},
]);

const employeeCompensationData = ref([]);
const selectedEmployeeCompensation = ref([]);
const employeeCompensationPending = ref(false);
const employeeCompensationExecute = async () => {
    if(!employeeExists.value){
        return 0;
    }

    employeeCompensationPending.value = true;

    await laraFetch(`/api/employee-payroll-info/${route.params.id}/compensations`, {
        method: 'GET',
    },{
        onRequestError: () => {
            employeeCompensationPending.value = false;
        },
        onResponse: () => {
            employeeCompensationPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            employeeCompensationData.value = _get(response, '_data.values.compensations', []);
        }
    });
}
await employeeCompensationExecute();

const disableEmployeeCompensationActions = computed(() => {
    return employeeCompensationPending.value || creatingOrEditingPayrollComponent.value || deletingPayrollComponent.value;
});
const disableEmployeeCompensationDataTable = computed(() => {
    return employeeCompensationPending.value || creatingOrEditingPayrollComponent.value || deletingPayrollComponent.value;
});

//Employee Deduction DataTable
const employeeDeductionHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'action'},
    { text: 'Deduction', value: 'name'},
    { text: 'Type', value: 'type'},
]);

const employeeDeductionData = ref([]);
const selectedEmployeeDeduction = ref([]);
const employeeDeductionPending = ref(false);
const employeeDeductionExecute = async () => {
    if(!employeeExists.value){
        return 0;
    }

    employeeDeductionPending.value = true;

    await laraFetch(`/api/employee-payroll-info/${route.params.id}/deductions`, {
        method: 'GET',
    },{
        onRequestError: () => {
            employeeDeductionPending.value = false;
        },
        onResponse: () => {
            employeeDeductionPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            employeeDeductionData.value = _get(response, '_data.values.deductions', []);
        }
    });
}
await employeeDeductionExecute();
const disableEmployeeDeductionActions = computed(() => {
    return employeeDeductionPending.value || creatingOrEditingPayrollComponent.value || deletingPayrollComponent.value;
});
const disableEmployeeDeductionDataTable = computed(() => {
    return employeeDeductionPending.value || creatingOrEditingPayrollComponent.value || deletingPayrollComponent.value;
})

//Employee Income Tax DataTable
const employeeIncomeTaxHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'action'},
    { text: 'Tax', value: 'name'},
    { text: 'Type', value: 'type'},
]);

const employeeIncomeTaxData = ref([]);
const selectedEmployeeIncomeTax = ref([]);
const employeeIncomeTaxPending = ref(false);
const employeeIncomeTaxExecute = async () => {
    if(!employeeExists.value){
        return 0;
    }

    employeeIncomeTaxPending.value = true;

    await laraFetch(`/api/employee-payroll-info/${route.params.id}/income-taxes`, {
        method: 'GET',
    },{
        onRequestError: () => {
            employeeIncomeTaxPending.value = false;
        },
        onResponse: () => {
            employeeIncomeTaxPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            employeeIncomeTaxData.value = _get(response, '_data.values.income_taxes', []);
        }
    });
}
await employeeIncomeTaxExecute();
const disableEmployeeIncomeTaxActions = computed(() => {
    return employeeIncomeTaxPending.value || creatingOrEditingPayrollComponent.value || deletingPayrollComponent.value;
});
const disableEmployeeIncomeTaxDataTable = computed(() => {
    return employeeIncomeTaxPending.value || creatingOrEditingPayrollComponent.value || deletingPayrollComponent.value;
});

const deleteSelected = async (component) => {

    let selectedIds: number[] = [];

    if(component == FORMULABLE.EARNINGS){
        selectedIds = selectedEmployeeCompensation.value;
    }
    if(component == FORMULABLE.DEDUCTIONS){
        selectedIds = selectedEmployeeDeduction.value;
    }
    if(component == FORMULABLE.INCOME_TAX){
        selectedIds = selectedEmployeeIncomeTax.value;
    }

    if(_isEmpty(selectedIds)){
        return;
    }

    deletingPayrollComponent.value = true;

    let batchDelete: Promise<any>[] = [];

    selectedIds.forEach((id) => {
        batchDelete.push(
            new Promise((resolve, reject) => {
                laraFetch(`/api/employee-payroll-component/${id}`, {
                    method: 'DELETE',
                    body: {
                        'company_id': selectedAssociatedCompany.value
                    }
                },{
                    onRequestError: (request, options, error) => {
                        reject(error);
                    },
                    onResponse: (request, options, response) => {
                        resolve(response);
                    }
                })
            })
        );
    });

    await Promise.all(batchDelete);

    if(component == FORMULABLE.EARNINGS){
        selectedEmployeeCompensation.value = [];
        employeeCompensationExecute();
    }

    if(component == FORMULABLE.DEDUCTIONS){
        selectedEmployeeDeduction.value = [];
        employeeDeductionExecute();
    }

    if(component == FORMULABLE.INCOME_TAX){
        selectedEmployeeIncomeTax.value = [];
        employeeIncomeTaxExecute();
    }

    deletingPayrollComponent.value = false;
}
const deleteRow = async (component, rowIndex) => {
    if(component == FORMULABLE.EARNINGS){
        employeeCompensationData.value.splice(rowIndex, 1);
    }
    if(component == FORMULABLE.DEDUCTIONS){
        employeeDeductionData.value.splice(rowIndex, 1);
    }
    if(component == FORMULABLE.INCOME_TAX){
        employeeIncomeTaxData.value.splice(rowIndex, 1);
    }
}

const payrollComponentResolved = (component, attributes, rowIndex = -1) => {

    if(employeeExists.value){

        if(component == FORMULABLE.EARNINGS){
            employeeCompensationExecute();
        }

        if(component == FORMULABLE.DEDUCTIONS){
            employeeDeductionExecute();
        }

        if(component == FORMULABLE.INCOME_TAX){
            employeeIncomeTaxExecute();
        }

    } else {

        if(_isEmpty(attributes)){
            return 0;
        }

        if(component == FORMULABLE.EARNINGS){
            if(rowIndex >= 0){
                employeeCompensationData.value.splice(rowIndex, 1, attributes);
            } else {
                employeeCompensationData.value.push(attributes);
            }
        }

        if(component == FORMULABLE.DEDUCTIONS){
            if(rowIndex >= 0){
                employeeDeductionData.value.splice(rowIndex, 1, attributes);
            } else {
                employeeDeductionData.value.push(attributes);
            }
        }

        if(component == FORMULABLE.INCOME_TAX){
            if(rowIndex >= 0){
                employeeIncomeTaxData.value.splice(rowIndex, 1, attributes);
            } else {
                employeeIncomeTaxData.value.push(attributes);
            }
        }

    }
};

const formPending = ref(false);
const disableActions = computed(() => {
    return formPending.value
});
</script>

<style scoped>

</style>