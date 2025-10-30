<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <div class="space-y-2 p-[20px]">
                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div class="col-span-3">
                            <InputWithIcon v-show="!disableInputFile" ref="fileToImport" :size="'md'" class="mt-2" :icon="'ic:baseline-file-open'" type="file" />
                            <div v-if="$coreStore.hasNonPromptableServicePayloadMessage" class="block">
                                <Label invert :size="'sm'" :type="'danger'" :label="$coreStore.servicePayloadMessage" />
                            </div>
                        </div>
                    </div>

                    <div class="space-x-1">
                        <NuxtLink :to="`${baseURL}/api/employment-profile-import-template`">
                            <Button class="inline-block" :icon="'tdesign:download'" :variant="'outline'" :size="'sm'" :disabled="disableActions" :label="'CSV Template'"/>
                        </NuxtLink>
                        <Button class="inline-block" :icon="readIcon" :size="'sm'" :disabled="disableActions" v-if="showRead" :label="readLabel"  @click="read"/>
                        <Button class="inline-block" :icon="uploadNewFileIcon" :size="'sm'" :variant="'outline'" :disabled="disableActions" v-if="showUploadNewFile" :label="uploadNewFileLabel"  @click="reset"/>
                        <Button class="inline-block" :icon="reValidateIcon" :size="'sm'" :disabled="disableActions" v-if="showReValidate" :label="reValidateLabel"  @click="reValidate"/>
                        <Button class="inline-block" :icon="saveIcon" :size="'sm'" :disabled="disableActions"  v-if="showSave" :label="saveLabel"  @click="save"/>
                    </div>

                    <div class="flex items-center min-h-8">
                        <UnorderedList
                            v-if="disableActions"
                            :icon="'eos-icons:loading'"
                            :size="'md'"
                            :label="'Please wait...'"/>
                    </div>

                    <DialogModal
                        :max-width="'380px'"
                        :show="resolvedModal"
                        :closeable="false">
                        <template #title>
                            {{resolvedModalTitle}}
                        </template>
                        <template #content>

                            <div class="mt-4 space-y-2">

                                <fieldset class="neutral-border px-2 pb-2 space-y-2">
                                    <legend class="font-header">Result</legend>

                                    <p>{{resolvedModalMessage}}</p>
                                </fieldset>
                            </div>
                        </template>
                        <template #footer>
                            <div class="flex space-x-2 justify-between">
                                <div></div>
                                <div class="space-x-2 inline-flex items-center">
                                    <Button @click="resetResolvedModal" :label="'Okay'" />
                                </div>
                            </div>
                        </template>
                    </DialogModal>

                    <div class="space-y-2">
                        <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                            <div class="scaffold-border px-2">
                                <span><span class="font-semibold font-sans">{{selectedPreImportDataId.length}}</span> Selected</span>
                            </div>
                            <div class="px-2">
                                <span><span class="font-semibold font-sans">{{preImportData.length}}</span> Total Row{{preImportData.length > 1 ? 's' : ''}}</span>
                            </div>
                            <div v-if="preImportData.length > 0">
                                <div v-if="preImportDataThatHasValidationError.length > 0">
                                    <Label invert :size="'md'" :type="'danger'" :label="`${preImportDataThatHasValidationError.length} Row${preImportDataThatHasValidationError.length > 1 ? 's' : ''} with validation error.`" />
                                </div>
                                <div v-else>
                                    <Label invert :size="'md'" :type="'success'" :label="'Validation successful.'" />
                                </div>
                            </div>
                        </div>

                        <DataTable
                            :sup-headers="preImportSupHeaders"
                            :sup-rows="preImportSupRows"
                            :headers="preImportHeaders"
                            :size="'lg'"
                            :rows="preImportData"
                            v-model="selectedPreImportDataId"
                            :disabled="disableActions"
                            :stripped="false"
                            :disableable-layer="false"
                            selection>
                            <template v-slot:sup.header.cell.end_date="{cell}">
                                <div class="p-[3px] whitespace-pre-line">
                                    {{cell.end_date}}
                                </div>
                            </template>
                            <template v-slot:cell.row="{cell, slot, scrollReference}">
                                <div class="p-[3px] font-sans">
                                    {{cell.row}}
                                </div>
                            </template>
                            <template v-slot:cell.actions="{cell, slot, scrollReference}">
                                <div class="text-base h-[32px]">
                                    <div class="h-full flex items-center px-2 cursor-pointer accent-hover" @click="editRow(cell)">
                                        <span class="text-base font-sans">Edit</span>
                                    </div>
                                </div>
                            </template>
                            <template v-slot:cell.validation_summary="{cell, slot, scrollReference}">
                                <div class="flex items-center justify-center">
                                    <Icon v-if="cell.validation_errors.length > 0" class="label-danger w-6 h-6" name="ic:baseline-warning"/>
                                </div>
                            </template>
                            <template v-slot:cell.employee_number="{cell, slot, scrollReference}">
                                <div v-if="!cell.isEditing" class="p-[3px] cursor-pointer" @click="editRow(cell)">
                                    {{cell.employee_number}}
                                </div>
                                <div v-else class="mx-0.5 flex items-center">
                                    <Input high-light-all-text-on-focus v-model="cell.employee_number" :size="slot.inputSize" />
                                </div>
                            </template>
                            <template v-slot:cell.employment_type="{cell, slot, scrollReference}">
                                <div v-if="!cell.isEditing" class="p-[3px] cursor-pointer" @click="editRow(cell)">
                                    {{cell.employment_type}}
                                </div>
                                <div v-else class="mx-0.5 flex items-center">
                                    <Input high-light-all-text-on-focus v-model="cell.employment_type" :size="slot.inputSize" />
                                </div>
                            </template>
                            <template v-slot:cell.start_date="{cell, slot, scrollReference}">
                                <div v-if="!cell.isEditing" class="p-[3px] cursor-pointer font-sans" @click="editRow(cell)">
                                    {{cell.start_date}}
                                </div>
                                <div v-else class="mx-0.5 flex items-center">
                                    <InputWithIcon
                                        readonly
                                        :icon="'mdi:calendar-cursor-outline'"
                                        v-model="cell.start_date"
                                        :override="{font_family_class: 'font-sans'}"
                                        :id="`${cell.id}-start-date`"
                                        :size="slot.inputSize" />
                                </div>
                            </template>
                            <template v-slot:cell.end_of_service_type="{cell, slot, scrollReference}">
                                <div v-if="!cell.isEditing" class="p-[3px] cursor-pointer" @click="editRow(cell)">
                                    {{cell.end_of_service_type}}
                                </div>
                                <div v-else class="mx-0.5 flex items-center">
                                    <Input high-light-all-text-on-focus v-model="cell.end_of_service_type" :size="slot.inputSize" />
                                </div>
                            </template>
                            <template v-slot:cell.end_date="{cell, slot, scrollReference}">
                                <div v-if="!cell.isEditing" class="p-[3px] cursor-pointer font-sans" @click="editRow(cell)">
                                    {{cell.end_date}}
                                </div>
                                <div v-else class="mx-0.5 flex items-center">
                                    <InputWithIcon
                                        readonly
                                        :icon="'mdi:calendar-cursor-outline'"
                                        v-model="cell.end_date"
                                        :override="{font_family_class: 'font-sans'}"
                                        :id="`${cell.id}-end-date`"
                                        :size="slot.inputSize" />
                                </div>
                            </template>
                            <template v-slot:cell.validation="{cell, slot, scrollReference}">
                                <div class="flex space-x-1 px-[0.3rem] items-center">
                                    <span v-if="cell.validation_errors.length > 0" v-for="validation_error in cell.validation_errors" class="label-danger">{{validation_error}}</span>
                                    <span v-else class="label-success">Validation successful.</span>
                                </div>
                            </template>
                        </DataTable>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DatePickerT, TableHeaderT, TableRowPayloadT, TableSupHeaderT, TableSupRowT} from "@/public/js/types/data";
