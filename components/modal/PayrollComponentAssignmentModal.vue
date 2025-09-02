<template>
    <DialogModal
        :show="creatingOrEditing"
        :closeable="false"
        :landscape="true"
        :content-padding="'0'">
        <template #title>

        </template>
        <template #content>
            <div v-if="false">
                <span class="font-semibold">Employee Payload:</span> {{employeePayload}}<br>
                <span class="font-semibold">Edit Payload Index:</span> {{editPayloadIndex}}<br>
                <span class="font-semibold">Payroll Component Edit Payload:</span> {{editPayload}}<br>
                <span class="font-semibold">New Employee & New Payroll Component:</span> {{newEmployeeAndNewPayrollComponent}}<br>
                <span class="font-semibold">Existing Employee & New Payroll Component:</span> {{employeeExistAndNewPayrollComponent}}<br>
                <span class="font-semibold">Existing Employee & Existing Payroll Component:</span> {{employeeExistAndPayrollComponentExist}}<br>
                <span class="font-semibold">Edit mode :</span> {{editPayloadIndex >= 0 || employeePayrollComponentExists}}<br>
                <span class="font-semibold">Selected Payroll Component :</span> {{selectedPayrollComponent}}<br>
                <span class="font-semibold">Selected Pay Period :</span> {{selectedPayPeriod}}<br>
                <span class="font-semibold">Selected Pay Frequency :</span> {{selectedPayFrequency}}<br>
                <span class="font-semibold">Pay Frequency Type :</span> {{payFrequencyType}}<br>
                <span class="font-semibold">Amountable Start Selection :</span> {{amountableStartSelection}}<br>
                <span class="font-semibold">Amountable End Selection :</span> {{amountableEndSelection}}<br>
                <span class="font-semibold">Amountable Start Model :</span> {{amountableStart}}<br>
                <span class="font-semibold">Amountable End Model :</span> {{amountableEnd}}<br>
                <span class="font-semibold">Start Date :</span> {{startDate}}<br>
                <span class="font-semibold">End Date :</span> {{endDate}}<br>
                <span class="font-semibold">Component Formulable :</span> {{payrollComponentFormulable}}<br>
                <span class="font-semibold">Component Form :</span> {{componentForm}}<br>
                <span class="font-semibold">Form :</span> {{form}}<br>
            </div>
            <div ref='contentContainer'>
                <div v-if="loadingOverlay" :style="loadingOverlayDimensionStyle" class="absolute tint-background  z-50">
                    <div class="h-full flex items-center justify-center">
                        <UnorderedList :size="'lg'" :icon="'eos-icons:loading'">Please wait...</UnorderedList>
                    </div>
                </div>
                <div class="p-3 pt-4 mx-auto max-w-screen-lg grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5">
                    <div class="col-span-2">
                        <InputLabel :size="'sm'" value="Select"/>
                        <SingleSelect :searchable="false" drop-shadow value-persist :size="'md'" :options="assignablePayrollComponentOptions" @valueChange="assignablePayrollComponentSelectedChange"/>
                    </div>
                    <div v-if="selectedPayrollComponentIsAmountable">
                        <InputLabel :size="'sm'" value="Amount"/>
                        <Input v-model="amount" high-light-all-text-on-focus :size="'md'" :min="0" :type="'number'" type-strict />
                    </div>
                    <div v-if="selectedPayrollComponentIsAmountable">
                        <InputLabel :size="'sm'" value="Currency"/>
                        <Input v-model="currency" disabled :size="'md'" />
                    </div>
                    <div class="hidden md:block"></div>
                    <div v-if="selectedPayrollComponentIsAmountable">
                        <InputLabel :size="'sm'" value="Pay Period"/>
                        <SingleSelect :searchable="false" :selection-max-viewable-line="10" drop-shadow value-persist :size="'md'" :options="payPeriodOptions" @valueChange="payPeriodSelectedChange"/>
                    </div>
                    <div v-if="selectedPayrollComponentIsAmountable">
                        <InputLabel :size="'sm'" value="Pay Type"/>
                        <SingleSelect :searchable="false" :selection-max-viewable-line="10" drop-shadow value-persist :size="'md'" :options="payTypeOptions"/>
                    </div>
                    <div v-if="selectedPayrollComponentIsAmountable">
                        <InputLabel :size="'sm'" value="Pay Frequency"/>
                        <SingleSelect :searchable="false" :selection-max-viewable-line="10" drop-shadow value-persist :size="'md'" :options="payFrequencyOptions" @valueChange="payFrequencySelectedChange"/>
                    </div>
                    <div v-if="selectedPayrollComponentIsAmountable" class="col-span-full flex flex-wrap gap-2">
                        <div>
                            <InputLabel :size="'sm'" value="Date start"/>
                            <RadioGroup
                                :selections="amountableStartSelection"
                                :size="'md'"
                                :orientation="'horizontal'"
                                :radio-key="'amountable-start'"
                                @change="amountableStartSelectedChanged"
                                v-model="amountableStart" />
                        </div>
                        <div v-if="amountableStart == AMOUNTABLE_PAYROLL_COMPONENT_START.CUSTOM_DATE">
                            <InputLabel :size="'sm'" value="Start date"/>
                            <InputWithIcon
                                high-light-all-text-on-focus
                                @valueChanged="startDateChanged"
                                :override="{font_family_class: 'font-sans'}"
                                :icon="'mdi:calendar-cursor-outline'"
                                :id="`amountable-start-date`" v-model="startDate" :size="'md'" />
                        </div>
                    </div>
                    <div v-if="selectedPayrollComponentIsAmountable" class="col-span-full flex flex-wrap gap-2">
                        <div>
                            <InputLabel :size="'sm'" value="Date end"/>
                            <RadioGroup
                                :selections="amountableEndSelection"
                                :size="'md'"
                                :orientation="'horizontal'"
                                :radio-key="'amountable-end'"
                                @change="amountableEndSelectedChanged"
                                v-model="amountableEnd" />
                        </div>
                        <div v-if="amountableEnd == AMOUNTABLE_PAYROLL_COMPONENT_END.CUSTOM_DATE">
                            <InputLabel :size="'sm'" value="End Date"/>
                            <InputWithIcon
                                high-light-all-text-on-focus
                                @valueChanged="endDateChanged"
                                :override="{font_family_class: 'font-sans'}"
                                :icon="'mdi:calendar-cursor-outline'"
                                :id="`amountable-end-date`" v-model="endDate" :size="'md'" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="mx-auto max-w-screen-lg">
                <div class="flex space-x-2 justify-between">
                    <div class="space-x-2 inline-flex">
                        <div class="space-x-2 inline-flex items-center">
                            <UnorderedList
                                v-if="submitPending"
                                :icon="'eos-icons:loading'"
                                :size="'md'"
                                :label="'Please wait...'"/>
                        </div>
                    </div>
                    <div class="space-x-2 inline-flex items-center">
                        <Button
                            class="w-min"
                            :variant=" 'outline'"
                            :size="'md'"
                            :disabled="disableActions"
                            :icon="'mdi:cancel'"
                            :label="'Cancel'"
                            @click="closeModal"/>
                        <Button
                            class="w-min"
                            :variant="'default'"
                            :size="'md'"
                            :icon="submitButtonIcon"
                            :disabled="disableActions"
                            :label="saveButtonLabel"
                            @click="submit"/>
                    </div>
                </div>
            </div>
        </template>
    </DialogModal>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";

