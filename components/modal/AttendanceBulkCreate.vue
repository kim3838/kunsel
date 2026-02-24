<template>
    <div>
        <slot />

        <DialogModal
            :show="showBulkCreateErrors"
            :closeable="false"
            @close="closeModal">
            <template #title>
            </template>

            <template #content>
                <div>
                    <fieldset class="neutral-border px-2 pb-2 space-y-2">
                        <legend class="text-lg font-header">Errors</legend>

                        <DataTable
                            :headers="bulkCreateErrorsHeaders"
                            :size="'md'"
                            :rows="bulkCreateErrors"
                            selection>
                            <template v-slot:cell.error="{cell, slot}">
                                <Label invert :size="slot.labelSize" :type="'default'" :label="cell.error" />
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
                            @click="closeErrorsModal" :label="'Close'" />
                    </div>
                </div>
            </template>
        </DialogModal>

        <DialogModal
            :max-width="'660px'"
            :show="creating"
            :closeable="false"
            @close="closeModal">
            <template #title>
            </template>

            <template #content>
                <div class="space-y-4">

                    <div class="font-medium text-lg font-header">
                        Auto-create attendance
                    </div>

                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-5">
                        <div class="col-span-2">
                            <InputLabel :size="'sm'" value="Employee"/>
                            <MultiSelectPaginated
                                :key="employeeOptionsKey"
                                :disabled="disableActions"
                                drop-shadow
                                value-persist
                                :selection-max-viewable-line="10"
                                :label="'Select Employee'"
                                :size="'md'"
                                :icon="'mdi:badge-account-outline'"
                                :payload="employeeOptions"/>
                        </div>
                        <div class="col-span-2">
                            <InputLabel :size="'sm'" value="Employee Group" />
                            <MultiSelect :key="employeeGroupOptionsKey" glint drop-shadow :selection-max-viewable-line="15" :size="'md'" :options="employeeGroupOptions" :disabled="disableActions" :icon="'tdesign:component-checkbox'"/>
                        </div>
                    </div>

                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-5">
                        <div class="col-span-3 text-sm">
                            Select employee or employee group to auto-create attendances from.
                        </div>
                    </div>
                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-6">
                        <div class="col-span-2">
                            <InputLabel :size="'sm'" value="Date From"/>
                            <InputWithIcon :icon="'mdi:calendar-today-outline'" :id="'auto_create_date_from'" readonly v-model="attendanceDateFrom" :size="'md'" class="w-full" :override="{font_family_class: 'font-sans'}" :disabled="disableActions" />
                        </div>
                        <div class="col-span-2">
                            <InputLabel :size="'sm'" value="Date To"/>
                            <InputWithIcon :icon="'mdi:calendar-outline'" :id="'auto_create_date_to'" readonly v-model="attendanceDateTo" :size="'md'" class="w-full" :override="{font_family_class: 'font-sans'}" :disabled="disableActions" />
                        </div>
                    </div>
                    <div>
                        <InputLabel :size="'sm'" value="Replace existing attendance/s"/>
                        <RadioGroup
                            :disabled="disableActions"
                            :selections="replaceExistingAttendanceSelection"
                            :size="'md'"
                            :orientation="'horizontal'"
                            :radio-key="'replace-existing-attendance'"
                            v-model="replaceExistingAttendance" />
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
                            @click="cancel" :label="'Cancel'" />

                        <Button
                            :disabled="disableActions"
                            @click="bulkCreateSubmit"
                            :icon="pending ? 'eos-icons:loading' : 'mdi-plus'"
                            :label="pending ? 'Generating...' : `Auto-create attendances`"/>
                    </div>
                </div>
            </template>
        </DialogModal>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {TableHeaderT} from "@/public/js/types/data";

const {$authStore} = useNuxtApp();
const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const common = useCommon();
const moment = useNuxtApp().$moment;
const {render} = dateTimePicker();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId,
} = storeToRefs($authStore);

