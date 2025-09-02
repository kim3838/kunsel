<template>
    <div>
        <PayrollComponentAssignmentModal
            v-model:creatingOrEditing="creatingOrEditingPayrollComponent"
            v-model:employeePayload="employeePayload"
            v-model:editPayloadIndex="editPayrollComponentPayloadIndex"
            v-model:editPayload="payrollComponentEditPayload"
            v-model:payrollComponentFormulable="creatingOrEditingPayrollComponentFormulable"
            :pay-frequency-selection="payFrequencySelection"
            @resolved="payrollComponentResolved"
        ></PayrollComponentAssignmentModal>

        <fieldset class="neutral-border px-2 pb-2 space-y-2">
            <legend class="text-lg font-header">Payroll Information</legend>

            <div v-if="false">
                <span class="font-semibold">Employee Payload:</span> {{childComponentEmployeePayload}}<br>
                <span class="font-semibold">Employee Ulid:</span> {{employeeUlid}}<br>
                <span class="font-semibold">Edit Payload Index:</span> {{editPayrollComponentPayloadIndex}}<br>
                <span class="font-semibold">Props Disable Actions:</span> {{props.disableActions}}<br>
            </div>

            <div class="grid gap-2 grid-cols-1">
                <fieldset class="neutral-border px-2 pb-2 space-y-2">
                    <legend class="text-sm">Compensations</legend>
                    <div v-if="false">
                        <span class="font-semibold">Employee Compensations:</span> {{employeeCompensationData}}<br>
                        <span class="font-semibold">Employee Compensations[1]:</span> {{employeeCompensationData[1]}}<br>
                        <span class="font-semibold">Selected Employee Compensations:</span> {{selectedEmployeeCompensation}}<br>
                    </div>
                    <div class="inline-flex gap-2 items-center">
                        <Button
                            class="w-min"
                            :variant=" 'outline'"
                            :size="'sm'"
                            :disabled="disableEmployeeCompensationActions"
                            :icon="'mdi:plus'"
                            @click="createOrEditPayrollComponent(FORMULABLE.EARNINGS)"/>
                        <Button
                            v-if="!creatingEmployee"
                            class="w-min"
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'mdi:delete-outline'"
                            :disabled="disableEmployeeCompensationActions"
                            @click="deleteSelectedPayrollComponent(FORMULABLE.EARNINGS)" />
                        <Button
                            v-if="!creatingEmployee"
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
                                    v-if="creatingEmployee"
                                    class="w-min"
                                    :variant="'outline'"
                                    :size="slot.buttonSize"
                                    :disabled="disableEmployeeCompensationActions"
                                    :icon="'mdi:delete-forever'"
                                    @click="deletePayrollComponentRow(FORMULABLE.EARNINGS, rowIndex)"/>
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
                </fieldset>
            </div>

            <div class="grid grid-cols-1 md:gap-2 lg:grid-cols-2">
                <fieldset class="neutral-border px-2 pb-2 space-y-2">
                    <legend class="text-sm">Deductions</legend>
                    <div v-if="false">
                        <span class="font-semibold">Employee Deductions:</span> {{employeeDeductionData}}<br>
                        <span class="font-semibold">Employee Deductions[1]:</span> {{employeeDeductionData[1]}}<br>
                        <span class="font-semibold">Selected Employee Deductions:</span> {{selectedEmployeeDeduction}}<br>
                    </div>
                    <div class="inline-flex gap-2 items-center">
                        <Button
                            class="w-min"
                            :variant=" 'outline'"
                            :size="'sm'"
                            :disabled="disableEmployeeDeductionActions"
                            :icon="'mdi:plus'"
                            @click="createOrEditPayrollComponent(FORMULABLE.DEDUCTIONS)"/>
                        <Button
                            v-if="!creatingEmployee"
                            class="w-min"
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'mdi:delete-outline'"
                            :disabled="disableEmployeeDeductionActions"
                            @click="deleteSelectedPayrollComponent(FORMULABLE.DEDUCTIONS)" />
                        <Button
                            v-if="!creatingEmployee"
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
                                    v-if="creatingEmployee"
                                    class="w-min"
                                    :variant="'outline'"
                                    :size="slot.buttonSize"
                                    :disabled="disableEmployeeDeductionActions"
                                    :icon="'mdi:delete-forever'"
                                    @click="deletePayrollComponentRow(FORMULABLE.DEDUCTIONS, rowIndex)"/>
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

                <fieldset class="lg:col-span-1 neutral-border px-2 pb-2 space-y-2">
                    <legend class="text-sm">Income Tax</legend>
                    <div v-if="false">
                        <span class="font-semibold">Employee Income Taxes:</span> {{employeeIncomeTaxData}}<br>
                        <span class="font-semibold">Employee Income Taxes[1]:</span> {{employeeIncomeTaxData[1]}}<br>
                        <span class="font-semibold">Selected Employee Income Taxes:</span> {{selectedEmployeeIncomeTax}}<br>
                    </div>
                    <div class="inline-flex gap-2 items-center">
                        <Button
                            class="w-min"
                            :variant=" 'outline'"
                            :size="'sm'"
                            :disabled="disableEmployeeIncomeTaxActions"
                            :icon="'mdi:plus'"
                            @click="createOrEditPayrollComponent(FORMULABLE.INCOME_TAX)"/>
                        <Button
                            v-if="!creatingEmployee"
                            class="w-min"
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'mdi:delete-outline'"
                            :disabled="disableEmployeeIncomeTaxActions"
                            @click="deleteSelectedPayrollComponent(FORMULABLE.INCOME_TAX)" />
                        <Button
                            v-if="!creatingEmployee"
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
                                    v-if="creatingEmployee"
                                    class="w-min"
                                    :variant="'outline'"
                                    :size="slot.buttonSize"
                                    :disabled="disableEmployeeIncomeTaxActions"
                                    :icon="'mdi:delete-forever'"
                                    @click="deletePayrollComponentRow(FORMULABLE.INCOME_TAX, rowIndex)"/>
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
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {TableHeaderT} from "@/public/js/types/data";

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyId,
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, async (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        await fetchPayFrequencySelection();
    }
});