import type {EmploymentProfilePreImportT, ImportRow} from "@/public/js/types/import";
import {storeToRefs} from "pinia";

definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {baseURL} = useRuntimeConfig().public;
const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const coreStore = useCoreStore();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

const pending = ref(false);
const fileToImport = ref<HTMLInputElement | null>(null);

const disableInputFile = computed(() => {
    return preImportData.value.length > 0;
})

const readIcon = computed(() => {
    return disableActions.value ? 'eos-icons:loading' : 'tdesign:scan';
});
const readLabel = computed(() => {
    return "Read file";
});
const showRead = computed(() => {
    return preImportData.value.length == 0;
});

const uploadNewFileIcon = computed(() => {
    return disableActions.value ? 'eos-icons:loading' : 'tdesign:upload';
});
const uploadNewFileLabel = computed(() => {
    return "Upload new";
});
const showUploadNewFile = computed(() => {
    return preImportData.value.length > 0;
});

const reValidateIcon = computed(() => {
    return disableActions.value ? 'eos-icons:loading' : 'tdesign:scan';
});
const reValidateLabel = computed(() => {
    return "Re-validate selected";
});
const showReValidate = computed(() => {

    let hasImportData = preImportData.value.length > 0;

    let hasAtLeastOneValidationErrors = preImportDataThatHasValidationError.value.length > 0;

    return hasImportData && hasAtLeastOneValidationErrors;
});