const coreStore = useCoreStore();
const nuxtApp = useNuxtApp();
const moment = useNuxtApp().$moment;
const {payrollComponentPaySelections} = useCommon();
const {render} = dateTimePicker();

const {
    selectedAssociatedCompanyId,
    selectedAssociatedCompany
} = storeToRefs(nuxtApp.$authStore);

const props = defineProps({
    creatingOrEditing: {
        type: Boolean,
        default: false,
    },
    employeePayload: {
        type: Object,
        default: () => {
            return {};
        }
    },
    editPayload: {
        type: Object,
        default: () => {
            return {};
        }
    },
    editPayloadIndex:{
        type: Number,
        default: -1,
    },
    payrollComponentFormulable: {
        type: Number,
        default: undefined
    },
    payPeriodSelection: {
        type: Array,
        default: () => {
            return [];
        }
    },
    payTypeSelection: {
        type: Array,
        default: () => {
            return [];
        }
    },
    payFrequencySelection: {
        type: Array,
        default: () => {
            return [];
        }
    },
});

const amountableStartSelection = reactive([
    {text : AMOUNTABLE_PAYROLL_COMPONENT_START_NAME[AMOUNTABLE_PAYROLL_COMPONENT_START.NOT_SPECIFIED], value: AMOUNTABLE_PAYROLL_COMPONENT_START.NOT_SPECIFIED},
    {text : AMOUNTABLE_PAYROLL_COMPONENT_START_NAME[AMOUNTABLE_PAYROLL_COMPONENT_START.EMPLOYMENT_START_DATE], value: AMOUNTABLE_PAYROLL_COMPONENT_START.EMPLOYMENT_START_DATE},
    {text : AMOUNTABLE_PAYROLL_COMPONENT_START_NAME[AMOUNTABLE_PAYROLL_COMPONENT_START.CUSTOM_DATE], value: AMOUNTABLE_PAYROLL_COMPONENT_START.CUSTOM_DATE},
]);

