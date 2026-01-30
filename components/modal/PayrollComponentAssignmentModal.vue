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
                <span class="font-semibold">Pay Frequency :</span> {{payFrequency}}<br>
                <span class="font-semibold">New Employee & New Payroll Component:</span> {{newEmployeeAndNewPayrollComponent}}<br>
                <span class="font-semibold">Existing Employee & New Payroll Component:</span> {{employeeExistAndNewPayrollComponent}}<br>
                <span class="font-semibold">Existing Employee & Existing Payroll Component:</span> {{employeeExistAndPayrollComponentExist}}<br>
                <span class="font-semibold">Edit mode :</span> {{editPayloadIndex >= 0 || employeePayrollComponentExists}}<br>
                <span class="font-semibold">Selected Payroll Component :</span> {{selectedPayrollComponent}}<br>
                <span class="font-semibold">Selected Pay Period :</span> {{selectedPayPeriod}}<br>
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

                <div class="p-3 pt-4 mx-auto max-w-screen-lg grid gap-2 grid-cols-4 sm:grid-cols-5 md:grid-cols-6">
                    <div v-if="formulableTabSelectable && !singleFormulableMode" class="col-span-full">
                        <RadioGroup
                            :disabled="disableActions"
                            :selections="formulableTypeTabs"
                            :size="'md'"
                            :orientation="'horizontal'"
                            :radio-key="`formulable_type`"
                            v-model="formulableTypeTab" />
                    </div>
                    <div class="col-span-2">
                        <InputLabel :size="'sm'" value="Select Payroll Component"/>
                        <SingleSelect
                            :key="assignablePayrollComponentOptionsKey"
                            :disabled="assignablePayrollComponentPending"
                            :searchable="false"
                            drop-shadow
                            value-persist
                            :size="'md'"
                            :options="assignablePayrollComponentOptions"
                            @valueChange="assignablePayrollComponentSelectedChange"/>
                    </div>
                    <div v-if="selectedPayrollComponentIsAmountable">
                        <InputLabel :size="'sm'" value="Amount"/>
                        <Input v-model="amount" high-light-all-text-on-focus :size="'md'" :min="0" :type="'number'" type-strict />
                    </div>
                    <div v-if="selectedPayrollComponentIsAmountable">
                        <InputLabel :size="'sm'" value="Amount Pay Period"/>
                        <SingleSelect :searchable="false" :selection-max-viewable-line="10" drop-shadow value-persist :size="'md'" :options="payPeriodOptions" @valueChange="payPeriodSelectedChange"/>
                    </div>
                    <div v-if="selectedPayrollComponentIsAmountable">
                        <InputLabel :size="'sm'" value="Currency"/>
                        <Input v-model="currency" disabled :size="'md'" />
                    </div>
                    <div v-if="selectedPayrollComponentIsAmountable">
                        <InputLabel :size="'sm'" value="Pay Type"/>
                        <SingleSelect :searchable="false" :selection-max-viewable-line="10" drop-shadow value-persist :size="'md'" :options="payTypeOptions"/>
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
                            :label="'Cancel'"
                            @click="closeModal(true)"/>
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
import type {AssignablePayrollComponentOptionT, EnumSelection, PayFrequencyOptionT, PayPeriodOptionT, PayTypeOptionT, StringEnumInterface} from "@/public/js/common/type";
import type {EmployeePayrollComponentT} from "@/public/js/types/payroll-component";

const coreStore = useCoreStore();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const moment = useNuxtApp().$moment;
const {payrollComponentPaySelections} = useCommon();
const {render} = dateTimePicker();

const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId,
    selectedAssociatedCompany
} = storeToRefs(nuxtApp.$authStore);

