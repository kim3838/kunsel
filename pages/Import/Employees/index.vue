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
                        <NuxtLink :to="`${baseURL}/api/employee-import-template`">
                            <Button class="inline-block" :icon="'tdesign:download'" :variant="'outline'" :size="'sm'" :disabled="disableActions" :label="'CSV Template'"/>
                        </NuxtLink>
                        <Button class="inline-block" :icon="'tdesign:scan'" :size="'sm'" :disabled="disableActions" v-if="showRead" :label="readLabel"  @click="read"/>
                        <Button class="inline-block" :icon="'tdesign:upload'" :size="'sm'" :variant="'outline'" :disabled="disableActions" v-if="showUploadNewFile" :label="uploadNewFileLabel"  @click="reset"/>
                        <Button class="inline-block" :icon="'tdesign:scan'" :size="'sm'" :disabled="disableActions" v-if="showReValidate" :label="reValidateLabel"  @click="reValidate"/>
                        <Button class="inline-block" :icon="'tdesign:save-filled'" :size="'sm'" :disabled="disableActions"  v-if="showSave" :label="saveLabel"  @click="save"/>
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

                    <div v-if="false" class="text-xs font-mono">
                        <span class="font-semibold">preImportData: </span>{{preImportData}}<br>
                        <span class="font-semibold">selectedPreImportDataId: </span>{{selectedPreImportDataId}}<br>
                        <span class="font-semibold">selectedPreImportData: </span>{{selectedPreImportData}}<br>
                        <span class="font-semibold">selectedPreImportDataThatHasValidationError: </span>{{selectedPreImportDataThatHasValidationError}}<br>
                    </div>

                    <div class="space-y-2">
                        <div v-if="preImportData.length > 0" class="flex space-x-2">
                            <span><span class="font-semibold">{{preImportData.length}}</span> total rows.</span>
                            <span><span class="font-semibold">{{selectedPreImportDataId.length}}</span> total selected.</span>
                        </div>
                        <div v-if="preImportData.length > 0">
                            <div v-if="preImportDataThatHasValidationError.length > 0">
                                <Label invert :size="'md'" :type="'danger'" :label="`${preImportDataThatHasValidationError.length} row(s) with validation error(s).`" />
                            </div>
                            <div v-else>
                                <Label invert :size="'md'" :type="'success'" :label="'Validation successful.'" />
                            </div>
                        </div>
                        <DataTable
                            v-if="preImportData.length > 0"
                            :headers="preImportHeaders"
                            :size="'lg'"
                            :rows="preImportData"
                            v-model="selectedPreImportDataId"
                            :disabled="disableActions"
                            selection>
                            <template v-slot:cell.row="{cell, slot, scrollReference}">
                                <div class="p-[3px] font-[Funnel_Sans]">
                                    {{cell.row}}
                                </div>
                            </template>
                            <template v-slot:cell.actions="{cell, slot, scrollReference}">
                                <div class="flex items-center">
                                    <NavDrop
                                        class="z-10"
                                        :disabled="disableActions"
                                        :parent-icon="'ic:baseline-arrow-left'"
                                        in-horizontal-scrollable
                                        :size="`sm`"
                                        :drop-shadow-size="`lg`"
                                        :title="'Menu'"
                                        :drop-align="'top'"
                                        :drop-justify="'left'"
                                        :drop-options="[
                                            {type: 'action',icon: 'mdi:pen',title: 'Edit',callback: () => editRow(cell),},
                                        ]">
                                    </NavDrop>
                                </div>
                            </template>
                            <template v-slot:cell.validation_summary="{cell, slot, scrollReference}">
                                <div class="flex items-center justify-center">
                                    <Icon v-if="cell.validation_errors.length > 0" class="label-danger w-6 h-6" name="ic:baseline-warning"/>
                                </div>
                            </template>
                            <template v-slot:cell.number="{cell, slot, scrollReference}">
                                <div v-if="!cell.isEditing" class="p-[3px] cursor-pointer" @click="editRow(cell)">
                                    {{cell.number}}
                                </div>
                                <div v-else class="mx-0.5 flex items-center">
                                    <Input v-model="cell.number" :size="slot.inputSize" />
                                </div>
                            </template>
                            <template v-slot:cell.family_name="{cell, slot, scrollReference}">
                                <div v-if="!cell.isEditing" class="p-[3px] cursor-pointer" @click="editRow(cell)">
                                    {{cell.family_name}}
                                </div>
                                <div v-else class="mx-0.5 flex items-center">
                                    <Input v-model="cell.family_name" :size="slot.inputSize" />
                                </div>
                            </template>
                            <template v-slot:cell.given_name="{cell, slot, scrollReference}">
                                <div v-if="!cell.isEditing" class="p-[3px] cursor-pointer" @click="editRow(cell)">
                                    {{cell.given_name}}
                                </div>
                                <div v-else class="mx-0.5 flex items-center">
                                    <Input v-model="cell.given_name" :size="slot.inputSize" />
                                </div>
                            </template>
                            <template v-slot:cell.validation="{cell, slot, scrollReference}">
                                <div class="flex space-x-1 px-[0.3rem] items-center">
                                    <Label v-if="cell.validation_errors.length > 0" v-for="validation_error in cell.validation_errors" :size="slot.labelSize" :type="'danger'" shade :label="validation_error" />
                                    <Label v-else :size="slot.labelSize" :type="'success'" shade :label="'Validation successful.'" />
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
import type {TableHeaderT, TableRowPayloadT, TableRowT} from "@/public/js/types/data";
import type {EmployeePreImportT} from "@/public/js/types/import";
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

