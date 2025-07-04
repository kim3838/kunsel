<template>
    <DialogModal
        :show="creatingOrEditing"
        :closeable="false"
        :landscape="true"
        :content-padding="'0'">
        <template #title>

        </template>
        <template #content>
            <div v-if="true">
                <span class="font-semibold">Employee Payload:</span> {{employeePayload}}<br>
                <span class="font-semibold">Edit Payload Index:</span> {{editPayloadIndex}}<br>
                <span class="font-semibold">Payroll Component Edit Payload:</span> {{editPayload}}<br>
                <span class="font-semibold">New Employee & New Payroll Component:</span> {{newEmployeeAndNewPayrollComponent}}<br>
                <span class="font-semibold">Existing Employee & New Payroll Component:</span> {{employeeExistAndNewPayrollComponent}}<br>
                <span class="font-semibold">Existing Employee & Existing Payroll Component:</span> {{employeeExistAndPayrollComponentExist}}<br>
                <span class="font-semibold">Edit mode :</span> {{editPayloadIndex >= 0 || employeePayrollComponentExists}}<br>
                <span class="font-semibold">Selected Payroll Component :</span> {{selectedPayrollComponent}}<br>
                <span class="font-semibold">Component Formulable :</span> {{payrollComponentFormulable}}<br>
                <span class="font-semibold">Component Form :</span> {{componentForm}}<br>
            </div>
            <div ref='contentContainer'>
                <div v-if="loadingOverlay" :style="loadingOverlayDimensionStyle" class="absolute tint-background  z-50">
                    <div class="h-full flex items-center justify-center">
                        <UnorderedList :size="'lg'" :icon="'eos-icons:loading'">Please wait...</UnorderedList>
                    </div>
                </div>
                <div class="p-3 pt-4 pb-40 mx-auto max-w-screen-lg grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-6">
                    <div class="col-span-2">
                        <InputLabel :size="'md'" value="Select"/>
                        <SingleSelect :searchable="false" drop-shadow value-persist :size="'md'" :options="assignablePayrollComponentOptions" @valueChange="assignablePayrollComponentSelectedChange"/>
                    </div>
                    <div v-if="selectedPayrollComponentIsAmountable">
                        <InputLabel :size="'md'" value="Amount"/>
                        <Input v-model="amount" high-light-all-text-on-focus :size="'md'" :min="0" :type="'number'" type-strict />
                    </div>
                    <div v-if="selectedPayrollComponentIsAmountable">
                        <InputLabel :size="'md'" value="Pay Period"/>
                        <SingleSelect :searchable="false" :selection-max-viewable-line="4" drop-shadow value-persist :size="'md'" :options="payPeriodOptions"/>
                    </div>
                    <div v-if="selectedPayrollComponentIsAmountable">
                        <InputLabel :size="'md'" value="Pay Type"/>
                        <SingleSelect :searchable="false" :selection-max-viewable-line="4" drop-shadow value-persist :size="'md'" :options="payTypeOptions"/>
                    </div>
                    <div v-if="selectedPayrollComponentIsAmountable">
                        <InputLabel :size="'md'" value="Pay Frequency"/>
                        <SingleSelect :searchable="false" :selection-max-viewable-line="4" drop-shadow value-persist :size="'md'" :options="payFrequencyOptions"/>
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
                                v-if="disableActions"
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
                            :disabled="disableActions || loadingOverlay"
                            :icon="'mdi:cancel'"
                            :label="'Cancel'"
                            @click="closeModal"/>
                        <Button
                            class="w-min"
                            :variant="'default'"
                            :size="'md'"
                            :icon="submitButtonIcon"
                            :disabled="disableActions || loadingOverlay"
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
const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();