const amountableEndSelection = reactive([
    {text : AMOUNTABLE_PAYROLL_COMPONENT_END_NAME[AMOUNTABLE_PAYROLL_COMPONENT_END.NOT_SPECIFIED], value: AMOUNTABLE_PAYROLL_COMPONENT_END.NOT_SPECIFIED},
    {text : AMOUNTABLE_PAYROLL_COMPONENT_END_NAME[AMOUNTABLE_PAYROLL_COMPONENT_END.CUSTOM_DATE], value: AMOUNTABLE_PAYROLL_COMPONENT_END.CUSTOM_DATE},
]);

const {width: contentContainerWidth, height: contentContainerHeight} = useElementSize(useTemplateRef('contentContainer'));
const loadingOverlayDimensionStyle = computed(() => {
    return {
        width: `${contentContainerWidth.value}px`,
        height: `${contentContainerHeight.value}px`
    };
});

const payPeriodSelection = payrollComponentPaySelections.value.pay_period;
const payTypeSelection = payrollComponentPaySelections.value.pay_type;
const payFrequencySelection = toRef(props, 'payFrequencySelection');

const emit = defineEmits(['update:creatingOrEditing', 'update:payrollComponentFormulable', 'update:editPayload', 'update:editPayloadIndex', 'resolved']);

const payPeriodOptions = reactive({search: '', selection: payPeriodSelection, selected: null});
const payTypeOptions = reactive({search: '', selection: payTypeSelection, selected: null});
const payFrequencyOptions = reactive({search: '', selection: payFrequencySelection, selected: null});

const selectedPayrollComponentIsAmountable = ref(false);
const selectedPayrollComponent = ref<{} | null>({});
const selectedPayPeriod = ref<{} | null>({});
const selectedPayFrequency = ref<{} | null>({});

watch(selectedPayrollComponentIsAmountable, (selectedPayrollComponentIsAmountable) => {
    if(selectedPayrollComponentIsAmountable && amountableStart.value == AMOUNTABLE_PAYROLL_COMPONENT_START.CUSTOM_DATE){
        render(dateStartAndEndDatePickers.value);
    }
    if(selectedPayrollComponentIsAmountable && amountableEnd.value == AMOUNTABLE_PAYROLL_COMPONENT_END.CUSTOM_DATE){
        render(dateStartAndEndDatePickers.value);
    }
});
const assignablePayrollComponentSelectedChange = (value: null | number) => {
    const selectedPayrollComponentTemp = assignablePayrollComponentOptions.selection.find(item => item.value === value);

    if (!selectedPayrollComponentTemp) {
        return;
    }

    selectedPayrollComponent.value = selectedPayrollComponentTemp;

    if(props.payrollComponentFormulable == FORMULABLE.EARNINGS){

        selectedPayrollComponentIsAmountable.value = _includes([
            COMPENSATION.BASIC_SALARY,
            COMPENSATION.REGULAR_ALLOWANCE
        ], selectedPayrollComponentTemp.type.value);

        if(!selectedPayrollComponentIsAmountable.value){
            amount.value = 0;
            currency.value = defaultCurrency.value;
            payPeriodOptions.selected = null;
            payTypeOptions.selected = null;
            payFrequencyOptions.selected = null;
            payFrequencyType.value = null;
            amountableStart.value = null;
            startDate.value = null;
            amountableEnd.value = null;
            endDate.value = null;
        } else {

            if(amountableStart.value == null){
                amountableStart.value = AMOUNTABLE_PAYROLL_COMPONENT_START.NOT_SPECIFIED;
            }

            if(amountableEnd.value == null){
                amountableEnd.value = AMOUNTABLE_PAYROLL_COMPONENT_END.NOT_SPECIFIED;
            }
        }

    } else {

        amountableStart.value = null;
        startDate.value = null;
        amountableEnd.value = null;
        endDate.value = null;
    }
}

