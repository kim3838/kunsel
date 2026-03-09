<template>
    <div>
        <PayrollComponentAssignmentModal
            v-model:creatingOrEditing="proxyCreatingOrEditing"
            v-model:employeePayload="employeePayload"
            v-model:editPayloadIndex="editPayrollComponentPayloadIndex"
            v-model:editPayload="payrollComponentEditPayload"
            v-model:payrollComponentFormulable="creatingOrEditingPayrollComponentFormulable"
            v-model:payFrequency="payFrequency"
            @resolved="payrollComponentResolved"
        ></PayrollComponentAssignmentModal>

        <fieldset class="lining-shadow rounded-sm tint-background">

            <div class="lining-shadow rounded-t-sm text-lg font-medium font-header px-4 py-2">Payroll Information</div>

            <div class="p-4 space-y-4">

                <div class="grid gap-2 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6">
                    <div>
                        <InputLabel :size="'sm'" value="Payroll group"/>
                        <SingleSelect :disabled="isolated" :none-selected-label="`No payroll group`" :searchable="false" :selection-max-viewable-line="10" drop-shadow value-persist :size="'md'" :key="payFrequencyOptionsKey" :options="payFrequencyOptions"/>
                    </div>
                </div>

                <div v-if="false">
                    <span class="font-semibold">Employee Payload:</span> {{childComponentEmployeePayload}}<br>
                    <span class="font-semibold">Prop Frequency Id:</span> {{payFrequencyId}}<br>
                    <span class="font-semibold">Pay Frequency :</span> {{payFrequency}}<br>
                    <span class="font-semibold">Pay Frequency Options:</span> {{payFrequencyOptions}}<br>
                    <span class="font-semibold">Compensations:</span> {{employeeCompensationData}}<br>
                    <span class="font-semibold">Employee Ulid:</span> {{employeeUlid}}<br>
                    <span class="font-semibold">Edit Payload Index:</span> {{editPayrollComponentPayloadIndex}}<br>
                    <span class="font-semibold">Props Disable Actions:</span> {{props.disableActions}}<br>
                </div>

                <div class="grid gap-2 grid-cols-1">
                    <div class="neutral-border p-2 space-y-2">

                        <div v-if="false">
                            <span class="font-semibold">Employee Compensations:</span> {{employeeCompensationData}}<br>
                            <span class="font-semibold">Employee Compensations[1]:</span> {{employeeCompensationData[1]}}<br>
                            <span class="font-semibold">Selected Employee Compensations:</span> {{selectedEmployeeCompensation}}<br>
                        </div>

                        <div v-if="employeeCompensationsSuccessful" class="inline-flex gap-2 items-center">
                            <Button
                                class="w-min"
                                :variant=" 'outline'"
                                :size="'sm'"
                                :disabled="disableEmployeeCompensationActions"
                                :icon="'mdi:plus'"
                                @click="createOrEditPayrollComponent(FORMULABLE.EARNINGS as number)"/>
                            <Button
                                v-if="!creatingEmployee"
                                class="w-min"
                                :variant="'outline'"
                                :size="'sm'"
                                :icon="'mdi:delete-outline'"
                                :disabled="disableEmployeeCompensationActions"
                                @click="deleteSelectedPayrollComponent(FORMULABLE.EARNINGS as number)" />
                            <Button
                                v-if="!creatingEmployee"
                                class="w-min"
                                :variant="'outline'"
                                :size="'sm'"
                                :icon="'ic:sharp-restart-alt'"
                                :disabled="disableEmployeeCompensationActions"
                                @click="employeeCompensationExecute" />
                            <UnorderedList
                                v-if="disableEmployeeCompensationActions"
                                :icon="'eos-icons:loading'"
                                :size="'md'"
                                :label="'Please wait...'"/>
                        </div>

                        <div v-if="!employeeCompensationsSuccessful" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                            <Label invert :size="'md'" :type="'danger'" :label="employeeCompensationsMessage" />
                        </div>

                        <DataTable
                            v-if="employeeCompensationsSuccessful"
                            :headers="employeeCompensationHeaders"
                            :size="'lg'"
                            :rows="employeeCompensationData"
                            :disabled="disableEmployeeCompensationDataTable"
                            v-model="selectedEmployeeCompensation"
                            selection>
                            <template v-slot:cell.action="{cell,slot, headerIndex, rowIndex}">
                                <div class="h-[32px] mx-0.5 space-x-0.5 w-full flex items-center">
                                    <Button
                                        v-if="creatingEmployee"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="slot.buttonSize"
                                        :disabled="disableEmployeeCompensationActions"
                                        :icon="'mdi:delete-forever'"
                                        @click="deletePayrollComponentRow(FORMULABLE.EARNINGS as number, rowIndex)"/>
                                    <Button
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="slot.buttonSize"
                                        :disabled="disableEmployeeCompensationActions"
                                        :icon="'mdi:pen'"
                                        @click="createOrEditPayrollComponent(FORMULABLE.EARNINGS as number, cell as EmployeePayrollComponentT, rowIndex)"/>
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
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">

                    <fieldset class="neutral-border p-2 space-y-2">

                        <div v-if="false">
                            <span class="font-semibold">Employee Deductions:</span> {{employeeDeductionData}}<br>
                            <span class="font-semibold">Employee Deductions[1]:</span> {{employeeDeductionData[1]}}<br>
                            <span class="font-semibold">Selected Employee Deductions:</span> {{selectedEmployeeDeduction}}<br>
                        </div>

                        <div v-if="employeeDeductionsSuccessful" class="inline-flex gap-2 items-center">
                            <Button
                                class="w-min"
                                :variant=" 'outline'"
                                :size="'sm'"
                                :disabled="disableEmployeeDeductionActions"
                                :icon="'mdi:plus'"
                                @click="createOrEditPayrollComponent(FORMULABLE.DEDUCTIONS as number)"/>
                            <Button
                                v-if="!creatingEmployee"
                                class="w-min"
                                :variant="'outline'"
                                :size="'sm'"
                                :icon="'mdi:delete-outline'"
                                :disabled="disableEmployeeDeductionActions"
                                @click="deleteSelectedPayrollComponent(FORMULABLE.DEDUCTIONS as number)" />
                            <Button
                                v-if="!creatingEmployee"
                                class="w-min"
                                :variant="'outline'"
                                :size="'sm'"
                                :icon="'ic:sharp-restart-alt'"
                                :disabled="disableEmployeeDeductionActions"
                                @click="employeeDeductionExecute" />
                            <UnorderedList
                                v-if="disableEmployeeDeductionActions"
                                :icon="'eos-icons:loading'"
                                :size="'md'"
                                :label="'Please wait...'"/>
                        </div>

                        <div v-if="!employeeDeductionsSuccessful" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                            <Label invert :size="'md'" :type="'danger'" :label="employeeDeductionsMessage" />
                        </div>

                        <DataTable
                            v-if="employeeDeductionsSuccessful"
                            :headers="employeeDeductionHeaders"
                            :size="'lg'"
                            :rows="employeeDeductionData"
                            :disabled="disableEmployeeDeductionDataTable"
                            v-model="selectedEmployeeDeduction"
                            selection>
                            <template v-slot:cell.action="{cell,slot, headerIndex, rowIndex}">
                                <div class="h-[32px] mx-0.5 space-x-0.5 w-full flex items-center">
                                    <Button
                                        v-if="creatingEmployee"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="slot.buttonSize"
                                        :disabled="disableEmployeeDeductionActions"
                                        :icon="'mdi:delete-forever'"
                                        @click="deletePayrollComponentRow(FORMULABLE.DEDUCTIONS as number, rowIndex)"/>
                                    <Button
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="slot.buttonSize"
                                        :disabled="disableEmployeeDeductionActions"
                                        :icon="'mdi:pen'"
                                        @click="createOrEditPayrollComponent(FORMULABLE.DEDUCTIONS as number, cell as EmployeePayrollComponentT, rowIndex)"/>
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

                    <fieldset class="lg:col-span-1 neutral-border p-2 space-y-2">

                        <div v-if="false">
                            <span class="font-semibold">Employee Income Taxes:</span> {{employeeIncomeTaxData}}<br>
                            <span class="font-semibold">Employee Income Taxes[1]:</span> {{employeeIncomeTaxData[1]}}<br>
                            <span class="font-semibold">Selected Employee Income Taxes:</span> {{selectedEmployeeIncomeTax}}<br>
                        </div>

                        <div v-if="employeeIncomeTaxesSuccessful" class="inline-flex gap-2 items-center">
                            <Button
                                class="w-min"
                                :variant=" 'outline'"
                                :size="'sm'"
                                :disabled="disableEmployeeIncomeTaxActions"
                                :icon="'mdi:plus'"
                                @click="createOrEditPayrollComponent(FORMULABLE.INCOME_TAX as number)"/>
                            <Button
                                v-if="!creatingEmployee"
                                class="w-min"
                                :variant="'outline'"
                                :size="'sm'"
                                :icon="'mdi:delete-outline'"
                                :disabled="disableEmployeeIncomeTaxActions"
                                @click="deleteSelectedPayrollComponent(FORMULABLE.INCOME_TAX as number)" />
                            <Button
                                v-if="!creatingEmployee"
                                class="w-min"
                                :variant="'outline'"
                                :size="'sm'"
                                :icon="'ic:sharp-restart-alt'"
                                :disabled="disableEmployeeIncomeTaxActions"
                                @click="employeeIncomeTaxExecute" />
                            <UnorderedList
                                v-if="disableEmployeeIncomeTaxActions"
                                :icon="'eos-icons:loading'"
                                :size="'md'"
                                :label="'Please wait...'"/>
                        </div>

                        <div v-if="!employeeIncomeTaxesSuccessful" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                            <Label invert :size="'md'" :type="'danger'" :label="employeeIncomeTaxesMessage" />
                        </div>

                        <DataTable
                            v-if="employeeIncomeTaxesSuccessful"
                            :headers="employeeIncomeTaxHeaders"
                            :size="'lg'"
                            :rows="employeeIncomeTaxData"
                            :disabled="disableEmployeeIncomeTaxDataTable"
                            v-model="selectedEmployeeIncomeTax"
                            selection>
                            <template v-slot:cell.action="{cell,slot, headerIndex, rowIndex}">
                                <div class="h-[32px] mx-0.5 space-x-0.5 w-full flex items-center">
                                    <Button
                                        v-if="creatingEmployee"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="slot.buttonSize"
                                        :disabled="disableEmployeeIncomeTaxActions"
                                        :icon="'mdi:delete-forever'"
                                        @click="deletePayrollComponentRow(FORMULABLE.INCOME_TAX as number, rowIndex)"/>
                                    <Button
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="slot.buttonSize"
                                        :disabled="disableEmployeeIncomeTaxActions"
                                        :icon="'mdi:pen'"
                                        @click="createOrEditPayrollComponent(FORMULABLE.INCOME_TAX as number, cell as EmployeePayrollComponentT, rowIndex)"/>
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
            </div>
        </fieldset>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {TableHeaderT} from "@/public/js/types/data";
