<template>
    <div>
        <slot />

        <DialogModal
            :max-width="'1280px'"
            :show="showBulkUpdateErrors"
            :closeable="false"
            @close="closeModal">
            <template #title>
            </template>

            <template #content>
                <div>
                    <fieldset class="neutral-border px-2 pb-2 space-y-2">
                        <legend class="text-lg font-header">Bulk Edit Errors</legend>

                        <DataTable
                            :headers="bulkUpdateErrorsHeaders"
                            :size="'md'"
                            :rows="bulkUpdateErrors"
                            selection>
                            <template v-slot:cell.error="{cell, slot}">
                                <Label invert :size="slot.labelSize" :type="'danger'" :label="cell.error" />
                            </template>
                        </DataTable>
                    </fieldset>
                </div>
            </template>

            <template #footer>
                <div class="flex space-x-2 justify-between">
                    <div class="space-x-2 inline-flex">

                    </div>
                    <div class="space-x-2 inline-flex items-center">
                        <Button
                            :variant="`outline`"
                            :disabled="disableActions"
                            @click="closeModal" :label="'Close'" />
                    </div>
                </div>
            </template>
        </DialogModal>

        <DialogModal
            :max-width="'960px'"
            :show="editing"
            :closeable="false"
            @close="closeModal">
            <template #title>
            </template>

            <template #content>
                <div>
                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-2">

                        <fieldset class="neutral-border px-2 pb-2 space-y-2">
                            <legend class="text-lbase">Department</legend>

                            <div class="flex flex-row gap-2">
                                <div>
                                    <InputLabel :size="'sm'" value="Keep current"/>
                                    <RadioGroup
                                        :disabled="disableActions"
                                        :selections="departmentKeepCurrentSelection"
                                        :size="'md'"
                                        :orientation="'horizontal'"
                                        :radio-key="'department-keep-current'"
                                        v-model="departmentKeepCurrent" />
                                </div>
                                <div class="w-full flex flex-col gap-2">
                                    <div v-show="!departmentKeepCurrentComputed">
                                        <InputLabel :size="'sm'" value="Department"/>
                                        <SingleSelect
                                            :icon="'ic:baseline-all-inbox'"
                                            :disabled="disableActions || departmentKeepCurrentComputed"
                                            drop-shadow
                                            :size="'md'"
                                            :options="departmentOptions"/>
                                    </div>
                                    <div v-show="!departmentKeepCurrentComputed && departmentOptions.selected">
                                        <InputLabel :size="'sm'" value="Department Assignment"/>
                                        <RadioGroup
                                            :selections="departmentAssignmentSelections"
                                            :size="'md'"
                                            :orientation="'vertical'"
                                            :radio-key="'department-assignment'"
                                            v-model="departmentAssignment" />
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-row gap-2" v-show="!departmentKeepCurrentComputed">
                                <div></div>

                            </div>
                        </fieldset>

                        <fieldset class="neutral-border px-2 pb-2 space-y-2">
                            <legend class="text-lbase">Manager</legend>

                            <div class="flex flex-row gap-2">
                                <div>
                                    <InputLabel :size="'sm'" value="Keep current"/>
                                    <RadioGroup
                                        :disabled="disableActions"
                                        :selections="managerKeepCurrentSelection"
                                        :size="'md'"
                                        :orientation="'horizontal'"
                                        :radio-key="'manager-keep-current'"
                                        v-model="managerKeepCurrent" />
                                </div>
                                <div class="w-full" v-show="!managerKeepCurrentComputed">
                                    <InputLabel :size="'sm'" value="Manager"/>
                                    <SingleSelectPaginated
                                        :disabled="disableActions"
                                        drop-shadow
                                        :selection-max-viewable-line="10"
                                        :label="'Select Manager'"
                                        :size="'md'"
                                        :icon="'mdi:badge-account-outline'"
                                        :payload="managerOptions"/>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset class="neutral-border px-2 pb-2 space-y-2">
                            <legend class="text-lbase">Designation</legend>

                            <div class="flex flex-row gap-2">
                                <div>
                                    <InputLabel :size="'sm'" value="Keep current"/>
                                    <RadioGroup
                                        :disabled="disableActions"
                                        :selections="designationKeepCurrentSelection"
                                        :size="'md'"
                                        :orientation="'horizontal'"
                                        :radio-key="'designation-keep-current'"
                                        v-model="designationKeepCurrent" />
                                </div>
                                <div class="w-full" v-show="!designationKeepCurrentComputed">
                                    <InputLabel :size="'sm'" value="Designation"/>
                                    <SingleSelect :icon="'ic:baseline-inbox'" :disabled="disableActions" drop-shadow :size="'md'" :options="designationOptions"/>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset class="neutral-border px-2 pb-2 space-y-2">
                            <legend class="text-lbase">Payroll group</legend>

                            <div class="flex flex-row gap-2">
                                <div>
                                    <InputLabel :size="'sm'" value="Keep current"/>
                                    <RadioGroup
                                        :disabled="disableActions"
                                        :selections="payFrequencyKeepCurrentSelection"
                                        :size="'md'"
                                        :orientation="'horizontal'"
                                        :radio-key="'pay-frequency-keep-current'"
                                        v-model="payFrequencyKeepCurrent" />
                                </div>
                                <div class="w-full" v-show="!payFrequencyKeepCurrentComputed">
                                    <InputLabel :size="'sm'" value="Payroll group"/>
                                    <SingleSelect :disabled="disableActions" :searchable="false" :selection-max-viewable-line="10" drop-shadow :size="'md'" :options="payFrequencyOptions"/>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </template>

            <template #footer>
                <div class="flex space-x-2 justify-between">
                    <div class="space-x-2 inline-flex">
                        <div class="space-x-2 inline-flex items-center">
                            <UnorderedList
                                v-if="pending"
                                :icon="'eos-icons:loading'"
                                :size="'md'"
                                :label="'Please wait...'"/>
                        </div>
                    </div>
                    <div class="space-x-2 inline-flex items-center">
                        <Button
                            :variant="`outline`"
                            :disabled="disableActions"
                            @click="closeModal" :label="'Cancel'" />

                        <Button
                            :disabled="disableActions"
                            @click="bulkUpdate"
                            :label="`Update all`"/>
                    </div>
                </div>
            </template>
        </DialogModal>
    </div>