const readLabel = computed(() => {
    return "Read file";
});
const showRead = computed(() => {
    return preImportData.value.length == 0;
});

const uploadNewFileLabel = computed(() => {
    return "Upload new";
});
const showUploadNewFile = computed(() => {
    return preImportData.value.length > 0;
});

const reValidateLabel = computed(() => {
    return "Re-validate selected";
});
const showReValidate = computed(() => {

    let hasImportData = preImportData.value.length > 0;

    let hasAtLeastOneValidationErrors = preImportDataThatHasValidationError.value.length > 0;

    return hasImportData && hasAtLeastOneValidationErrors;
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

const preImportHeaders = reactive<TableHeaderT[]>([
    { text: 'Row #', value: 'row', alignData: 'center'},
    { text: '', value: 'actions'},
    { text: '', value: 'validation_summary', alignData: 'center', width: '2rem', minWidth: '2rem'},
    { text: 'Number', value: 'number', alignData: 'left'},
    { text: 'Family name', value: 'family_name', alignData: 'left'},
    { text: 'Given name', value: 'given_name', alignData: 'left'},
    { text: 'Validation Result', value: 'validation', alignData: 'left'}
]);

const preImportData = ref<EmployeePreImportT[]>([]);
const preImportDataThatHasValidationError = computed(() => {
    return preImportData.value.filter((item: EmployeePreImportT) => {
        return item.validation_errors.length > 0;
    });
})
const selectedPreImportDataId = ref<number[]>([]);
const selectedPreImportData = computed(() => {
    return preImportData.value.filter((item: EmployeePreImportT) => {
        return selectedPreImportDataId.value.includes(item.id);
    });
});
const selectedPreImportDataThatHasValidationError = computed(() => {
    return selectedPreImportData.value.filter((item: EmployeePreImportT) => {
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
}

const transformValidated = (validated: EmployeePreImportT[]) => {

    return _map(validated, (item: EmployeePreImportT) => {

        let payload: TableRowPayloadT = {};

        if(item.validation_errors.length > 0){
            payload['label_shade'] = {
                'cell': ['row', 'actions', 'validation_summary', 'validation'],
                'value': 'danger'
            }
        } else {
            payload['label_shade'] = {
                'cell': ['row', 'actions', 'validation_summary', 'validation'],
                'value': 'success'
            }
        }

        return {
            ...item,
            _payload: payload
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

        await laraFetch("/api/employee-import-validate", {
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

                preImportData.value = transformValidated(validated);
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
        coreStore.setServiceError({
            prompt: true,
            payload: {
                message: 'No record selected to re-validate.'
            }
        });
        return;
    }

    pending.value = true;

    await laraFetch("/api/employee-import-re-validate", {
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

            _get(response, '_data.values.validated', []).forEach((validated: EmployeePreImportT) => {

                let row:(EmployeePreImportT | undefined) = _find(preImportData.value, {id: validated.id});

                if(row){row.validation_errors = validated.validation_errors;}
            });

            preImportData.value = transformValidated(preImportData.value);

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

const editRow = (cell: TableRowT) => {
    cell.isEditing = true;
};
const save = async () => {

    if(selectedPreImportDataId.value.length == 0){
        coreStore.setServiceError({
            prompt: true,
            payload: {
                message: 'No record selected to save.'
            }
        });
        return;
    }

    if(selectedPreImportDataThatHasValidationError.value.length > 0){
        coreStore.setServiceError({
            prompt: true,
            payload: {
                message: "Fix validation errors. if selected has validation error(s), Re-validate them first."
            }
        });
        return;
    }

    pending.value = true;

    await laraFetch("/api/employee-import-save", {
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

            _get(response, '_data.values.validated', []).forEach((validated: EmployeePreImportT) => {

                let row:(EmployeePreImportT | undefined) = _find(preImportData.value, {id: validated.id});

                if(row){row.validation_errors = validated.validation_errors;}
            });

            preImportData.value = transformValidated(preImportData.value);

            if(selectedPreImportDataThatHasValidationError.value.length > 0){
                coreStore.setServiceError({
                    prompt: true,
                    payload: {
                        message: "Fix validation errors. if selected has validation error(s), Re-validate them first."
                    }
                });
            }

            let saved = _get(response, '_data.values.saved', []);

            if(!_isEmpty(saved)){

                preImportData.value = _filter(preImportData.value, (item: EmployeePreImportT) => {
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
</script>

<style scoped>

</style>