import type {EmployeePayrollComponentT} from "@/public/js/types/payroll-component";
import type {PayFrequencyOptionT} from "@/public/js/common/type";

const companyOrganizationSelections = companyOrganizationSelectionsState();
const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId,
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, async (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        await preSelectPayFrequency();
    }
});

const props = defineProps({
    creatingOrEditing: {
        type: Boolean,
        default: false,
    },
    childComponentEmployeePayload: {
        type: Object,
        default: () => {
            return {};
        }
    },
    payFrequencyId: {
        type: Number as PropType<number | null>,
        default: null,
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
    'update:creatingOrEditing',
    'update:payrollComponentsPending',
    'update:payFrequencyId',
    'update:employeeCompensationData',
    'update:employeeDeductionData',
    'update:employeeIncomeTaxData',
]);

const proxyCreatingOrEditing = computed({
    get() {
        return props.creatingOrEditing;
    },
    set(newValue) {
        emit("update:creatingOrEditing", newValue);
    }
});

const proxyPayFrequencyId = computed<null|number>({
    get() {
        return props.payFrequencyId;
    },
    set(newValue) {
        emit("update:payFrequencyId", newValue);
    }
});

const PAY_FREQUENCY_VALID_PERIODS = {
    [PAY_FREQUENCY_TYPE.WEEKLY as number]: [PAY_PERIOD.HOURLY, PAY_PERIOD.DAILY],
    [PAY_FREQUENCY_TYPE.SEMIMONTHLY as number]: [PAY_PERIOD.HOURLY, PAY_PERIOD.DAILY, PAY_PERIOD.SEMIMONTHLY, PAY_PERIOD.MONTHLY],
    [PAY_FREQUENCY_TYPE.MONTHLY as number]: [PAY_PERIOD.HOURLY, PAY_PERIOD.DAILY, PAY_PERIOD.SEMIMONTHLY, PAY_PERIOD.MONTHLY]
};
const validatePayFrequencyPeriodCombination = (frequencyType: number, payPeriodValue: number): boolean => {
    const validPeriods = PAY_FREQUENCY_VALID_PERIODS[frequencyType];
    return validPeriods ? validPeriods.includes(payPeriodValue) : false;
};

const payFrequency = ref<PayFrequencyOptionT | null>(null);
const payFrequencyOptionsKey = shallowRef(0);
const payFrequencyOptions = reactive<{
    search: string,
    selection: PayFrequencyOptionT[],
    selected: null|number
}>({
    search: '',
    selection: companyOrganizationSelections.value.pay_frequencies,
    selected: null
})

const preSelectPayFrequency = async () => {

    payFrequencyOptions.selected = proxyPayFrequencyId.value;

    const selectedPayFrequencyItem = payFrequencyOptions.selection.find(item => item.value == proxyPayFrequencyId.value);

    if(selectedPayFrequencyItem){
        payFrequency.value = selectedPayFrequencyItem as PayFrequencyOptionT;
    }
}

if(!props.isolated){
    await preSelectPayFrequency();
}

watch(() => payFrequencyOptions.selected, (newValue, oldValue) => {

    let selectedPayFrequencyItem = payFrequencyOptions.selection.find(item => item.value == newValue) as PayFrequencyOptionT;
    let allValid = true;
    let errorMessage = '';

    if(employeeCompensationData.value.length > 0 && selectedPayFrequencyItem){

        //If a payroll group is changed to weekly and there is at least one semimonthly or monthly amount pay period,
        //revert changes and prompt unable to change
        employeeCompensationData.value.forEach(compensation => {

            const isAmountable = _includes([
                COMPENSATION.BASIC_PAY,
                COMPENSATION.REGULAR_ALLOWANCE
            ], compensation.payroll_componentable.type.value);

            if(isAmountable && allValid){
                const validPayPeriod = validatePayFrequencyPeriodCombination(selectedPayFrequencyItem.type_value, compensation.pay_period.value as number);

                if(!validPayPeriod){
                    allValid = false;

                    const frequencyName = PAY_FREQUENCY_NAME[selectedPayFrequencyItem.type_value];

                    let validPeriods:number[] = PAY_FREQUENCY_VALID_PERIODS[selectedPayFrequencyItem.type_value as number] as number[];

                    const validPeriodNames = validPeriods.map((period: number) => {

                        const periodName = PAY_PERIOD_NAME[period] as string;

                        return periodName.toLowerCase();
                    }).join(', ');

                    errorMessage = `${frequencyName} payroll group only allow (${validPeriodNames}) amount pay periods.`;
                }
            }
        })

        if(!allValid){
            payFrequencyOptions.selected = oldValue;

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: 'Unable to change payroll group.',
                message: errorMessage,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        } else {
            proxyPayFrequencyId.value = newValue;
        }

        payFrequencyOptionsKey.value++;

    }

    selectedPayFrequencyItem = payFrequencyOptions.selection.find(item => item.value == newValue) as PayFrequencyOptionT;

    proxyPayFrequencyId.value = newValue;

    if (!selectedPayFrequencyItem) {
        return;
    } else {
        payFrequency.value = selectedPayFrequencyItem as PayFrequencyOptionT;
    }

})

watch(() => props.childComponentEmployeePayload, async (employeePayload) => {

    if(props.isolated && Boolean(employeePayload.id) && props.payrollComponentsPending){

        await employeeCompensationExecute();
        await employeeDeductionExecute();
        await employeeIncomeTaxExecute();
        await preSelectPayFrequency();
        emit('update:payrollComponentsPending', false);
    }
});

const creatingEmployee = computed(() => {
    return !Boolean(props.childComponentEmployeePayload.id);
});
const employeeUlid = computed(() => {
    return props.childComponentEmployeePayload.ulid;
});

const deletingPayrollComponent = ref(false);
const creatingOrEditingPayrollComponentFormulable = ref<number | undefined>(undefined);
const editPayrollComponentPayloadIndex = ref(-1);
const payrollComponentEditPayload = ref<EmployeePayrollComponentT | {}>({});
const createOrEditPayrollComponent = (payrollComponent: number, payrollComponentAttributes:Partial<EmployeePayrollComponentT> = {}, rowIndex:number = -1) => {
    if(creatingEmployee.value){
        editPayrollComponentPayloadIndex.value = rowIndex;
    }

    if(FORMULABLE.EARNINGS == payrollComponent && !proxyPayFrequencyId.value){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: 'Payroll group not found.',
            message: 'Assign a payroll group before creating pay items.',
            action: {
                callback: () => {},
                label: 'Okay'
            }
        });

        return;
    }

    creatingOrEditingPayrollComponentFormulable.value = payrollComponent;

    payrollComponentEditPayload.value = payrollComponentAttributes;

    proxyCreatingOrEditing.value = true;
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
    { text: 'Amount Pay Period', value: 'pay_period'},
    { text: 'Currency', value: 'currency'},
    { text: 'Pay Type', value: 'pay_type'},
    { text: 'From', value: 'amountable_start'},
    { text: 'To', value: 'amountable_end'},
]);