const props = defineProps({
    creatingOrEditing: {
        type: Boolean,
        default: false,
    },
    singleFormulableMode: {
        type: Boolean,
        default: true,
    },
    employeePayload: {
        type: Object,
        default: () => {
            return {};
        }
    },
    editPayload: {
        type: Object as PropType<EmployeePayrollComponentT | {}>,
        default: () => {
            return {};
        }
    },
    editPayloadIndex:{
        type: Number,
        default: -1,
    },
    payrollComponentFormulable: {
        type: [String, Number],
        default: undefined
    },
    payFrequency: {
        type: Object as PropType<PayFrequencyOptionT | null>,
        default: null
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

const formulableTypeTab = ref(FORMULABLE.EARNINGS);
const formulableTypeTabs = reactive([
    $enumerableOption(FORMULABLE_NAME, FORMULABLE.EARNINGS as number),
    $enumerableOption(FORMULABLE_NAME, FORMULABLE.DEDUCTIONS as number),
    $enumerableOption(FORMULABLE_NAME, FORMULABLE.INCOME_TAX as number),
]);

const amountableStartSelection = reactive<EnumSelection>([
    $enumerableOption(AMOUNTABLE_PAYROLL_COMPONENT_START_NAME, AMOUNTABLE_PAYROLL_COMPONENT_START.NOT_SPECIFIED as number),
    $enumerableOption(AMOUNTABLE_PAYROLL_COMPONENT_START_NAME, AMOUNTABLE_PAYROLL_COMPONENT_START.CUSTOM_DATE as number),
]);

const amountableEndSelection = reactive<EnumSelection>([
    $enumerableOption(AMOUNTABLE_PAYROLL_COMPONENT_END_NAME, AMOUNTABLE_PAYROLL_COMPONENT_END.NOT_SPECIFIED as number),
    $enumerableOption(AMOUNTABLE_PAYROLL_COMPONENT_END_NAME, AMOUNTABLE_PAYROLL_COMPONENT_END.CUSTOM_DATE as number),
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

const emit = defineEmits(['update:creatingOrEditing', 'update:payrollComponentFormulable', 'update:editPayload', 'update:editPayloadIndex', 'resolved', 'cancelled']);

watch(formulableTypeTab, async (formulableTypeTab) => {

    if(props.creatingOrEditing && formulableTabSelectable.value && !props.singleFormulableMode){
        emit('update:payrollComponentFormulable', formulableTypeTab);

        assignablePayrollComponentOptions.selected = null;
        assignablePayrollComponentOptionsKey.value++;
        selectedPayrollComponentIsAmountable.value = false;
        await nextTick();
        await assignablePayrollComponentExecute();
    }
});

const payPeriodOptions = reactive<{search: string, selection: PayPeriodOptionT[], selected: string|null|number}>({search: '', selection: payPeriodSelection, selected: null});
const payTypeOptions = reactive<{search: string, selection: PayTypeOptionT[], selected: string|null|number}>({search: '', selection: payTypeSelection, selected: null});

const selectedPayrollComponentIsAmountable = ref(false);
const selectedPayrollComponent = ref<{} | null>({});
const selectedPayPeriod = ref<{} | null>({});

watch(selectedPayrollComponentIsAmountable, (selectedPayrollComponentIsAmountable) => {
    if(selectedPayrollComponentIsAmountable && amountableStart.value == AMOUNTABLE_PAYROLL_COMPONENT_START.CUSTOM_DATE){
        render(dateStartAndEndDatePickers.value);
    }
    if(selectedPayrollComponentIsAmountable && amountableEnd.value == AMOUNTABLE_PAYROLL_COMPONENT_END.CUSTOM_DATE){
        render(dateStartAndEndDatePickers.value);
    }
});
const assignablePayrollComponentSelectedChange = (value: null | number) => {
    const selectedPayrollComponentTemp: undefined | AssignablePayrollComponentOptionT = assignablePayrollComponentOptions.selection.find(item => item.value === value);

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
            payFrequencyType.value = null;
            amountableStart.value = null;
            startDate.value = null;
            amountableEnd.value = null;
            endDate.value = null;
        } else {

            if(amountableStart.value == null){
                amountableStart.value = AMOUNTABLE_PAYROLL_COMPONENT_START.NOT_SPECIFIED as number;
            }

            if(amountableEnd.value == null){
                amountableEnd.value = AMOUNTABLE_PAYROLL_COMPONENT_END.NOT_SPECIFIED as number;
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
    [PAY_PERIOD.HOURLY as number]: [PAY_FREQUENCY_TYPE.WEEKLY, PAY_FREQUENCY_TYPE.SEMI_MONTHLY, PAY_FREQUENCY_TYPE.MONTHLY],
    [PAY_PERIOD.DAILY as number]: [PAY_FREQUENCY_TYPE.WEEKLY, PAY_FREQUENCY_TYPE.SEMI_MONTHLY, PAY_FREQUENCY_TYPE.MONTHLY],
    [PAY_PERIOD.SEMI_MONTHLY as number]: [PAY_FREQUENCY_TYPE.SEMI_MONTHLY, PAY_FREQUENCY_TYPE.MONTHLY],
    [PAY_PERIOD.MONTHLY as number]: [PAY_FREQUENCY_TYPE.SEMI_MONTHLY, PAY_FREQUENCY_TYPE.MONTHLY]
};



const validatePayPeriodFrequencyCombination = (payPeriodValue: number, frequencyType: number): boolean => {
    const validFrequencies = PAY_PERIOD_VALID_FREQUENCIES[payPeriodValue];
    return validFrequencies ? validFrequencies.includes(frequencyType) : false;
};

const resetPayPeriodSelection = () => {
    payPeriodOptions.selected = null;
    selectedPayPeriod.value = null;
};

const showValidationError = (message: string) => {
    coreStore.setServiceError({
        prompt: true,
        payload: { message }
    });
};

const payPeriodSelectedChange = (value: null | number) => {
    const selectedPayPeriodItem:undefined | PayPeriodOptionT = payPeriodOptions.selection.find(item => item.value == value);

    if (!selectedPayPeriodItem) {
        return;
    }

    let selectedFrequencyType = props.payFrequency?.type_value as number;

    selectedPayPeriod.value = selectedPayPeriodItem as {value: number, type_value: number};

    if (payPeriodOptions.selected !== null && selectedFrequencyType !== null) {
        const isValidCombination = validatePayPeriodFrequencyCombination(selectedPayPeriodItem.value as number, selectedFrequencyType);

        if (!isValidCombination) {
            const periodName = PAY_PERIOD_NAME[selectedPayPeriodItem.value as number];

            let validFrequencies:number[] = PAY_PERIOD_VALID_FREQUENCIES[selectedPayPeriodItem.value as number] as number[];

            let joinedValidFrequencyNames = validFrequencies.map((freq: number) => {

                const frequencyName = PAY_FREQUENCY_NAME[freq] as string;

                return frequencyName.toLowerCase()
            }).join(', ');

            showValidationError(`${periodName} amount pay period is only allowed on (${joinedValidFrequencyNames}) payroll groups.`);
            resetPayPeriodSelection();
        }
    }
};

//Payroll Component Label
const payrollComponentSubject = computed<string>(() => {

    if(props.payrollComponentFormulable == undefined){return '';}

    return {
        [FORMULABLE.EARNINGS as number]: 'compensation',
        [FORMULABLE.DEDUCTIONS as number]: 'deduction',
        [FORMULABLE.INCOME_TAX as number]: 'income tax',
        null: ''
    }[props.payrollComponentFormulable] as string;
});

//Payroll Component Model Map Key
const formulableModelMapKey = computed<string>(() => {
    if(props.payrollComponentFormulable == undefined){return '';}

    return FORMULABLE_MODEL_MAP_KEY[props.payrollComponentFormulable as number] as string;
});

//Assignable Employee Payroll Component Selections
const assignablePayrollComponentOptionsKey = shallowRef(0);
const assignablePayrollComponentOptions = reactive<{
    search: string,
    selection: AssignablePayrollComponentOptionT[],
    selected: string|null|number
}>({
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

    formulableTabSelectable.value = !props.singleFormulableMode && !employeePayrollComponentExists.value;

    if(creatingOrEditing){

        if(!props.singleFormulableMode){
            formulableTypeTab.value = props.payrollComponentFormulable as number;
        }

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

const startDateChanged = (value: string) => {
    let dateValid = moment(value.trim(), "YYYY-MM-DD", true).isValid();

    if(!dateValid){
        startDate.value = moment().format("YYYY-MM-DD")
    }
}
const endDateChanged = (value: string) => {
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
const formulableTabSelectable = ref(false);

const loadEditable = () => {
    amount.value = _get(props.editPayload, 'amount', 0) as number;
    currency.value = _get(props.editPayload, 'currency', defaultCurrency.value);
    payPeriodOptions.selected = _get(props.editPayload, 'pay_period.value', null);
    payTypeOptions.selected = _get(props.editPayload, 'pay_type.value', PAY_TYPE.BY_ATTENDANCE as number);
    payFrequencyType.value = _get(props.editPayload, 'pay_frequency.type.value', null);
    assignablePayrollComponentOptions.selected = _get(props.editPayload, 'payroll_componentable_id', null);

    amountableStart.value = _get(props.editPayload, 'amountable_start.value', AMOUNTABLE_PAYROLL_COMPONENT_START.NOT_SPECIFIED) as number;

    let startDateTemp = _get(props.editPayload, 'start_date', null);
    startDate.value = startDateTemp ? moment(startDateTemp).format("YYYY-MM-DD") : null;

    amountableEnd.value = _get(props.editPayload, 'amountable_end.value', AMOUNTABLE_PAYROLL_COMPONENT_END.NOT_SPECIFIED) as number;

    let endDateTemp = _get(props.editPayload, 'end_date', null);
    endDate.value = endDateTemp ? moment(endDateTemp).format("YYYY-MM-DD") : null;
};

const closeModal = (cancelled = false) => {
    emit('update:creatingOrEditing', false);
    emit('update:payrollComponentFormulable', null);
    emit('update:editPayload', {});
    emit('update:editPayloadIndex', -1);

    if(cancelled){
        emit('cancelled');
    }
    reset();
};
const reset = () => {
    formulableTabSelectable.value = false;
    amount.value = 0;
    currency.value = defaultCurrency.value;
    assignablePayrollComponentOptions.selected = null;
    payPeriodOptions.selected = null;
    payTypeOptions.selected = null;
    payFrequencyType.value = null;
    selectedPayrollComponentIsAmountable.value = false;
    selectedPayrollComponent.value = null;
    selectedPayPeriod.value = null;
    amountableStart.value = null;
    amountableEnd.value = null;
    startDate.value = null;
    endDate.value = null;
}

const loadingOverlay = computed(()=>{
    return !formulableTabSelectable.value && assignablePayrollComponentPending.value;
});
const disableActions = computed(()=>{
    return submitPending.value  || loadingOverlay.value;
});
const employeeExists = computed(() => {
    return Boolean(props.employeePayload.id);
});
const employeePayrollComponentExists = computed(()=>{
    return Boolean(_get(props.editPayload, 'id', 0));
});
const submitButtonIcon = computed(()=>{
    const ICON = {
        CREATE: 'mdi:plus',
        EDIT: 'ic:sharp-save'
    } as const;

    const isEditMode = props.editPayloadIndex >= 0 || employeePayrollComponentExists.value;

    return isEditMode ? ICON.EDIT : ICON.CREATE;
});
const saveButtonLabel = computed(()=>{
    const LABEL = {
        CREATE: `Assign ${_startCase(payrollComponentSubject.value)}`,
        EDIT: `Save`
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
        return `/api/employee-payroll-component/${_get(props.editPayload, 'id', 0)}`;
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
                'pay_period': payPeriodOptions.selected as number,
                'pay_type': payTypeOptions.selected as number,
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
        account_id: number,
        company_id: number,
        payroll_componentable_id: number | null,
        payroll_componentable_type: string,
        employee_id?: number | null,
    }>{
        'account_id': selectedAssociatedCompanyAccountId.value,
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

    await laraFetch(submitPath.value as string, {
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