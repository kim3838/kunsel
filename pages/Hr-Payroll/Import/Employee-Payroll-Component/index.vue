<template>
    <div>
        <DefaultWrapper>
            <div>
                <div ref="action" class="z-30 fixed action-container scaffold-border-bottom">

                    <div class="mx-auto max-w-screen-2xl space-y-2 p-[20px]">
                        <BreadCrumbs prefix-company :size="`sm`" />

                        <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                            <div class="col-span-3">
                                <InputWithIcon v-show="!disableInputFile" ref="fileToImport" :size="'md'" :icon="'ic:baseline-file-open'" type="file" />
                                <div v-if="$coreStore.hasNonPromptableServicePayloadMessage" class="block">
                                    <Label invert :size="'sm'" :type="'danger'" :label="$coreStore.servicePayloadMessage" />
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                            <NuxtLink class="inline-flex" :to="`${baseURL}/api/employee-payroll-component-import-template`">
                                <Button class="inline-block" :icon="'tdesign:download'" :variant="'outline'" :size="'sm'" :disabled="disableActions" :label="'CSV Template'"/>
                            </NuxtLink>
                            <Button class="inline-block" :icon="readIcon" :size="'sm'" :disabled="disableActions" v-if="showRead" :label="readLabel"  @click="read"/>
                            <Button class="inline-block" :icon="uploadNewFileIcon" :size="'sm'" :variant="'outline'" :disabled="disableActions" v-if="showUploadNewFile" :label="uploadNewFileLabel"  @click="reset"/>
                            <Button class="inline-block" :icon="reValidateIcon" :size="'sm'" :disabled="disableActions" v-if="showReValidate" :label="reValidateLabel"  @click="reValidate"/>
                            <Button class="inline-block" :icon="saveIcon" :size="'sm'" :disabled="disableActions"  v-if="showSave" :label="saveLabel"  @click="save"/>
                            <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                        </div>

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
                        </div>
                    </div>
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

                <div class="mx-auto max-w-screen-2xl">
                    <div class="px-[20px] allocate">
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
                            <template v-slot:sup.header.cell.amount="{cell}">
                                <div class="p-[3px] whitespace-pre-line">
                                    {{cell.amount}}
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
                                    <Input class="w-full" v-model="cell.employee_number" :size="slot.inputSize" />
                                </div>
                            </template>
                            <template v-slot:cell.payroll_component_code="{cell, slot, scrollReference}">
                                <div v-if="!cell.isEditing" class="p-[3px] cursor-pointer" @click="editRow(cell)">
                                    {{cell.payroll_component_code}}
                                </div>
                                <div v-else class="mx-0.5 flex items-center">
                                    <Input class="w-full" high-light-all-text-on-focus v-model="cell.payroll_component_code" :size="slot.inputSize" />
                                </div>
                            </template>
                            <template v-slot:cell.amount="{cell, slot, scrollReference}">
                                <div v-if="cell.payroll_component_is_amountable && !cell.isEditing" class="p-[3px] cursor-pointer" @click="editRow(cell)">
                                    {{cell.amount}}
                                </div>
                                <div v-else-if="cell.payroll_component_is_amountable" class="mx-0.5 flex items-center">
                                    <Input class="w-full" :type="'number'" type-strict v-model="cell.amount" :size="slot.inputSize" />
                                </div>
                            </template>
                            <template v-slot:cell.pay_period="{cell, slot, scrollReference}">
                                <div v-if="cell.payroll_component_is_amountable && !cell.isEditing" class="p-[3px] cursor-pointer" @click="editRow(cell)">
                                    {{cell.pay_period}}
                                </div>
                                <div v-else-if="cell.payroll_component_is_amountable" class="mx-0.5 flex items-center">
                                    <Input class="w-full" high-light-all-text-on-focus v-model="cell.pay_period" :size="slot.inputSize" />
                                </div>
                            </template>
                            <template v-slot:cell.pay_type="{cell, slot, scrollReference}">
                                <div v-if="cell.payroll_component_is_amountable && !cell.isEditing" class="p-[3px] cursor-pointer" @click="editRow(cell)">
                                    {{cell.pay_type}}
                                </div>
                                <div v-else-if="cell.payroll_component_is_amountable" class="mx-0.5 flex items-center">
                                    <Input class="w-full" high-light-all-text-on-focus v-model="cell.pay_type" :size="slot.inputSize" />
                                </div>
                            </template>
                            <template v-slot:cell.pay_frequency="{cell, slot, scrollReference}">
                                <div v-if="cell.payroll_component_is_amountable && !cell.isEditing" class="p-[3px] cursor-pointer" @click="editRow(cell)">
                                    {{cell.pay_frequency}}
                                </div>
                                <div v-else-if="cell.payroll_component_is_amountable" class="mx-0.5 flex items-center">
                                    <Input class="w-full" high-light-all-text-on-focus v-model="cell.pay_frequency" :size="slot.inputSize" />
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
import type {TableHeaderT, TableRowPayloadT, TableRowT, TableSupHeaderT, TableSupRowT} from "@/public/js/types/data";
import type {EmployeePayrollComponentPreImportT} from "@/public/js/types/import";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Import Payroll Component`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {baseURL} = useRuntimeConfig().public;
const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const coreStore = useCoreStore();
const {
    navigationBackground,
} = useLayout();
const action = useTemplateRef('action');
const { height: actionReferenceHeight} = useElementSize(action);
const actionAllocation = ref(0);
const actionAllocationComputed = computed(() => {
    return `calc(${(actionAllocation.value + 'px')} + 20px)`;
});

watch(actionReferenceHeight, () => {
    actionAllocation.value = actionReferenceHeight.value;
});
onMounted(async () => {
    actionAllocation.value = actionReferenceHeight.value;
});
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
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
const showReValidate = computed(() => preImportData.value.length > 0);

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
    {text: 'Required', colspan: 1, value: 'employee_number', alignHeader: 'left', justifyData: 'top', width: '140px', maxWidth: '140px'},
    {text: 'Required', colspan: 1, value: 'payroll_component_code', alignHeader: 'left'},
    {text: 'Required by Condition', colspan: 1, value: 'amount', alignHeader: 'left', justifyData: 'top', width: '190px', maxWidth: '190px'},
    {text: 'Required as Amount', colspan: 1, value: 'pay_period', alignHeader: 'left', justifyData: 'top'},
    {text: 'Required as Amount', colspan: 1, value: 'pay_type', alignHeader: 'left', justifyData: 'top'},
    {text: 'Required as Amount', colspan: 1, value: 'pay_frequency', alignHeader: 'left', justifyData: 'top'},
    {text: ''},
]);

const preImportSupRows = reactive<TableSupRowT[]>([
    {
        'amount': "Amount, Pay Period, Pay Type and Pay Frequency are only required when payroll component is Basic Salary or Regular Allowance.",
        'pay_period': "One of the following: \n" + Object.keys(PAY_PERIOD).join("\n"),
        'pay_type': "One of the following: \n" + Object.keys(PAY_TYPE).join("\n"),
        'pay_frequency': "One of the following: \n" + PAY_FREQUENCY_CODES.join("\n"),
    }
]);

const preImportHeaders = reactive<TableHeaderT[]>([
    { text: 'Row #', value: 'row', alignData: 'center'},
    { text: '', value: 'actions', minWidth: '2.5rem'},
    { text: 'Employee Number', value: 'employee_number', alignData: 'left'},
    { text: 'Payroll Component Code', value: 'payroll_component_code', alignData: 'left'},
    { text: 'Amount', value: 'amount', alignData: 'left'},
    { text: 'Pay Period', value: 'pay_period', alignData: 'left'},
    { text: 'Pay Type', value: 'pay_type', alignData: 'left'},
    { text: 'Pay Frequency Code', value: 'pay_frequency', alignData: 'left'},
    { text: 'Validation Result', value: 'validation', alignData: 'left'}
]);

const preImportData = ref<EmployeePayrollComponentPreImportT[]>([]);
const preImportDataThatHasValidationError = computed(() => {
    return preImportData.value.filter((item: EmployeePayrollComponentPreImportT) => {
        return item.validation_errors.length > 0;
    });
})
const selectedPreImportDataId = ref<number[]>([]);
const selectedPreImportData = computed(() => {
    return preImportData.value.filter((item: EmployeePayrollComponentPreImportT) => {
        return selectedPreImportDataId.value.includes(item.id);
    });
});
const selectedPreImportDataThatHasValidationError = computed(() => {
    return selectedPreImportData.value.filter((item: EmployeePayrollComponentPreImportT) => {
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

const transformValidated = (validated: EmployeePayrollComponentPreImportT[]) => {

    return _map(validated, (item: EmployeePayrollComponentPreImportT) => {

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
        formData.append('account_id', selectedAssociatedCompanyAccountId.value);
        formData.append('company_id', selectedAssociatedCompanyId.value);

        await laraFetch("/api/employee-payroll-component-import-validate", {
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

    await laraFetch("/api/employee-payroll-component-import-re-validate", {
        method: 'POST',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
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

            _get(response, '_data.values.validated', []).forEach((validated: EmployeePayrollComponentPreImportT) => {

                let row:(EmployeePayrollComponentPreImportT | undefined) = _find(preImportData.value, {id: validated.id});

                if(row){
                    row.payroll_component_is_amountable = validated.payroll_component_is_amountable;
                    row.amount = validated.amount;
                    row.pay_period = validated.pay_period;
                    row.pay_type = validated.pay_type;
                    row.pay_frequency = validated.pay_frequency;
                    row.validation_errors = validated.validation_errors;
                }
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

const editRow = (cell: TableRowT) => {
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

    await laraFetch("/api/employee-payroll-component-import-save", {
        method: 'POST',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
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

            _get(response, '_data.values.validated', []).forEach((validated: EmployeePayrollComponentPreImportT) => {

                let row:(EmployeePayrollComponentPreImportT | undefined) = _find(preImportData.value, {id: validated.id});

                if(row){
                    row.payroll_component_is_amountable = validated.payroll_component_is_amountable;
                    row.amount = validated.amount;
                    row.pay_period = validated.pay_period;
                    row.pay_type = validated.pay_type;
                    row.pay_frequency = validated.pay_frequency;
                    row.validation_errors = validated.validation_errors;
                }
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

                preImportData.value = _filter(preImportData.value, (item: EmployeePayrollComponentPreImportT) => {
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

<style lang="scss" scoped>
.action-container{
    background-color: v-bind(navigationBackground) !important;
    left: 0;
    right: var(--scrollbar-width);
}
.allocate {
    padding-top: v-bind(actionAllocationComputed);
}
</style>