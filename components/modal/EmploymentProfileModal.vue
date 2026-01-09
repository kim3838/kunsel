<template>
    <DialogModal
        :max-width="'640px'"
        :show="creatingOrEditing"
        :closeable="false">
        <template #title>

        </template>
        <template #content>
            <div v-if="false">
                <span class="font-semibold">Employee Payload:</span> {{employeePayload}}<br>
                <span class="font-semibold">Edit Payload Index:</span> {{editPayloadIndex}}<br>
                <span class="font-semibold">Employment Profile Edit Payload:</span> {{editPayload}}<br>
                <span class="font-semibold">New Employee & New Employment Profile:</span> {{newEmployeeAndNewEmploymentProfile}}<br>
                <span class="font-semibold">Existing Employee & New Employment Profile:</span> {{employeeExistAndNewEmploymentProfile}}<br>
                <span class="font-semibold">Existing Employee & Existing Employment Profile:</span> {{employeeExistAndEmploymentProfileExist}}<br>
                <span class="font-semibold">Edit mode :</span> {{editPayloadIndex >= 0 || employmentProfileExists}}<br>

                <span class="font-semibold">Start Date :</span> {{startDate}}<br>
                <span class="font-semibold">End Date :</span> {{endDate}}<br>
                <span class="font-semibold">State of Employment :</span> {{stateEndOfEmployment}}<br>
                <span class="font-semibold">Form :</span> {{form}}<br>
            </div>
            <div ref='contentContainer'>
                <div v-if="loadingOverlay" :style="loadingOverlayDimensionStyle" class="absolute tint-background  z-50">
                    <div class="h-full flex items-center justify-center">
                        <UnorderedList :size="'lg'" :icon="'eos-icons:loading'">Please wait...</UnorderedList>
                    </div>
                </div>
                <div class="p-3 pt-4 mx-auto max-w-screen-lg grid gap-2 grid-cols-3">
                    <div class="col-span-2 sm:col-span-1">
                        <InputLabel :size="'sm'" value="Employment Status"/>
                        <RadioGroup
                            :selections="employmentStatusSelection"
                            :size="'md'"
                            :orientation="'horizontal'"
                            :radio-key="'employment-status'"
                            @change="employmentStatusSelectedChange"
                            v-model="employmentStatus" />
                    </div>
                    <div class="col-span-full grid gap-2 grid-cols-2 sm:grid-cols-3">
                        <div>
                            <InputLabel :size="'sm'" value="Employment Type"/>
                            <SingleSelect :searchable="false" drop-shadow value-persist :size="'md'" v-model="employmentType" :options="employmentTypeOptions"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Start Date"/>
                            <InputWithIcon
                                high-light-all-text-on-focus
                                @valueChanged="startDateChanged"
                                :override="{font_family_class: 'font-sans'}"
                                :icon="'mdi:calendar-cursor-outline'"
                                :id="`start-date`" v-model="startDate" :size="'md'" />
                        </div>
                    </div>
                    <div class="col-span-full flex flex-wrap gap-2">
                        <RadioGroup
                            :selections="stateEndOfEmploymentSelection"
                            :size="'md'"
                            :orientation="stateEndOfEmploymentRadioGroupOrientation"
                            :radio-key="'state-end-of-employment'"
                            @change="stateEndOfEmploymentSelectedChange"
                            v-model="stateEndOfEmployment" />
                    </div>
                    <div v-if="stateEndOfEmployment == 1" class="col-span-full grid gap-2 grid-cols-2 sm:grid-cols-3">
                        <div>
                            <InputLabel :size="'sm'" value="End of Service Type"/>
                            <SingleSelect :searchable="false" drop-shadow :size="'md'" v-model="endOfServiceType" :options="endOfServiceTypeOptions"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="End Date"/>
                            <InputWithIcon
                                high-light-all-text-on-focus
                                @valueChanged="endDateChanged"
                                :override="{font_family_class: 'font-sans'}"
                                :icon="'mdi:calendar-cursor-outline'"
                                :id="`end-date`" v-model="endDate" :size="'md'" />
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
import type {StringEnumInterface} from "@/public/js/common/type";