const PAY_PERIOD_VALID_FREQUENCIES = {
    [PAY_PERIOD.HOURLY]: [PAY_FREQUENCY_TYPE.DAILY, PAY_FREQUENCY_TYPE.WEEKLY, PAY_FREQUENCY_TYPE.SEMI_MONTHLY, PAY_FREQUENCY_TYPE.MONTHLY],
    [PAY_PERIOD.DAILY]: [PAY_FREQUENCY_TYPE.DAILY, PAY_FREQUENCY_TYPE.WEEKLY, PAY_FREQUENCY_TYPE.SEMI_MONTHLY, PAY_FREQUENCY_TYPE.MONTHLY],
    [PAY_PERIOD.SEMI_MONTHLY]: [PAY_FREQUENCY_TYPE.SEMI_MONTHLY, PAY_FREQUENCY_TYPE.MONTHLY],
    [PAY_PERIOD.MONTHLY]: [PAY_FREQUENCY_TYPE.SEMI_MONTHLY, PAY_FREQUENCY_TYPE.MONTHLY]
};

const PAY_FREQUENCY_VALID_PERIODS = {
    [PAY_FREQUENCY_TYPE.DAILY]: [PAY_PERIOD.HOURLY, PAY_PERIOD.DAILY],
    [PAY_FREQUENCY_TYPE.WEEKLY]: [PAY_PERIOD.HOURLY, PAY_PERIOD.DAILY],
    [PAY_FREQUENCY_TYPE.SEMI_MONTHLY]: [PAY_PERIOD.HOURLY, PAY_PERIOD.DAILY, PAY_PERIOD.SEMI_MONTHLY, PAY_PERIOD.MONTHLY],
    [PAY_FREQUENCY_TYPE.MONTHLY]: [PAY_PERIOD.HOURLY, PAY_PERIOD.DAILY, PAY_PERIOD.SEMI_MONTHLY, PAY_PERIOD.MONTHLY]
};

const validatePayPeriodFrequencyCombination = (payPeriodValue: number, frequencyType: number): boolean => {
    const validFrequencies = PAY_PERIOD_VALID_FREQUENCIES[payPeriodValue];
    return validFrequencies ? validFrequencies.includes(frequencyType) : false;
};

const validatePayFrequencyPeriodCombination = (frequencyType: number, payPeriodValue: number): boolean => {
    const validPeriods = PAY_FREQUENCY_VALID_PERIODS[frequencyType];
    return validPeriods ? validPeriods.includes(payPeriodValue) : false;
};

const resetPayPeriodSelection = () => {
    payPeriodOptions.selected = null;
    selectedPayPeriod.value = null;
};

const resetPayFrequencySelection = () => {
    payFrequencyOptions.selected = null;
    selectedPayFrequency.value = null;
    payFrequencyType.value = null;
};

const showValidationError = (message: string) => {
    coreStore.setServiceError({
        prompt: true,
        payload: { message }
    });
};