const {
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

const {width: contentContainerWidth, height: contentContainerHeight} = useElementSize(useTemplateRef('contentContainer'));
const loadingOverlayDimensionStyle = computed(() => {
    return {
        width: `${contentContainerWidth.value}px`,
        height: `${contentContainerHeight.value}px`
    };
});

const payPeriodSelection = toRef(props, 'payPeriodSelection');
const payTypeSelection = toRef(props, 'payTypeSelection');
const payFrequencySelection = toRef(props, 'payFrequencySelection');

const emit = defineEmits(['update:creatingOrEditing', 'update:payrollComponentFormulable', 'update:editPayload', 'update:editPayloadIndex', 'resolved']);

const payPeriodOptions = reactive({search: '', data: payPeriodSelection, selection: payPeriodSelection, selected: null});
const payTypeOptions = reactive({search: '', data: payTypeSelection, selection: payTypeSelection, selected: null});
const payFrequencyOptions = reactive({search: '', data: payFrequencySelection, selection: payFrequencySelection, selected: null});

const selectedPayrollComponentIsAmountable = ref(false);
const selectedPayrollComponent = ref({});
const assignablePayrollComponentSelectedChange = (value: null | number) => {
    const selectedPayrollComponentTemp = assignablePayrollComponentOptions.selection.find(item => item.value === value);

    if (!selectedPayrollComponentTemp) {
        return;
    }

    selectedPayrollComponent.value = selectedPayrollComponentTemp;

    if(props.payrollComponentFormulable == FORMULABLE.EARNINGS){

        selectedPayrollComponentIsAmountable.value = _includes([
            COMPENSATIONS.SALARY,
            COMPENSATIONS.REGULAR_ALLOWANCE
        ], selectedPayrollComponentTemp.type.value);

        if(!selectedPayrollComponentIsAmountable.value){
            amount.value = 0;
            payPeriodOptions.selected = null;
            payTypeOptions.selected = null;
            payFrequencyOptions.selected = null;
        }
    }
}

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
    data: [],
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
                'company_id': selectedAssociatedCompany.value,
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
            const selection = _get(response, '_data.values.selection', []);
            assignablePayrollComponentOptions.data = selection
            assignablePayrollComponentOptions.selection = selection;

            loadEditable();
        }
    });
}

watch(() => props.creatingOrEditing, (creatingOrEditing) => {
    if(creatingOrEditing){
        assignablePayrollComponentExecute();
    }
});

const loadEditable = () => {
    amount.value = _get(props.editPayload, 'amount', 0);
    payPeriodOptions.selected = _get(props.editPayload, 'pay_period.value', null);
    payTypeOptions.selected = _get(props.editPayload, 'pay_type.value', null);
    payFrequencyOptions.selected = _get(props.editPayload, 'pay_frequency.value', null);
    assignablePayrollComponentOptions.selected = _get(props.editPayload, 'payroll_componentable_id', null);
};

const amount = ref(0);

const closeModal = () => {
    emit('update:creatingOrEditing', false);
    emit('update:payrollComponentFormulable', null);
    emit('update:editPayload', {});
    emit('update:editPayloadIndex', -1);
    reset();
};
const reset = () => {
    amount.value = 0;
    assignablePayrollComponentOptions.selected = null;
    payPeriodOptions.selected = null;
    payTypeOptions.selected = null;
    payFrequencyOptions.selected = null;
    selectedPayrollComponentIsAmountable.value = false;
    selectedPayrollComponent.value = false;
}

const loadingOverlay = computed(()=>{
    return assignablePayrollComponentPending.value;
});
const disableActions = computed(()=>{
    return submitPending.value;
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

    let componentFormTemp = {};

    if(props.payrollComponentFormulable == FORMULABLE.EARNINGS){

        if (selectedPayrollComponentType == COMPENSATIONS.SALARY) {
            return {
                ...componentFormTemp,
                'amount': amount.value,
                'pay_period': payPeriodOptions.selected,
                'pay_type': payTypeOptions.selected,
                'pay_frequency': payFrequencyOptions.selected,
            };
        }

        if (selectedPayrollComponentType == COMPENSATIONS.REGULAR_ALLOWANCE) {
            return {
                ...componentFormTemp,
                'amount': amount.value,
                'pay_period': payPeriodOptions.selected,
                'pay_type': payTypeOptions.selected,
                'pay_frequency': payFrequencyOptions.selected,
            };
        }
    }

    return componentFormTemp;
});
const form = computed(() => {
    let formTemp = {
        'company_id': selectedAssociatedCompany.value,
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

</script>

<style scoped>

</style>