const {$authStore} = useNuxtApp();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const moment = useNuxtApp().$moment;
const {render} = dateTimePicker();
const {screenWidthBreakpoint, width: screenWidth} = useScreen();
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId,
} = storeToRefs($authStore);

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
});

const emit = defineEmits([
    'update:creatingOrEditing',
    'update:editPayload',
    'update:editPayloadIndex',
    'resolved',
    'cancelled',
]);

const {width: contentContainerWidth, height: contentContainerHeight} = useElementSize(useTemplateRef('contentContainer'));
const loadingOverlayDimensionStyle = computed(() => {
    return {
        width: `${contentContainerWidth.value}px`,
        height: `${contentContainerHeight.value}px`
    };
});

const employmentStatusSelection = reactive([
    $enumerableOption(EMPLOYMENT_STATUS_NAME, EMPLOYMENT_STATUS.ACTIVE as number),
    $enumerableOption(EMPLOYMENT_STATUS_NAME, EMPLOYMENT_STATUS.INACTIVE as number),
]);

const employmentTypeOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.OJT as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.INTERN as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.PROBATIONARY as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.FULL_TIME as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.PART_TIME as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.CONTRACT as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.NOT_SPECIFIED as number),
    ]
});

const stateEndOfEmploymentRadioGroupOrientation = computed(() => {
    return screenWidth.value >= screenWidthBreakpoint['md'] ? 'horizontal' : 'vertical';
})
const stateEndOfEmploymentSelection = reactive([
    {text : 'End of employment not specified', value: 0},
    {text : 'State end of employment', value: 1},
]);

const endOfServiceTypeOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(END_OF_SERVICE_TYPE_NAME, END_OF_SERVICE_TYPE.END_OF_CONTRACT as number),
        $enumerableOption(END_OF_SERVICE_TYPE_NAME, END_OF_SERVICE_TYPE.RESIGNED as number),
        $enumerableOption(END_OF_SERVICE_TYPE_NAME, END_OF_SERVICE_TYPE.TERMINATED as number),
        $enumerableOption(END_OF_SERVICE_TYPE_NAME, END_OF_SERVICE_TYPE.RETIRED as number),
        $enumerableOption(END_OF_SERVICE_TYPE_NAME, END_OF_SERVICE_TYPE.DEATH as number),
        $enumerableOption(END_OF_SERVICE_TYPE_NAME, END_OF_SERVICE_TYPE.MEDICAL_SEPARATION as number),
        $enumerableOption(END_OF_SERVICE_TYPE_NAME, END_OF_SERVICE_TYPE.DISABILITY as number),
        $enumerableOption(END_OF_SERVICE_TYPE_NAME, END_OF_SERVICE_TYPE.NOT_SPECIFIED as number),
    ]
});

const employmentStatusSelectedChange = () => {

}
const stateEndOfEmploymentSelectedChange = () => {

    if(stateEndOfEmployment.value == 1){
        endDate.value = moment().format("YYYY-MM-DD")
        render(dateStartAndEndDatePickers.value);
    }
}
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

const employmentStatus = ref<number | null>(EMPLOYMENT_STATUS.ACTIVE);
const employmentType = ref<number | null>(EMPLOYMENT_TYPE.NOT_SPECIFIED);
const startDate = ref<string | null>(moment().format("YYYY-MM-DD"));

const stateEndOfEmployment = ref(0);
const endOfServiceType = ref<number | null>(null);
const endDate = ref<string | null>(null);

const loadEditable = () => {
    employmentStatus.value = _get(props.editPayload, 'status.value', EMPLOYMENT_STATUS.ACTIVE);
    employmentType.value = _get(props.editPayload, 'employment_type.value', null);

    startDate.value = _get(props.editPayload, 'start_date', moment().format("YYYY-MM-DD"));

    endOfServiceType.value = _get(props.editPayload, 'end_of_service_type.value', null);

    if(endOfServiceType.value !== null){
        stateEndOfEmployment.value = 1;

        let endDateTemp = _get(props.editPayload, 'end_date', null);
        endDate.value = endDateTemp ? moment(endDateTemp).format("YYYY-MM-DD") : null;
    }

    render(dateStartAndEndDatePickers.value);
};