const payPeriodSelectedChange = (value: null | number) => {
    const selectedPayPeriodItem = payPeriodOptions.selection.find(item => item.value == value);
    if (!selectedPayPeriodItem) {
        return;
    }

    const selectedPayFrequencyItem = payFrequencyOptions.selection.find(item => item.value == payFrequencyOptions.selected);
    let selectedFrequencyType = null;

    if(selectedPayFrequencyItem){
        selectedFrequencyType = selectedPayFrequencyItem?.type_value;
    }

    selectedPayPeriod.value = selectedPayPeriodItem;

    if (payPeriodOptions.selected !== null && selectedFrequencyType !== null) {
        const isValidCombination = validatePayPeriodFrequencyCombination(selectedPayPeriodItem.value, selectedFrequencyType);

        if (!isValidCombination) {
            const periodName = PAY_PERIOD_NAME[selectedPayPeriodItem.value];
            const validFrequencyNames = PAY_PERIOD_VALID_FREQUENCIES[selectedPayPeriodItem.value]
                .map(freq => PAY_FREQUENCY_NAME[freq].toLowerCase())
                .join(', ');

            showValidationError(`${periodName} pay period only allow (${validFrequencyNames}) pay frequencies.`);
            resetPayPeriodSelection();
        }
    }
};

const payFrequencySelectedChange = (value: null | number) => {
    const selectedPayFrequencyItem = payFrequencyOptions.selection.find(item => item.value == value);
    if (!selectedPayFrequencyItem) {
        return;
    }

    selectedPayFrequency.value = selectedPayFrequencyItem;
    payFrequencyType.value = selectedPayFrequencyItem.type_value;

    if (payFrequencyOptions.selected !== null && payPeriodOptions.selected !== null) {
        const isValidCombination = validatePayFrequencyPeriodCombination(selectedPayFrequencyItem.type_value, payPeriodOptions.selected);

        if (!isValidCombination) {
            const frequencyName = PAY_FREQUENCY_NAME[selectedPayFrequencyItem.type_value];
            const validPeriodNames = PAY_FREQUENCY_VALID_PERIODS[selectedPayFrequencyItem.type_value]
                .map(period => PAY_PERIOD_NAME[period].toLowerCase())
                .join(', ');

            showValidationError(`${frequencyName} pay frequency only allow (${validPeriodNames}) pay periods.`);
            resetPayFrequencySelection();
        }
    }
};

//Payroll Component Label
const payrollComponentSubject = computed(()=>{

    if(props.payrollComponentFormulable == undefined){return '';}

    return {
        [FORMULABLE.EARNINGS]: 'compensation',
        [FORMULABLE.DEDUCTIONS]: 'deduction',
        [FORMULABLE.INCOME_TAX]: 'income tax',
        null: ''
    }[props.payrollComponentFormulable];
});

//Payroll Component Model Map Key
const formulableModelMapKey = computed(()=>{
    if(props.payrollComponentFormulable == undefined){return '';}

    return FORMULABLE_MODEL_MAP_KEY[props.payrollComponentFormulable];
});

//Assignable Employee Payroll Component Selections
const assignablePayrollComponentOptions = reactive({
    search: '',
    selection: [],
    selected: null
});

const assignablePayrollComponentPending = ref(false);
const assignablePayrollComponentExecute = async () => {

    if(_isEmpty(formulableModelMapKey.value)){
        return;
    }

    assignablePayrollComponentPending.value = true;

    await laraFetch(`/api/${_replace(formulableModelMapKey.value,'_','-')}-selections`, {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompanyId.value,
                'assignable': true
            }
        }
    }, {
        onRequestError: () => {
            assignablePayrollComponentPending.value = false;
        },
        onResponse: () => {
            assignablePayrollComponentPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            assignablePayrollComponentOptions.selection = _get(response, '_data.values.selection', []);

            loadEditable();
        }
    });
}

watch(() => props.creatingOrEditing, (creatingOrEditing) => {
    if(creatingOrEditing){
        assignablePayrollComponentExecute();
    }
});

const amountableStartSelectedChanged = () => {

    if(selectedPayrollComponentIsAmountable && amountableStart.value == AMOUNTABLE_PAYROLL_COMPONENT_START.CUSTOM_DATE){

        if(startDate.value == null){
            startDate.value = moment().format("YYYY-MM-DD");
        }

        render(dateStartAndEndDatePickers.value);
    } else {

        startDate.value = null
    }
};

const amountableEndSelectedChanged = () => {

    if(selectedPayrollComponentIsAmountable && amountableEnd.value == AMOUNTABLE_PAYROLL_COMPONENT_END.CUSTOM_DATE){

        if(endDate.value == null){
            endDate.value = moment().format("YYYY-MM-DD");
        }

        render(dateStartAndEndDatePickers.value);
    } else {

        endDate.value = null
    }
};