const employeeCompensationData = ref<EmployeePayrollComponentT[]>([]);
const employeeCompensationsSuccessful = ref(true);
const employeeCompensationsMessage = ref('');
const selectedEmployeeCompensation = ref([]);
const employeeCompensationPending = ref(false);
const employeeCompensationExecute = async () => {

    if(import.meta.server || creatingEmployee.value){return;}

    employeeCompensationPending.value = true;

    await laraFetch(`/api/employee-payroll-info/${employeeUlid.value}/compensations`, {
        method: 'GET',
        params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            filters: {
                company_id: selectedAssociatedCompanyId.value
            }
        }
    },{
        onRequestError: () => {
            employeeCompensationPending.value = false;
        },
        onResponse: (request, options, response) => {
            employeeCompensationPending.value = false;
            employeeCompensationsSuccessful.value = _get(response, '_data.successful', false);
            employeeCompensationsMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            employeeCompensationData.value = _get(response, '_data.values.compensations', []);
            emit('update:employeeCompensationData', employeeCompensationData.value);
        }
    }, false);
}

const disableEmployeeCompensationActions = computed(() => {
    return anyOfThePayrollComponentPending.value || proxyCreatingOrEditing.value || deletingPayrollComponent.value || props.disableActions;
});
const disableEmployeeCompensationDataTable = computed(() => {
    return anyOfThePayrollComponentPending.value || proxyCreatingOrEditing.value || deletingPayrollComponent.value || props.disableActions;
});