const saveIcon = computed(() => {
    return disableActions.value ? 'eos-icons:loading' : 'ic:sharp-save';
});
const saveLabel = computed(() => {
    return "Save all selected";
});
const showSave = computed(() => {
    return preImportData.value.length > 0;
});

const disableActions = computed(() => {
    return pending.value;
});

const preImportSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},
    {text: 'Required', colspan: 1, value: 'employee_number', alignHeader: 'left'},
    {text: 'Required', colspan: 1, value: 'employment_type', alignHeader: 'left', justifyData: 'top'},
    {text: 'Required', colspan: 1, value: 'start_date', width: '8rem', maxWidth: '8rem'},
    {text: 'Optional', colspan: 1, value: 'end_of_service_type', alignHeader: 'left', justifyData: 'top'},
    {text: 'Optional', colspan: 1, value: 'end_date', alignHeader: 'left', justifyData: 'top', width: '8rem', maxWidth: '8rem'},
    {text: ''},
]);

const preImportSupRows = reactive<TableSupRowT[]>([
    {
        'employment_type': "One of the following: \n" + Object.keys(EMPLOYMENT_TYPE).join("\n"),
        'end_of_service_type': "One of the following: \n" + Object.keys(END_OF_SERVICE_TYPE).join("\n"),
        'end_date': "Only required when end of service type is provided.",
    }
]);

const preImportHeaders = reactive<TableHeaderT[]>([
    { text: 'Row #', value: 'row', alignData: 'center'},
    { text: '', value: 'actions', minWidth: '2.5rem'},
    { text: 'Employee Number', value: 'employee_number', alignData: 'left'},
    { text: 'Employment Type', value: 'employment_type', alignData: 'left'},
    { text: 'Start Date', value: 'start_date', alignData: 'left'},
    { text: 'End of service Type', value: 'end_of_service_type', alignData: 'left'},
    { text: 'End Date', value: 'end_date', alignData: 'left'},
    { text: 'Validation Result', value: 'validation', alignData: 'left'}
]);

const preImportData = ref<EmploymentProfilePreImportT[]>([]);
const preImportDataThatHasValidationError = computed(() => {
    return preImportData.value.filter((item: EmploymentProfilePreImportT) => {
        return item.validation_errors.length > 0;
    });
})
const selectedPreImportDataId = ref<number[]>([]);
const selectedPreImportData = computed(() => {
    return preImportData.value.filter((item: EmploymentProfilePreImportT) => {
        return selectedPreImportDataId.value.includes(item.id);
    });
});
const selectedPreImportDataThatHasValidationError = computed(() => {
    return selectedPreImportData.value.filter((item: EmploymentProfilePreImportT) => {
        return item.validation_errors.length > 0;
    });
})

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        reset();
    }
})

const reset = async () => {
    preImportData.value = [];
    selectedPreImportDataId.value = [];
    fileToImport.value.$refs.input.value = '';
    clearDatePickers();
}

const transformValidated = (validated: EmploymentProfilePreImportT[]) => {

    return _map(validated, (item: EmploymentProfilePreImportT) => {

        return {
            ...item,
            _payload: <TableRowPayloadT>{
                label_shade: {
                    'cell': ['row', 'actions', 'validation_summary', 'validation'],
                    'value': useCosmetic().validationShade(item)
                }
            }
        };
    });
}

const read = async () => {

    let file = fileToImport?.value?.$refs.input.files[0];

    if (file) {
        pending.value = true;
        preImportData.value = [];
        selectedPreImportDataId.value = [];

        const formData = new FormData();
        formData.append('file', file);
        formData.append('company_id', selectedAssociatedCompanyId.value);

        await laraFetch("/api/employment-profile-import-validate", {
            method: 'POST',
            body: formData,
        },{
            onRequestError: (request, options, error) => {
                pending.value = false;

                coreStore.setServiceError({
                    prompt: false,
                    payload: {
                        message: 'Something went wrong: Try to re-attach the file if its edited.'
                    }
                });
            },
            onResponse: () => {
                pending.value = false;
            },
            onSuccessResponse: async (request, options, response) => {
                let validated = _get(response, '_data.values.validated', []);

                preImportData.value = validated;
            }
        }, false);


    } else {
        coreStore.setServiceError({
            prompt: false,
            payload: {
                message: 'File not found.'
            }
        });
    }
}