const props = defineProps({
    childComponentEmployeePayload: {
        type: Object,
        default: () => {
            return {};
        }
    },
    employeeCompensationData: {
        type: Array,
        default: () => {
            return [];
        }
    },
    employeeDeductionData: {
        type: Array,
        default: () => {
            return [];
        }
    },
    employeeIncomeTaxData: {
        type: Array,
        default: () => {
            return [];
        }
    },
    disableActions: {
        type: Boolean,
        default: false,
    },
    payrollComponentsPending: {
        type: Boolean,
        default: false,
    },
    isolated: {
        type: Boolean,
        default: false,
    },
});

const employeePayload = toRef(props, 'childComponentEmployeePayload');

const emit = defineEmits([
    'update:creatingOrEditingPayrollComponent',
    'update:payrollComponentsPending',
    'update:employeeCompensationData',
    'update:employeeDeductionData',
    'update:employeeIncomeTaxData',
]);

const payFrequencySelection = ref([]);
const fetchPayFrequencySelection = async () => {

    if(import.meta.server){return;}

    await laraFetch("/api/pay-frequency-selections", {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompanyId.value,
            }
        }
    },{
        onSuccessResponse: async (request, options, response) => {
            payFrequencySelection.value = _get(response, '_data.values.selection', []);
        }
    });
}
await fetchPayFrequencySelection();

watch(() => props.childComponentEmployeePayload, async (employeePayload) => {

    if(props.isolated && Boolean(employeePayload.id)){

        await employeeCompensationExecute();
        await employeeDeductionExecute();
        await employeeIncomeTaxExecute();
        emit('update:payrollComponentsPending', false);
    }
});