//Employee Deduction DataTable
const employeeDeductionHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'action'},
    { text: 'Deduction', value: 'name'},
    { text: 'Type', value: 'type'},
]);

const employeeDeductionData = ref<EmployeePayrollComponentT[]>([]);
const employeeDeductionsSuccessful = ref(true);
const employeeDeductionsMessage = ref('');
const selectedEmployeeDeduction = ref([]);
const employeeDeductionPending = ref(false);
const employeeDeductionExecute = async () => {

    if(import.meta.server || creatingEmployee.value){return;}

    employeeDeductionPending.value = true;

    await laraFetch(`/api/employee-payroll-info/${employeeUlid.value}/deductions`, {
        method: 'GET',
        params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            filters: {
                company_id: selectedAssociatedCompanyId.value
            }
        }
    },{
        onRequestError: () => {
            employeeDeductionPending.value = false;
        },
        onResponse: (request, options, response) => {
            employeeDeductionPending.value = false;
            employeeDeductionsSuccessful.value = _get(response, '_data.successful', false);
            employeeDeductionsMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            employeeDeductionData.value = _get(response, '_data.values.deductions', []);
            emit('update:employeeDeductionData', employeeDeductionData.value);
        }
    }, false);
}

const disableEmployeeDeductionActions = computed(() => {
    return anyOfThePayrollComponentPending.value || proxyCreatingOrEditing.value || deletingPayrollComponent.value || props.disableActions;
});
const disableEmployeeDeductionDataTable = computed(() => {
    return anyOfThePayrollComponentPending.value || proxyCreatingOrEditing.value || deletingPayrollComponent.value || props.disableActions;
})