watch(updatedAssociatedCompanyFlag, async (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        rebuildSelections();
    }
})

const rebuildSelections = (selection: string[] = []) => {

    if(_isEmpty(selection) || selection.indexOf('employee') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            employeeOptions, employeeOptionsKey, SELECT.MULTI_PAGINATED
        );
    }
}

const emit = defineEmits(['cancelled', 'completed']);

const employeeOptionsKey = shallowRef(0);
const employeeOptions = reactive({
    fetch: {
        url: '/api/employee-selections',
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: [],
});

const companyOrganizationSelections = companyOrganizationSelectionsState();
const employeeGroupOptionsKey = shallowRef(0);
const employeeGroupOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.employee_groups,
    selected: []
});

const attendanceDateFrom = ref(moment().startOf('month').format('YYYY-MM-DD'));
const attendanceDateTo = ref(moment().endOf('month').format('YYYY-MM-DD'));

const replaceExistingAttendanceSelection = reactive([
    {text : 'Yes', value: 1},
    {text : 'No', value: 0},
]);
const replaceExistingAttendance = ref(1);

let autoCreateDatePickers = ref([
    {
        id: 'auto_create_date_from',
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            attendanceDateFrom.value = payload.value;
        }
    }, {
        id: 'auto_create_date_to',
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            attendanceDateTo.value = payload.value;
        }
    }
]);

const renderDatePickers = () => {
    render(autoCreateDatePickers.value);
}

const disableActions = computed(() => {
    return pending.value;
});

const creating = ref(false);

const pending = ref(false);

const bulkCreate = () => {
    renderDatePickers();
    creating.value = true;
}

const bulkCreateSubmit = async () => {

    pending.value = true;

    await laraFetch('/api/auto-create-attendances', {
        method: 'POST',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            employee_ids: employeeOptions.selected,
            assigned_employee_group_ids: employeeGroupOptions.selected,
            date_from: attendanceDateFrom.value,
            date_to: attendanceDateTo.value,
            replace_existing_attendance: replaceExistingAttendance.value,
        },
    }, {
        onRequestError: () => {
            pending.value = false;
        },
        onResponse: () => {
            pending.value = false;
        },
        onSuccessResponse: (request, options, response) => {

            bulkCreateErrors.value = _get(response, '_data.values.errors', []);
            const hasErrors = bulkCreateErrors.value.length > 0;
            const resetModalOnClose = !hasErrors;

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: hasErrors ? `Auto-create complete with errors.` : `Auto-create complete.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            if(hasErrors){
                showBulkCreateErrors.value = true;
            }

            closeModal(resetModalOnClose);
            if(resetModalOnClose){
                emit('completed');
            }
        }
    });
}

const showBulkCreateErrors = ref(false);
const bulkCreateErrorsHeaders = reactive<TableHeaderT[]>([
    { text: 'Employee #', value: 'employee_number', alignData: 'left'},
    { text: '', value: 'employee_full_name', alignData: 'left'},
    { text: 'Date', value: 'date', alignData: 'left'},
    { text: 'Error', value: 'error', alignData: 'left'},
]);
const bulkCreateErrors = ref([]);

const reset = () => {
    employeeOptions.selected = [];
    employeeOptionsKey.value++;

    employeeGroupOptions.selected = [];

    showBulkCreateErrors.value = false;
    bulkCreateErrors.value = [];

    attendanceDateFrom.value = moment().startOf('month').format('YYYY-MM-DD');
    attendanceDateTo.value = moment().endOf('month').format('YYYY-MM-DD');
    renderDatePickers();
    replaceExistingAttendance.value = 1;
}
const closeModal = (resetModal = true) => {
    if(resetModal){
        reset();
    }
    creating.value = false;
};
const closeErrorsModal = (resetModal = true) => {
    reset();
    creating.value = false;
    emit('completed');
};

const cancel = () => {
    closeModal();
    emit('cancelled');
}

defineExpose({
    bulkCreate
});
</script>

<style scoped>

</style>