const creatingEmployee = computed(() => {
    return !Boolean(props.childComponentEmployeePayload.id);
});
const employeeUlid = computed(() => {
    return props.childComponentEmployeePayload.ulid;
});

const creatingOrEditingPayrollComponent = ref(false);
const deletingPayrollComponent = ref(false);
const creatingOrEditingPayrollComponentFormulable = ref<number | undefined>(undefined);
const editPayrollComponentPayloadIndex = ref(-1);
const payrollComponentEditPayload = ref({});
const createOrEditPayrollComponent = (payrollComponent: number, payrollComponentAttributes = {}, rowIndex = -1) => {
    creatingOrEditingPayrollComponent.value = true;
    if(creatingEmployee.value){
        editPayrollComponentPayloadIndex.value = rowIndex;
    }
    creatingOrEditingPayrollComponentFormulable.value = payrollComponent;

    payrollComponentEditPayload.value = payrollComponentAttributes;
};

const anyOfThePayrollComponentPending = computed(() => {
    return employeeCompensationPending.value || employeeDeductionPending.value || employeeIncomeTaxPending.value;
})

//Employee Compensation DataTable
const employeeCompensationHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'action'},
    { text: 'Compensation', value: 'name'},
    { text: 'Type', value: 'type'},
    { text: 'Amount', value: 'amount', alignData: 'right'},
    { text: 'Currency', value: 'currency'},
    { text: 'Pay Period', value: 'pay_period'},
    { text: 'Pay Type', value: 'pay_type'},
    { text: 'Pay Frequency', value: 'pay_frequency'},
    { text: 'From', value: 'amountable_start'},
    { text: 'To', value: 'amountable_end'},
]);

const employeeCompensationData = ref([]);
const selectedEmployeeCompensation = ref([]);
const employeeCompensationPending = ref(false);
const employeeCompensationExecute = async () => {

    if(import.meta.server || creatingEmployee.value){return;}

    employeeCompensationPending.value = true;

    await laraFetch(`/api/employee-payroll-info/${employeeUlid.value}/compensations`, {
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
            emit('update:employeeCompensationData', employeeCompensationData.value);
        }
    });
}

const disableEmployeeCompensationActions = computed(() => {
    return anyOfThePayrollComponentPending.value || creatingOrEditingPayrollComponent.value || deletingPayrollComponent.value || props.disableActions;
});
const disableEmployeeCompensationDataTable = computed(() => {
    return anyOfThePayrollComponentPending.value || creatingOrEditingPayrollComponent.value || deletingPayrollComponent.value || props.disableActions;
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

    if(import.meta.server || creatingEmployee.value){return;}

    employeeDeductionPending.value = true;

    await laraFetch(`/api/employee-payroll-info/${employeeUlid.value}/deductions`, {
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
            emit('update:employeeDeductionData', employeeDeductionData.value);
        }
    });
}

const disableEmployeeDeductionActions = computed(() => {
    return anyOfThePayrollComponentPending.value || creatingOrEditingPayrollComponent.value || deletingPayrollComponent.value || props.disableActions;
});
const disableEmployeeDeductionDataTable = computed(() => {
    return anyOfThePayrollComponentPending.value || creatingOrEditingPayrollComponent.value || deletingPayrollComponent.value || props.disableActions;
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

    if(import.meta.server || creatingEmployee.value){return;}

    employeeIncomeTaxPending.value = true;

    await laraFetch(`/api/employee-payroll-info/${employeeUlid.value}/income-taxes`, {
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
            emit('update:employeeIncomeTaxData', employeeIncomeTaxData.value);
        }
    });
}

const disableEmployeeIncomeTaxActions = computed(() => {
    return anyOfThePayrollComponentPending.value || creatingOrEditingPayrollComponent.value || deletingPayrollComponent.value || props.disableActions;
});
const disableEmployeeIncomeTaxDataTable = computed(() => {
    return anyOfThePayrollComponentPending.value || creatingOrEditingPayrollComponent.value || deletingPayrollComponent.value || props.disableActions;
});

//Fetch all employee payroll components