const startDateChanged = (value) => {
    let dateValid = moment(value.trim(), "YYYY-MM-DD", true).isValid();

    if(!dateValid){
        startDate.value = moment().format("YYYY-MM-DD")
    }
}
const endDateChanged = (value) => {
    let dateValid = moment(value.trim(), "YYYY-MM-DD", true).isValid();

    if(!dateValid){
        endDate.value = moment().format("YYYY-MM-DD")
    }
}

const amount = ref(0);
const currency = ref<string | null>('');
const defaultCurrency = ref(selectedAssociatedCompany.value?.payload.currency ?? null);
const payFrequencyType = ref<number | null>(null);
const amountableStart = ref<number | null>(null);
const startDate = ref<string | null>(moment().format("YYYY-MM-DD"));
const amountableEnd = ref<number | null>(null);
const endDate = ref<string | null>(moment().format("YYYY-MM-DD"));

const loadEditable = () => {
    amount.value = _get(props.editPayload, 'amount', 0);
    currency.value = _get(props.editPayload, 'currency', defaultCurrency.value);
    payPeriodOptions.selected = _get(props.editPayload, 'pay_period.value', null);
    payTypeOptions.selected = _get(props.editPayload, 'pay_type.value', null);
    payFrequencyOptions.selected = _get(props.editPayload, 'pay_frequency_id', null);
    payFrequencyType.value = _get(props.editPayload, 'pay_frequency.type.value', null);
    assignablePayrollComponentOptions.selected = _get(props.editPayload, 'payroll_componentable_id', null);

    amountableStart.value = _get(props.editPayload, 'amountable_start.value', AMOUNTABLE_PAYROLL_COMPONENT_START.NOT_SPECIFIED);

    let startDateTemp = _get(props.editPayload, 'start_date', null);
    startDate.value = startDateTemp ? moment(startDateTemp).format("YYYY-MM-DD") : null;

    amountableEnd.value = _get(props.editPayload, 'amountable_end.value', AMOUNTABLE_PAYROLL_COMPONENT_END.NOT_SPECIFIED);

    let endDateTemp = _get(props.editPayload, 'end_date', null);
    endDate.value = endDateTemp ? moment(endDateTemp).format("YYYY-MM-DD") : null;
};

const closeModal = () => {
    emit('update:creatingOrEditing', false);
    emit('update:payrollComponentFormulable', null);
    emit('update:editPayload', {});
    emit('update:editPayloadIndex', -1);
    reset();
};
const reset = () => {
    amount.value = 0;
    currency.value = defaultCurrency.value;
    assignablePayrollComponentOptions.selected = null;
    payPeriodOptions.selected = null;
    payTypeOptions.selected = null;
    payFrequencyOptions.selected = null;
    payFrequencyType.value = null;
    selectedPayrollComponentIsAmountable.value = false;
    selectedPayrollComponent.value = null;
    selectedPayPeriod.value = null;
    selectedPayFrequency.value = null;
    amountableStart.value = null;
    amountableEnd.value = null;
    startDate.value = null;
    endDate.value = null;
}

const loadingOverlay = computed(()=>{
    return assignablePayrollComponentPending.value;
});
const disableActions = computed(()=>{
    return submitPending.value  || loadingOverlay.value;
});
const employeeExists = computed(() => {
    return Boolean(props.employeePayload.id);
});
const employeePayrollComponentExists = computed(()=>{
    return Boolean(props.editPayload.id);
});
const submitButtonIcon = computed(()=>{
    const ICON = {
        CREATE: 'mdi:plus',
        EDIT: 'mdi:pen'
    } as const;

    const isEditMode = props.editPayloadIndex >= 0 || employeePayrollComponentExists.value;

    return isEditMode ? ICON.EDIT : ICON.CREATE;
});
const saveButtonLabel = computed(()=>{
    const LABEL = {
        CREATE: `Assign ${_startCase(payrollComponentSubject.value)}`,
        EDIT: `Update`
    } as const;

    const isEditMode = props.editPayloadIndex >= 0 || employeePayrollComponentExists.value;

    return isEditMode ? LABEL.EDIT : LABEL.CREATE;
});
const newEmployeeAndNewPayrollComponent = computed(() => {
    return !employeeExists.value && !employeePayrollComponentExists.value;
});
const employeeExistAndNewPayrollComponent = computed(() => {
    return employeeExists.value && !employeePayrollComponentExists.value;
});
const employeeExistAndPayrollComponentExist = computed(() => {
    return employeeExists.value && employeePayrollComponentExists.value;
});
const submitPath = computed(() => {
    if(employeeExistAndPayrollComponentExist.value){
        return `/api/employee-payroll-component/${props.editPayload.id}`;
    }

    if(employeeExistAndNewPayrollComponent.value){
        return `/api/employee-payroll-component`;
    }

    if(newEmployeeAndNewPayrollComponent.value){
        return `/api/employee-payroll-component-validate`;
    }
});
const submitAction = computed(() => {
    if(employeeExistAndPayrollComponentExist.value){
        return `PATCH`;
    }

    if(employeeExistAndNewPayrollComponent.value || newEmployeeAndNewPayrollComponent.value){
        return `POST`;
    }
});

