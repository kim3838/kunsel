<template>
    <DialogModal
        :max-width="'640px'"
        :show="creatingOrEditing"
        :closeable="false">
        <template #title>
            {{employeeIdentificationExists ? 'Identification' : 'Create Identification'}}
        </template>
        <template #content>
            <div v-if="false">
                <span class="font-semibold">Employee Payload:</span> {{employeePayload}}<br>
                <span class="font-semibold">Edit Payload Index:</span> {{editPayloadIndex}}<br>
                <span class="font-semibold">Employee Identification Edit Payload:</span> {{editPayload}}<br>
                <span class="font-semibold">New Employee & New Employee Identification:</span> {{newEmployeeAndNewEmployeeIdentification}}<br>
                <span class="font-semibold">Existing Employee & New Employee Identification:</span> {{employeeExistAndNewEmployeeIdentification}}<br>
                <span class="font-semibold">Existing Employee & Existing Employee Identification:</span> {{employeeExistAndEmployeeIdentificationExist}}<br>
                <span class="font-semibold">Edit mode :</span> {{editPayloadIndex >= 0 || employeeIdentificationExists}}<br>

                <span class="font-semibold">Type Selection :</span> {{identificationTypeOptions.selection}}<br>
                <span class="font-semibold">Type Selected:</span> {{identificationTypeOptions.selected}}<br>
                <span class="font-semibold">Number :</span> {{identificationNumber}}<br>
                <span class="font-semibold">Readable number :</span> {{identificationReadableNumber}}<br>
                <span class="font-semibold">Form :</span> {{form}}<br>
            </div>
            <div ref='contentContainer' class="space-y-2">
                <div v-if="loadingOverlay" :style="loadingOverlayDimensionStyle" class="absolute tint-background  z-50">
                    <div class="h-full flex items-center justify-center">
                        <UnorderedList :size="'lg'" :icon="'eos-icons:loading'">Please wait...</UnorderedList>
                    </div>
                </div>
                <div class="pt-4 grid gap-2 grid-cols-1 sm:grid-cols-4">
                    <div class="col-span-1 sm:col-span-2">
                        <InputLabel :size="'sm'" value="Type"/>
                        <SingleSelect
                            :key="identificationTypeOptionsKey"
                            :searchable="false"
                            value-persist
                            drop-shadow
                            :selection-max-viewable-line="10"
                            :size="'md'"
                            :label="'Select identification type'"
                            :options="identificationTypeOptions"/>
                    </div>
                </div>
                <div class="grid gap-2 grid-cols-1 sm:grid-cols-2">
                    <div>
                        <InputLabel :size="'sm'" value="Number"/>
                        <Input v-model="identificationNumber" :size="'md'" />
                    </div>
                    <div>
                        <InputLabel :size="'sm'" value="Readable number (optional)"/>
                        <Input v-model="identificationReadableNumber" :size="'md'" />
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
import type {EnumOption, EnumSelection, StringEnumInterface} from "@/public/js/common/type";

const {$authStore} = useNuxtApp();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number|string) => {
    text: string,
    value: number|string
};
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId,
    selectedAssociatedCompany
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

const countryIdentificationSelections = (iso2: string) => {

    let options = [] as EnumOption[]

    if(iso2 == 'PH'){

        options = [
            $enumerableOption(PH_IDENTIFICATION_TYPE_NAME, PH_IDENTIFICATION_TYPE.PH_SSS as string),
            $enumerableOption(PH_IDENTIFICATION_TYPE_NAME, PH_IDENTIFICATION_TYPE.PH_PHILHEALTH as string),
            $enumerableOption(PH_IDENTIFICATION_TYPE_NAME, PH_IDENTIFICATION_TYPE.PH_PAG_IBIG as string),
            $enumerableOption(PH_IDENTIFICATION_TYPE_NAME, PH_IDENTIFICATION_TYPE.PH_TIN as string)
        ];
    }

    return options as EnumOption[]
}