const employeePayrollComponentsExecute = async () => {

    if(import.meta.server || creatingEmployee.value){
        emit('update:payrollComponentsPending', false);
        return;
    }

    await laraFetch(`/api/employee-payroll-components/${employeeUlid.value}`, {
        method: 'GET',
    },{
        onRequestError: () => {
            emit('update:payrollComponentsPending', false);
        },
        onResponse: () => {
            emit('update:payrollComponentsPending', false);
        },
        onSuccessResponse: async (request, options, response) => {
            employeeCompensationData.value = _get(response, '_data.values.compensations.data', []);
            employeeDeductionData.value = _get(response, '_data.values.deductions.data', []);
            employeeIncomeTaxData.value = _get(response, '_data.values.income_taxes.data', []);

            emit('update:employeeCompensationData', employeeCompensationData.value);
            emit('update:employeeDeductionData', employeeDeductionData.value);
            emit('update:employeeIncomeTaxData', employeeIncomeTaxData.value);
        }
    });
}
await employeePayrollComponentsExecute();

const deleteSelectedPayrollComponent = async (component) => {

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
                        'company_id': selectedAssociatedCompanyId.value
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
        await employeeCompensationExecute();
    }

    if(component == FORMULABLE.DEDUCTIONS){
        selectedEmployeeDeduction.value = [];
        await employeeDeductionExecute();
    }

    if(component == FORMULABLE.INCOME_TAX){
        selectedEmployeeIncomeTax.value = [];
        await employeeIncomeTaxExecute();
    }

    deletingPayrollComponent.value = false;
}
const deletePayrollComponentRow = async (component, rowIndex) => {
    if(component == FORMULABLE.EARNINGS){
        employeeCompensationData.value.splice(rowIndex, 1);
        emit('update:employeeCompensationData', employeeCompensationData.value);
    }
    if(component == FORMULABLE.DEDUCTIONS){
        employeeDeductionData.value.splice(rowIndex, 1);
        emit('update:employeeDeductionData', employeeDeductionData.value);
    }
    if(component == FORMULABLE.INCOME_TAX){
        employeeIncomeTaxData.value.splice(rowIndex, 1);
        emit('update:employeeIncomeTaxData', employeeIncomeTaxData.value);
    }
}

const payrollComponentResolved = (component, attributes, rowIndex = -1) => {

    if(!creatingEmployee.value){

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
                emit('update:employeeCompensationData', employeeCompensationData.value);
            } else {
                employeeCompensationData.value.push(attributes);
                emit('update:employeeCompensationData', employeeCompensationData.value);
            }
        }

        if(component == FORMULABLE.DEDUCTIONS){
            if(rowIndex >= 0){
                employeeDeductionData.value.splice(rowIndex, 1, attributes);
                emit('update:employeeDeductionData', employeeDeductionData.value);
            } else {
                employeeDeductionData.value.push(attributes);
                emit('update:employeeDeductionData', employeeDeductionData.value);
            }
        }

        if(component == FORMULABLE.INCOME_TAX){
            if(rowIndex >= 0){
                employeeIncomeTaxData.value.splice(rowIndex, 1, attributes);
                emit('update:employeeIncomeTaxData', employeeIncomeTaxData.value);
            } else {
                employeeIncomeTaxData.value.push(attributes);
                emit('update:employeeIncomeTaxData', employeeIncomeTaxData.value);
            }
        }

    }
};

const resetPayrollComponents = () => {
    creatingOrEditingPayrollComponent.value = false;
    employeeCompensationData.value = [];
    employeeDeductionData.value = [];
    employeeIncomeTaxData.value = [];
    selectedEmployeeCompensation.value = [];
    selectedEmployeeDeduction.value = [];
    selectedEmployeeIncomeTax.value = [];
    editPayrollComponentPayloadIndex.value = -1;
    payrollComponentEditPayload.value = {};
};

defineExpose({
    resetPayrollComponents
});
</script>

<style scoped>

</style>