</template>

<script setup lang="ts">

import {storeToRefs} from "pinia";
import type {StringEnumInterface} from "@/public/js/common/type";
import type {TableHeaderT} from "@/public/js/types/data";

const {$authStore} = useNuxtApp();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId,
} = storeToRefs($authStore);

const emit = defineEmits(['completed']);

const props = defineProps({
    selectedEmployeeIds:{
        type: Array as PropType<number[]>,
        default: () => {
            return [];
        }
    }
});

//Employee Organization
const companyOrganizationSelections = companyOrganizationSelectionsState();

const departmentKeepCurrentComputed = computed(() => {return departmentKeepCurrent.value == 1;})
const departmentKeepCurrent = ref(1);
const departmentKeepCurrentSelection = reactive([{text : 'Yes', value: 1}, {text : 'No', value: 0},]);
const departmentOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.departments,
    selected: null
});

const departmentAssignmentSelections = reactive([
    $enumerableOption(DEPARTMENT_EMPLOYEE_ASSIGNMENT_NAME, DEPARTMENT_EMPLOYEE_ASSIGNMENT.DEFAULT as number),
    $enumerableOption(DEPARTMENT_EMPLOYEE_ASSIGNMENT_NAME, DEPARTMENT_EMPLOYEE_ASSIGNMENT.HEAD as number),
])
const departmentAssignment = ref(DEPARTMENT_EMPLOYEE_ASSIGNMENT.DEFAULT);