const closeModal = (cancelled = false) => {
    emit('update:creatingOrEditing', false);
    emit('update:editPayload', {});
    emit('update:editPayloadIndex', -1);

    if(cancelled){
        emit('cancelled');
    }
    reset();
};

const reset = () => {
    employmentStatus.value = EMPLOYMENT_STATUS.ACTIVE;
    employmentType.value = EMPLOYMENT_TYPE.NOT_SPECIFIED;
    startDate.value = moment().format("YYYY-MM-DD");
    stateEndOfEmployment.value = 0;
    endOfServiceType.value = null;
    endDate.value = null;
}

const loadingOverlay = computed(()=>{
    return employmentProfilePending.value;
});
const disableActions = computed(()=>{
    return submitPending.value  || loadingOverlay.value;
});
const employeeExists = computed(() => {
    return Boolean(props.employeePayload.id);
});
const employmentProfileExists = computed(()=>{
    return Boolean(props.editPayload.id);
});
const submitButtonIcon = computed(()=>{
    const ICON = {
        CREATE: 'mdi:plus',
        EDIT: 'ic:sharp-save'
    } as const;

    const isEditMode = props.editPayloadIndex >= 0 || employmentProfileExists.value;

    return isEditMode ? ICON.EDIT : ICON.CREATE;
});
const saveButtonLabel = computed(()=>{
    const LABEL = {
        CREATE: `Create`,
        EDIT: `Save`
    } as const;

    const isEditMode = props.editPayloadIndex >= 0 || employmentProfileExists.value;

    return isEditMode ? LABEL.EDIT : LABEL.CREATE;
});
const newEmployeeAndNewEmploymentProfile = computed(() => {
    return !employeeExists.value && !employmentProfileExists.value;
});
const employeeExistAndNewEmploymentProfile = computed(() => {
    return employeeExists.value && !employmentProfileExists.value;
});
const employeeExistAndEmploymentProfileExist = computed(() => {
    return employeeExists.value && employmentProfileExists.value;
});
const submitPath = computed(() => {
    if(employeeExistAndEmploymentProfileExist.value){
        return `/api/employment-profile/${props.editPayload.id}`;
    }

    if(employeeExistAndNewEmploymentProfile.value){
        return `/api/employment-profile`;
    }

    if(newEmployeeAndNewEmploymentProfile.value){
        return `/api/employment-profile-validate`;
    }
});
const submitAction = computed(() => {
    if(employeeExistAndEmploymentProfileExist.value){
        return `PATCH`;
    }

    if(employeeExistAndNewEmploymentProfile.value || newEmployeeAndNewEmploymentProfile.value){
        return `POST`;
    }
});

const employmentProfilePending = ref(false);
const submitPending = ref(false);

const form = computed(() => {
    let formTemp = <{
        employee_id?: number | null,
    }>{
        'status': employmentStatus.value,
        'employment_type': employmentType.value,
        'start_date': startDate.value,
        'account_id': selectedAssociatedCompanyAccountId.value,
        'company_id': selectedAssociatedCompanyId.value,
    };

    if(stateEndOfEmployment.value == 1){
        formTemp = {
            ...formTemp,
            'end_of_service_type': endOfServiceType.value,
            'end_date': endDate.value,
        }
    }

    if(employeeExists.value){
        formTemp = {
            ...formTemp,
            employee_id: props.employeePayload.id
        }
    }

    return formTemp;
});
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
            const resolved:null | {} = employeeExists.value ? null : _get(response, '_data.values.employment_profile', {});

            emit('resolved', resolved, props.editPayloadIndex);

            closeModal();
        },
    });
}

const dateStartAndEndDatePickers = ref([
    {
        id: `start-date`,
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            startDate.value = payload.value;
        }
    },
    {
        id: `end-date`,
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            endDate.value = payload.value;
        }
    },
]);

watch(()=>props.creatingOrEditing, (creatingOrEditing)=>{
    if(creatingOrEditing){
        loadEditable();
    }
});

</script>

<style scoped>

</style>