const componentForm = computed(() => {
    if(_isEmpty(selectedPayrollComponent.value)){
        return {};
    }

    let selectedPayrollComponentType = _get(selectedPayrollComponent.value, 'type.value');

    let componentFormTemp = <{
        formulable_type: number,
        amount: number,
        currency: string | null,
        pay_period: number | null,
        pay_type: number | null,
        pay_frequency_id: number | null,
        pay_frequency_type: number | null,
        amountable_start: number | null,
        amountable_end: number | null,
        start_date?: string | null,
        end_date?: string | null,
    }>{
        formulable_type: props.payrollComponentFormulable
    };

    if(props.payrollComponentFormulable == FORMULABLE.EARNINGS){

        if (selectedPayrollComponentType == COMPENSATION.BASIC_SALARY ||
            selectedPayrollComponentType == COMPENSATION.REGULAR_ALLOWANCE) {

            componentFormTemp = {
                ...componentFormTemp,
                'amount': amount.value,
                'currency': currency.value,
                'pay_period': payPeriodOptions.selected,
                'pay_type': payTypeOptions.selected,
                'pay_frequency_id': payFrequencyOptions.selected,
                'pay_frequency_type': payFrequencyType.value,
                'amountable_start': amountableStart.value,
                'amountable_end': amountableEnd.value,
            };

            if(amountableStart.value == AMOUNTABLE_PAYROLL_COMPONENT_START.CUSTOM_DATE){
                componentFormTemp = {
                    ...componentFormTemp,
                    'start_date': startDate.value
                };
            }

            if(amountableEnd.value == AMOUNTABLE_PAYROLL_COMPONENT_END.CUSTOM_DATE){
                componentFormTemp = {
                    ...componentFormTemp,
                    'end_date': endDate.value
                };
            }

            return componentFormTemp;
        }
    }

    return componentFormTemp;
});
const form = computed(() => {
    let formTemp = <{
        company_id: number,
        payroll_componentable_id: number | null,
        payroll_componentable_type: string,
        employee_id?: number | null,
    }>{
        'company_id': selectedAssociatedCompanyId.value,
        'payroll_componentable_id' : assignablePayrollComponentOptions.selected,
        'payroll_componentable_type' : formulableModelMapKey.value,
    };

    if(employeeExists.value){formTemp = {...formTemp, employee_id: props.employeePayload.id}}

    formTemp = {...formTemp, ...componentForm.value}

    return formTemp;
});

const submitPending = ref(false);
const submit = async() => {
    submitPending.value = true;

    await laraFetch(submitPath.value, {
        method: submitAction.value,
        body: form.value,
    }, {
        onRequestError: () => {
            submitPending.value = false;
        },
        onResponse: () => {
            submitPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            const resolved:null | {} = employeeExists.value ? null : _get(response, '_data.values.payroll_component', {});

            emit('resolved', props.payrollComponentFormulable, resolved, props.editPayloadIndex);

            closeModal();
        },
    });
}

const dateStartAndEndDatePickers = ref([
    {
        id: `amountable-start-date`,
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            startDate.value = payload.value;
        }
    },
    {
        id: `amountable-end-date`,
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            endDate.value = payload.value;
        }
    },
]);
</script>

<style scoped>

</style>