const managerKeepCurrentComputed = computed(() => {return managerKeepCurrent.value == 1;})
const managerKeepCurrent = ref(1);
const managerKeepCurrentSelection = reactive([{text : 'Yes', value: 1}, {text : 'No', value: 0},]);
const managerOptions = reactive({
    fetch: {
        url: '/api/employee-selections',
        filters: {
            'company_id': selectedAssociatedCompanyId.value,
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: null,
});

const designationKeepCurrentComputed = computed(() => {return designationKeepCurrent.value == 1;})
const designationKeepCurrent = ref(1);
const designationKeepCurrentSelection = reactive([{text : 'Yes', value: 1}, {text : 'No', value: 0},]);
const designationOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.designations,
    selected: null
});

const payFrequencyKeepCurrentComputed = computed(() => {return payFrequencyKeepCurrent.value == 1;})
const payFrequencyKeepCurrent = ref(1);
const payFrequencyKeepCurrentSelection = reactive([{text : 'Yes', value: 1}, {text : 'No', value: 0},]);
const payFrequencyOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.pay_frequencies,
    selected: null
});

const disableActions = computed(() => {
    return pending.value;
});

const editing = ref(false);

const pending = ref(false);

const bulkEdit = () => {
    editing.value = true;
}

const formBody = computed(() => {

    return {
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,

        keep_department: departmentKeepCurrentComputed.value,
        department_id: departmentOptions.selected,
        department_assignment_type: departmentOptions.selected ? departmentAssignment.value : null,

        keep_designation: designationKeepCurrentComputed.value,
        designation_id: designationOptions.selected,

        keep_manager: managerKeepCurrentComputed.value,
        manager_id: managerOptions.selected,

        keep_pay_frequency: payFrequencyKeepCurrentComputed.value,
        pay_frequency_id: payFrequencyOptions.selected,

        employee_identifiers: props.selectedEmployeeIds
    };
});

const bulkUpdate = async () => {

    pending.value = true;

    await laraFetch('/api/employees', {
        method: 'PATCH',
        body: formBody.value,
    }, {
        onRequestError: () => {
            pending.value = false;
        },
        onResponse: () => {
            pending.value = false;
        },
        onSuccessResponse: (request, options, response) => {

            bulkUpdateErrors.value = _get(response, '_data.values.batch_update_errors', []);
            const hasErrors = bulkUpdateErrors.value.length > 0;
            const resetModalOnClose = !hasErrors;

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: hasErrors ? `Bulk update complete with errors.` : `Bulk update complete.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            if(hasErrors){
                showBulkUpdateErrors.value = true;
            }

            closeModal(resetModalOnClose);
            emit('completed');
        }
    });
}

const showBulkUpdateErrors = ref(false);
const bulkUpdateErrorsHeaders = reactive<TableHeaderT[]>([
    { text: 'Employee #', value: 'employee_number', alignData: 'left'},
    { text: '', value: 'employee_full_name', alignData: 'left'},
    { text: 'Error', value: 'error', alignData: 'left'},
]);
const bulkUpdateErrors = ref([]);

const reset = () => {
    departmentKeepCurrent.value = 1;
    departmentOptions.selected = null;
    departmentAssignment.value = DEPARTMENT_EMPLOYEE_ASSIGNMENT.DEFAULT;

    managerKeepCurrent.value = 1;
    managerOptions.selected = null;

    designationKeepCurrent.value = 1;
    designationOptions.selected = null;

    payFrequencyKeepCurrent.value = 1;
    payFrequencyOptions.selected = null;

    showBulkUpdateErrors.value = false;
    bulkUpdateErrors.value = [];
}
const closeModal = (resetModal = true) => {
    if(resetModal){
        reset();
    }
    editing.value = false;
};

defineExpose({
    bulkEdit
});
</script>

<style scoped>

</style>