const reValidate = async () => {

    if(selectedPreImportDataId.value.length == 0){
        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `No record selected to re-validate.`,
            message: `Toggle checkboxes from rows to select them.`,
            action: {
                callback: () => {},
                label: 'Okay'
            }
        });
        return;
    }

    pending.value = true;

    await laraFetch("/api/employment-profile-import-re-validate", {
        method: 'POST',
        body: {
            company_id: selectedAssociatedCompanyId.value,
            re_validate: selectedPreImportData.value,
        },
    },{
        onRequestError: (request, options, error) => {
            pending.value = false;
        },
        onResponse: () => {
            pending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            pending.value = true;

            _get(response, '_data.values.validated', []).forEach((validated: EmploymentProfilePreImportT) => {

                let row:(EmploymentProfilePreImportT | undefined) = _find(preImportData.value, {id: validated.id});

                if(row){row.validation_errors = validated.validation_errors;}
            });

            preImportData.value = preImportData.value;

            pending.value = false;
        }
    });
}

const resolvedModal = ref(false);
const resolvedModalTitle = ref('Save successful');
const resolvedModalMessage = ref('');
const resetResolvedModal = () => {
    resolvedModal.value = false;
    resolvedModalMessage.value = '';
}

const editRow = (cell: EmploymentProfilePreImportT) => {
    cell.isEditing = true;
};
const save = async () => {

    if(selectedPreImportDataId.value.length == 0){
        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `No record selected to save.`,
            message: `Toggle checkboxes from rows to select them.`,
            action: {
                callback: () => {},
                label: 'Okay'
            }
        });
        return;
    }

    if(selectedPreImportDataThatHasValidationError.value.length > 0){
        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Fix validation errors.`,
            message: `If selected rows have validation error(s), Re-validate them first.`,
            action: {
                callback: () => {},
                label: 'Okay'
            }
        });
        return;
    }

    pending.value = true;

    await laraFetch("/api/employment-profile-import-save", {
        method: 'POST',
        body: {
            company_id: selectedAssociatedCompanyId.value,
            save: selectedPreImportData.value,
        },
    },{
        onRequestError: (request, options, error) => {
            pending.value = false;
        },
        onResponse: () => {
            pending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            pending.value = true;

            _get(response, '_data.values.validated', []).forEach((validated: EmploymentProfilePreImportT) => {

                let row:(EmploymentProfilePreImportT | undefined) = _find(preImportData.value, {id: validated.id});

                if(row){row.validation_errors = validated.validation_errors;}
            });

            preImportData.value = preImportData.value;

            if(selectedPreImportDataThatHasValidationError.value.length > 0){
                useNuxtApp().$promptStore.setPrompt({
                    resetable: false,
                    icon: null,
                    title: `Fix validation errors.`,
                    message: `If selected rows have validation error(s), Re-validate them first.`,
                    action: {
                        callback: () => {},
                        label: 'Okay'
                    }
                });
            }

            let saved = _get(response, '_data.values.saved', []);

            if(!_isEmpty(saved)){

                preImportData.value = _filter(preImportData.value, (item: EmploymentProfilePreImportT) => {
                    return !_includes(saved, item.id);
                });

                selectedPreImportDataId.value = [];
                resolvedModalMessage.value = `${saved.length} record(s) saved.`;
                resolvedModal.value = true;

                if(_isEmpty(preImportData.value)){
                    await reset();
                }
            }

            pending.value = false;
        }
    });
};

const {render: renderDatePickers, clearScaffold: clearDatePickers} = dateTimePicker();

const datePickersComputed = computed<DatePickerT[]>(() => {

    let datePickers: DatePickerT[] = [];
    let editRows: ImportRow[] = _filter(preImportData.value, (employmentProfile: ImportRow) => {
        return employmentProfile.isEditing;
    });

    let startDates: DatePickerT[] =  _map(editRows, (employmentProfile: EmploymentProfilePreImportT) => {

        return {
            id: `${employmentProfile.id}-start-date`,
            type: 'date',
            selectedCallback: (payload: {value: string}) => {
                employmentProfile.start_date = payload.value;
            }
        };
    });

    datePickers = datePickers.concat(startDates);

    let endDates: DatePickerT[] =  _map(editRows, (employmentProfile: EmploymentProfilePreImportT) => {

        return {
            id: `${employmentProfile.id}-end-date`,
            type: 'date',
            selectedCallback: (payload: {value: string}) => {
                employmentProfile.end_date = payload.value;
            }
        };
    });

    datePickers = datePickers.concat(endDates);

    return datePickers;
})

watch(datePickersComputed, (newValue) => {
    renderDatePickers(datePickersComputed.value);
})
</script>

<style scoped>

</style>