//Employee Income Tax DataTable
const employeeIncomeTaxHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'action'},
    { text: 'Tax', value: 'name'},
    { text: 'Type', value: 'type'},
]);

const employeeIncomeTaxData = ref<EmployeePayrollComponentT[]>([]);
const employeeIncomeTaxesSuccessful = ref(true);
const employeeIncomeTaxesMessage = ref('');
const selectedEmployeeIncomeTax = ref([]);
const employeeIncomeTaxPending = ref(false);
const employeeIncomeTaxExecute = async () => {

    if(import.meta.server || creatingEmployee.value){return;}

    employeeIncomeTaxPending.value = true;

    await laraFetch(`/api/employee-payroll-info/${employeeUlid.value}/income-taxes`, {
        method: 'GET',
        params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            filters: {
                company_id: selectedAssociatedCompanyId.value
            }
        }
    },{
        onRequestError: () => {
            employeeIncomeTaxPending.value = false;
        },
        onResponse: (request, options, response) => {
            employeeIncomeTaxPending.value = false;
            employeeIncomeTaxesSuccessful.value = _get(response, '_data.successful', false);
            employeeIncomeTaxesMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            employeeIncomeTaxData.value = _get(response, '_data.values.income_taxes', []);
            emit('update:employeeIncomeTaxData', employeeIncomeTaxData.value);
        }
    }, false);
}

const disableEmployeeIncomeTaxActions = computed(() => {
    return anyOfThePayrollComponentPending.value || proxyCreatingOrEditing.value || deletingPayrollComponent.value || props.disableActions;
});
const disableEmployeeIncomeTaxDataTable = computed(() => {
    return anyOfThePayrollComponentPending.value || proxyCreatingOrEditing.value || deletingPayrollComponent.value || props.disableActions;
});

//Fetch all employee payroll components when not isolated and editing employee
if(!props.isolated && !creatingEmployee.value){
    await employeeCompensationExecute();
    await employeeDeductionExecute();
    await employeeIncomeTaxExecute();
}


const deleteSelectedPayrollComponent = async (component: number) => {

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
                        'account_id': selectedAssociatedCompanyAccountId.value,
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
const deletePayrollComponentRow = async (component: number, rowIndex: number) => {
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

const payrollComponentResolved = (component: number, attributes: any, rowIndex = -1) => {

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
    proxyCreatingOrEditing.value = false;
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