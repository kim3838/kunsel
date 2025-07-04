<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <div class="p-[20px] space-y-8">
                    <fieldset class="neutral-border px-2 pb-2 space-y-2">
                        <legend class="text-lg font-medium font-header">Employee Information</legend>

                        <div v-if="false">
                            <span class="font-semibold">Employee:</span> {{employee}}<br>
                            <span class="font-semibold">Employee Exists:</span> {{employeeExists}}<br>
                            <span class="font-semibold">Child Component Employee Payload:</span> {{childComponentEmployeePayload}}<br>
                        </div>

                        <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
                            <div>
                                <InputLabel :size="'sm'" value="Employee number"/>
                                <Input :size="'md'" v-model="employeeNumber" type="text"/>
                            </div>
                        </div>

                        <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
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

                        <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
                            <div>
                                <InputLabel :size="'sm'" value="Department"/>
                                <SingleSelect drop-shadow :size="'md'" :options="departmentOptions"/>
                            </div>
                            <div>
                                <InputLabel :size="'sm'" value="Designation"/>
                                <SingleSelect drop-shadow :size="'md'" :options="designationOptions"/>
                            </div>
                            <div>
                                <InputLabel :size="'sm'" value="Manager"/>
                                <SingleSelect drop-shadow :size="'md'" :options="managerOptions"/>
                            </div>
                        </div>
                    </fieldset>

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
                                <legend class="text-lg font-medium font-header">Compensations</legend>
                                <div v-if="false">
                                    <span class="font-semibold">Employee Compensations:</span> {{employeeCompensationData}}<br>
                                    <span class="font-semibold">Employee Compensations[1]:</span> {{employeeCompensationData[1]}}<br>
                                    <span class="font-semibold">Selected Employee Compensations:</span> {{selectedEmployeeCompensation}}<br>
                                </div>
                                <div class="space-x-2 inline-flex items-center">
                                    <Button
                                        class="w-min"
                                        :variant=" 'outline'"
                                        :size="'sm'"
                                        :disabled="disableEmployeeCompensationActions"
                                        :icon="'mdi:plus'"
                                        :label="'Add Compensation'"
                                        @click="createOrEditPayrollComponent(FORMULABLE.EARNINGS)"/>
                                    <Button
                                        v-if="employeeExists"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="'sm'"
                                        :icon="'mdi:delete-outline'"
                                        :disabled="disableEmployeeCompensationActions"
                                        @click="deleteSelected(FORMULABLE.EARNINGS)"
                                        :label="'Delete Selected'" />
                                    <Button
                                        v-if="employeeExists"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="'sm'"
                                        :icon="'mdi:rotate-3d-variant'"
                                        :disabled="disableEmployeeCompensationActions"
                                        @click="employeeCompensationExecute"
                                        :label="'Reload'" />
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
                                                :label="'Edit'"
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
                                <legend class="text-lg font-medium font-header">Deductions</legend>
                                <div v-if="false">
                                    <span class="font-semibold">Employee Deductions:</span> {{employeeDeductionData}}<br>
                                    <span class="font-semibold">Employee Deductions[1]:</span> {{employeeDeductionData[1]}}<br>
                                    <span class="font-semibold">Selected Employee Deductions:</span> {{selectedEmployeeDeduction}}<br>
                                </div>
                                <div class="space-x-2 inline-flex items-center">
                                    <Button
                                        class="w-min"
                                        :variant=" 'outline'"
                                        :size="'sm'"
                                        :disabled="disableEmployeeDeductionActions"
                                        :icon="'mdi:plus'"
                                        :label="'Add Deduction'"
                                        @click="createOrEditPayrollComponent(FORMULABLE.DEDUCTIONS)"/>
                                    <Button
                                        v-if="employeeExists"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="'sm'"
                                        :icon="'mdi:delete-outline'"
                                        :disabled="disableEmployeeDeductionActions"
                                        @click="deleteSelected(FORMULABLE.DEDUCTIONS)"
                                        :label="'Delete Selected'" />
                                    <Button
                                        v-if="employeeExists"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="'sm'"
                                        :icon="'mdi:rotate-3d-variant'"
                                        :disabled="disableEmployeeDeductionActions"
                                        @click="employeeDeductionExecute"
                                        :label="'Reload'" />
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
                                                :label="'Edit'"
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
                                <legend class="text-lg font-medium font-header">Income Tax</legend>
                                <div v-if="false">
                                    <span class="font-semibold">Employee Income Taxes:</span> {{employeeIncomeTaxData}}<br>
                                    <span class="font-semibold">Employee Income Taxes[1]:</span> {{employeeIncomeTaxData[1]}}<br>
                                    <span class="font-semibold">Selected Employee Income Taxes:</span> {{selectedEmployeeIncomeTax}}<br>
                                </div>
                                <div class="space-x-2 inline-flex items-center">
                                    <Button
                                        class="w-min"
                                        :variant=" 'outline'"
                                        :size="'sm'"
                                        :disabled="disableEmployeeIncomeTaxActions"
                                        :icon="'mdi:plus'"
                                        :label="'Add Tax'"
                                        @click="createOrEditPayrollComponent(FORMULABLE.INCOME_TAX)"/>
                                    <Button
                                        v-if="employeeExists"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="'sm'"
                                        :icon="'mdi:delete-outline'"
                                        :disabled="disableEmployeeIncomeTaxActions"
                                        @click="deleteSelected(FORMULABLE.INCOME_TAX)"
                                        :label="'Delete Selected'" />
                                    <Button
                                        v-if="employeeExists"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="'sm'"
                                        :icon="'mdi:rotate-3d-variant'"
                                        :disabled="disableEmployeeIncomeTaxActions"
                                        @click="employeeIncomeTaxExecute"
                                        :label="'Reload'" />
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
                                                :label="'Edit'"
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
    middleware: ['auth', 'company-admin'],
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
    data: [
        {text : 'Not Specified', value: GENDER.NOT_SPECIFIED},
        {text : 'Male', value: GENDER.MALE},
        {text : 'Female', value: GENDER.FEMALE},
    ],
    selection: [
        {text : 'Not Specified', value: GENDER.NOT_SPECIFIED},
        {text : 'Male', value: GENDER.MALE},
        {text : 'Female', value: GENDER.FEMALE},
    ],
    selected: GENDER.NOT_SPECIFIED
});

const employeeExists = computed(() => {
    return !_isEmpty(employee.value);
});

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
        },
    });
};
await fetchEmployee();

//Employee Organization
const departmentOptions = reactive({
    search: '',
    data: [],
    selection: [],
    selected: null
});
const designationOptions = reactive({
    search: '',
    data: [],
    selection: [],
    selected: null
});
const managerOptions = reactive({
    search: '',
    data: [],
    selection: [],
    selected: null
});

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
</script>

<style scoped>

</style>