const identificationTypeOptionsKey = shallowRef(0);
const identificationTypeOptions = reactive<{
    search: string,
    selection: EnumSelection,
    selected: string | number | null
}>({
    search: '',
    selection: [],
    selected: null
});

const identificationNumber = ref('');
const identificationReadableNumber = ref('');

const loadEditable = () => {

    let companyCountryIso2 = selectedAssociatedCompany.value?.payload?.country?.iso2;
    identificationTypeOptions.selection = countryIdentificationSelections(companyCountryIso2);

    identificationTypeOptionsKey.value++;

    identificationTypeOptions.selected = _get(props.editPayload, 'type.value', null);
    identificationNumber.value = _get(props.editPayload, 'number', '');
    identificationReadableNumber.value = _get(props.editPayload, 'readable_number', '');
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
    identificationTypeOptions.selected = null;
    identificationNumber.value = '';
    identificationReadableNumber.value = '';
}

const loadingOverlay = computed(()=>{
    return employeeIdentificationPending.value;
});
const disableActions = computed(()=>{
    return submitPending.value  || loadingOverlay.value;
});
const employeeExists = computed(() => {
    return Boolean(props.employeePayload.id);
});
const employeeIdentificationExists = computed(()=>{
    return Boolean(props.editPayload.id);
});
const submitButtonIcon = computed(()=>{
    const ICON = {
        CREATE: 'mdi:plus',
        EDIT: 'ic:sharp-save'
    } as const;

    const isEditMode = props.editPayloadIndex >= 0 || employeeIdentificationExists.value;

    return isEditMode ? ICON.EDIT : ICON.CREATE;
});
const saveButtonLabel = computed(()=>{
    const LABEL = {
        CREATE: `Create`,
        EDIT: `Save`
    } as const;

    const isEditMode = props.editPayloadIndex >= 0 || employeeIdentificationExists.value;

    return isEditMode ? LABEL.EDIT : LABEL.CREATE;
});
const newEmployeeAndNewEmployeeIdentification = computed(() => {
    return !employeeExists.value && !employeeIdentificationExists.value;
});
const employeeExistAndNewEmployeeIdentification = computed(() => {
    return employeeExists.value && !employeeIdentificationExists.value;
});
const employeeExistAndEmployeeIdentificationExist = computed(() => {
    return employeeExists.value && employeeIdentificationExists.value;
});
const submitPath = computed(() => {
    if(employeeExistAndEmployeeIdentificationExist.value){
        return `/api/employee-identification/${props.editPayload.id}`;
    }

    if(employeeExistAndNewEmployeeIdentification.value){
        return `/api/employee-identification`;
    }

    if(newEmployeeAndNewEmployeeIdentification.value){
        return `/api/employee-identification-validate`;
    }
});
const submitAction = computed(() => {
    if(employeeExistAndEmployeeIdentificationExist.value){
        return `PATCH`;
    }

    if(employeeExistAndNewEmployeeIdentification.value || newEmployeeAndNewEmployeeIdentification.value){
        return `POST`;
    }
});

const employeeIdentificationPending = ref(false);
const submitPending = ref(false);

const form = computed(() => {
    let formTemp = <{
        employee_id?: number | null,
    }>{
        'type': identificationTypeOptions.selected,
        'number': identificationNumber.value,
        'readable_number': identificationReadableNumber.value,
        'account_id': selectedAssociatedCompanyAccountId.value,
        'company_id': selectedAssociatedCompanyId.value,
    };

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
            const resolved:null | {} = employeeExists.value ? null : _get(response, '_data.values.employee_identification', {});

            emit('resolved', resolved, props.editPayloadIndex);

            closeModal();
        },
    });
}

watch(()=>props.creatingOrEditing, (creatingOrEditing)=>{
    if(creatingOrEditing){
        loadEditable();
    }
});

</script>

<style scoped>

</style>