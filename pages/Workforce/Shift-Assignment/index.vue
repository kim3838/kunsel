<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <div class="flex flex-row p-[20px]">
                    <RadioGroup
                        :disabled="disableShiftAssignmentActions"
                        class="scaffold-border px-2"
                        :selections="shiftAssignmentTabs"
                        :size="'md'"
                        :orientation="shiftSelectionsRadioGroupOrientation"
                        :radio-key="`shift_assignment_tab`"
                        v-model="shiftAssignmentTab" />
                </div>

                <div v-if="shiftAssignmentTab == SHIFT_ASSIGNMENT_TAB.LIST">
                    <Suspense>
                        <ShiftAssignments
                            ref="shiftAssignmentsReference"
                            v-model:pending="shiftAssignmentPending"
                            @editShiftSettings="editShiftSettings" />
                        <template #fallback>
                            <div class="px-[20px]">
                                <UnorderedList
                                    :icon="'eos-icons:loading'"
                                    :size="'md'"
                                    :label="'Loading shift assignments...'"/>
                            </div>
                        </template>
                    </Suspense>
                </div>

                <DialogModal
                    :show="assignShiftModalShow || editShiftSettingsModalShow"
                    :landscape="true"
                    :content-padding="'0'">
                    <template #title>
                    </template>
                    <template #content>
                        <div class="px-3 pt-4 pb-2.5">
                            <div class="mx-auto max-w-screen-xl space-y-4">
                                <fieldset class="neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">Shift Settings</legend>

                                    <div class="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                                        <div>
                                            <InputLabel :size="'sm'" value="Shift Start Date"/>
                                            <InputWithIcon
                                                readonly
                                                :disabled="disableShiftAssignmentActions"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`shift-start-date`"
                                                v-model="shiftAssignmentStartDate"
                                                :size="'md'" />
                                        </div>
                                        <div class="col-span-full flex flex-wrap gap-2">
                                            <RadioGroup
                                                :disabled="disableShiftAssignmentActions"
                                                :selections="stateEndOfShiftSelection"
                                                :size="'md'"
                                                :orientation="stateEndOfShiftRadioGroupOrientation"
                                                :radio-key="'state-end-of-employment'"
                                                @change="stateEndOfShiftSelectedChange"
                                                v-model="stateEndOfShift" />
                                        </div>
                                        <div v-if="stateEndOfShift == 1">
                                            <InputLabel :size="'sm'" value="Shift End Date"/>
                                            <InputWithIcon
                                                readonly
                                                :disabled="disableShiftAssignmentActions"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`shift-end-date`"
                                                v-model="shiftAssignmentEndDate"
                                                :size="'md'" />
                                        </div>
                                    </div>
                                </fieldset>

                                <fieldset v-if="shiftAssignmentTab == SHIFT_ASSIGNMENT_TAB.CREATE_SHIFT_ASSIGNMENTS" class="neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">Select Shifts</legend>

                                    <Suspense>
                                        <ShiftSelection
                                            compact
                                            :disable-actions="disableShiftAssignmentActions"
                                            v-model:selected="selectedModalShifts"/>

                                        <template #fallback>
                                            <div>
                                                <UnorderedList
                                                    :icon="'eos-icons:loading'"
                                                    :size="'md'"
                                                    :label="'Loading shift selections...'"/>
                                            </div>
                                        </template>
                                    </Suspense>
                                </fieldset>

                                <fieldset v-if="shiftAssignmentTab == SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS" class="neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">Select Employees</legend>

                                    <Suspense>
                                        <ShiftsByEmployeesSelection
                                            compact
                                            :disable-actions="disableShiftAssignmentActions"
                                            v-model:selected="selectedModalEmployees"/>

                                        <template #fallback>
                                            <div>
                                                <UnorderedList
                                                    :icon="'eos-icons:loading'"
                                                    :size="'md'"
                                                    :label="'Loading employee selections...'"/>
                                            </div>
                                        </template>
                                    </Suspense>
                                </fieldset>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="mx-auto max-w-screen-xl">
                            <div class="flex space-x-2 justify-between">
                                <div class="space-x-2 inline-flex">
                                    <div class="space-x-2 inline-flex items-center">
                                    </div>
                                </div>
                                <div class="space-x-2 inline-flex items-center">
                                    <Button
                                        class="w-min"
                                        :variant=" 'outline'"
                                        :size="'md'"
                                        :disabled="disableShiftAssignmentActions"
                                        :icon="'mdi:cancel'"
                                        :label="'Cancel'"
                                        @click="closeStagedShiftModal"/>
                                    <Button
                                        class="w-min"
                                        :variant="'default'"
                                        :size="'md'"
                                        :icon="submitStagedIcon"
                                        :disabled="disableShiftAssignmentActions"
                                        :label="submitStagedLabel"
                                        @click="submitStaged"/>
                                </div>
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div v-if="shiftAssignmentTab == SHIFT_ASSIGNMENT_TAB.CREATE_SHIFT_ASSIGNMENTS">
                    <Suspense>
                        <ShiftsByEmployeesSelection
                            ref="employeeSelectionReference"
                            v-model:selected="selectedEmployees">
                            <template #selection-actions>
                                <Button :override="{font_family: 'National Park'}" @click="assignShifts" class="inline-block" :size="'sm'" :icon="'mdi:plus'" :variant="'outline'" :label="'Assign shift from selected employees'" />
                                <Button :override="{font_family: 'National Park'}" @click="confirmShiftAssignmentBatchDetach" class="inline-block" :size="'sm'" :icon="'mdi:delete-outline'" :variant="'outline'" :label="'Clear shift from selected employees'" />
                            </template>
                        </ShiftsByEmployeesSelection>

                        <template #fallback>
                            <div class="px-[20px]">
                                <UnorderedList
                                    :icon="'eos-icons:loading'"
                                    :size="'md'"
                                    :label="'Loading employee selections...'"/>
                            </div>
                        </template>
                    </Suspense>
                </div>

                <div v-if="shiftAssignmentTab == SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS">
                    <Suspense>
                        <ShiftSelection
                            ref="shiftSelectionReference"
                            v-model:selected="selectedShifts">
                            <template #selection-actions>
                                <Button :override="{font_family: 'National Park'}" @click="assignShifts" class="inline-block" :size="'sm'" :icon="'mdi:plus'" :variant="'outline'" :label="'Assign selected shifts to employees'" />
                                <Button :override="{font_family: 'National Park'}" @click="confirmShiftAssignmentBatchDetach" class="inline-block" :size="'sm'" :icon="'mdi:delete-outline'" :variant="'outline'" :label="'Remove selected shifts from employees'" />
                            </template>
                        </ShiftSelection>

                        <template #fallback>
                            <div class="px-[20px]">
                                <UnorderedList
                                    :icon="'eos-icons:loading'"
                                    :size="'md'"
                                    :label="'Loading shift selections...'"/>
                            </div>
                        </template>
                    </Suspense>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";

definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const nuxtApp = useNuxtApp();
const {
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

const moment = useNuxtApp().$moment;
const coreStore = useCoreStore();
const {render: renderDatePicker} = dateTimePicker();
const {screenWidthBreakpoint, width: screenWidth} = useScreen();
const shiftAssignmentTab = ref(SHIFT_ASSIGNMENT_TAB.LIST);
const shiftAssignmentTabs = reactive([
    {text : SHIFT_ASSIGNMENT_TAB_NAME[SHIFT_ASSIGNMENT_TAB.LIST], value: SHIFT_ASSIGNMENT_TAB.LIST},
    {text : SHIFT_ASSIGNMENT_TAB_NAME[SHIFT_ASSIGNMENT_TAB.CREATE_SHIFT_ASSIGNMENTS], value: SHIFT_ASSIGNMENT_TAB.CREATE_SHIFT_ASSIGNMENTS},
    {text : SHIFT_ASSIGNMENT_TAB_NAME[SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS], value: SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS},
]);

watch(shiftAssignmentTab, (value) => {
    resetShiftAssignment();
})
const shiftSelectionsRadioGroupOrientation = computed(() => {
    return screenWidth.value >= screenWidthBreakpoint['md'] ? 'horizontal' : 'vertical';
})

const assignShiftModalShow = ref(false);
const editShiftSettingsModalShow = ref(false);
const selectedModalEmployees = ref([]);
const selectedModalShifts = ref([]);

const shiftAssignmentsReference = useTemplateRef('shiftAssignmentsReference');

const employeeSelectionReference = useTemplateRef('employeeSelectionReference');
const selectedEmployees = ref([]);
const shiftSelectionReference = useTemplateRef('shiftSelectionReference');
const selectedShifts = ref([]);

const resetShiftAssignment = () => {
    assignShiftModalShow.value = false;
    editShiftSettingsModalShow.value = false;

    selectedModalEmployees.value = [];
    selectedModalShifts.value = [];
    selectedShifts.value = [];
    selectedEmployees.value = [];
    shiftAssignmentStartDate.value = moment().format("YYYY-MM-DD");
    stateEndOfShift.value = 0;
    shiftAssignmentEndDate.value = null;

    stagedShiftAssignmentId.value = null;
}
const shiftAssignmentDatePickers = reactive([
    {
        id: `shift-start-date`,
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            shiftAssignmentStartDate.value = payload.value;
        }
    },
    {
        id: `shift-end-date`,
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            shiftAssignmentEndDate.value = payload.value;
        }
    }
])
const assignShifts = () => {

    if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.CREATE_SHIFT_ASSIGNMENTS && selectedEmployees.value.length == 0){
        coreStore.setServiceError({
            prompt: true,
            payload: {
                message: 'Please select at least one employee to assign shift(s) to.'
            }
        });
        return;
    }

    if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS && selectedShifts.value.length == 0){
        coreStore.setServiceError({
            prompt: true,
            payload: {
                message: 'Please select at least one shift to assign to employee(s).'
            }
        });
        return;
    }

    assignShiftModalShow.value = true;

    renderDatePicker(shiftAssignmentDatePickers);
}
const editShiftSettings = (shift) => {
    stagedShiftAssignmentId.value = _get(shift, 'id', null);

    shiftAssignmentStartDate.value = _get(shift, 'shift_start_date', moment().format("YYYY-MM-DD"));
    let editShiftStatedEndShiftDate = _get(shift, 'shift_stated_shift_end_date', false);

    stateEndOfShift.value = editShiftStatedEndShiftDate ? 1 : 0;

    if(editShiftStatedEndShiftDate){
        shiftAssignmentEndDate.value = _get(shift, 'shift_end_date', null)
    }

    editShiftSettingsModalShow.value = true;

    renderDatePicker(shiftAssignmentDatePickers);
}
const closeStagedShiftModal = () => {

    if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.CREATE_SHIFT_ASSIGNMENTS){
        selectedModalShifts.value = [];
    }

    if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS){
        selectedModalEmployees.value = [];
    }

    shiftAssignmentStartDate.value = moment().format("YYYY-MM-DD");
    stateEndOfShift.value = 0;
    shiftAssignmentEndDate.value = null;

    if(stagedShiftAssignmentId.value){
        editShiftSettingsModalShow.value = false;
    } else {
        assignShiftModalShow.value = false;
    }
}
const disableShiftAssignmentActions = computed(() => {
    return shiftAssignmentPending.value || updateShiftSettingsPending.value;
})
const shiftAssignmentPending = ref(false);
const updateShiftSettingsPending = ref(false);
const stagedShiftAssignmentId = ref(null);
const shiftAssignmentStartDate = ref(moment().format("YYYY-MM-DD"));
const stateEndOfShiftRadioGroupOrientation = computed(() => {
    return screenWidth.value >= screenWidthBreakpoint['sm'] ? 'horizontal' : 'vertical';
})
const stateEndOfShiftSelection = reactive([
    {text : 'Shift End Not Specified', value: 0},
    {text : 'State Shift End Date', value: 1},
]);
const stateEndOfShift = ref(0);
const shiftAssignmentEndDate = ref<null | string>(null);

const stateEndOfShiftSelectedChange = () => {

    if(stateEndOfShift.value == 1){
        renderDatePicker(shiftAssignmentDatePickers);
    }
}

const shiftAssignmentForm = computed(() => {
    let form = {
        start_date: shiftAssignmentStartDate.value,
        stated_shift_end_date: stateEndOfShift.value,
        company_id: selectedAssociatedCompanyId.value,
    }

    if(stateEndOfShift.value == 1){
        form = {...form, end_date: shiftAssignmentEndDate.value,}
    }

    if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.CREATE_SHIFT_ASSIGNMENTS){
        form = {
            ...form,
            employees: selectedEmployees.value,
            shifts: selectedModalShifts.value
        }
    }

    if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS){
        form = {
            ...form,
            employees: selectedModalEmployees.value,
            shifts: selectedShifts.value
        }
    }

    return form;
});

const submitStagedIcon = computed(() => {
    return stagedShiftAssignmentId.value ? 'tdesign:save-filled' : 'mdi:plus'
});
const submitStagedLabel = computed(() => {
    return stagedShiftAssignmentId.value ? 'Update Shift Settings' : 'Assign shifts'
});
const submitStaged = () => {

    if(stagedShiftAssignmentId.value){
        submitUpdateShiftAssignment();
    } else {
        submitShiftAssignment();
    }
};
const submitShiftAssignment = () => {

    if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.CREATE_SHIFT_ASSIGNMENTS && selectedModalShifts.value.length == 0){
        coreStore.setServiceError({
            prompt: true,
            payload: {
                message: 'Please select at least one shift to assign to employee(s).'
            }
        });
        return;
    }

    if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS && selectedModalEmployees.value.length == 0){
        coreStore.setServiceError({
            prompt: true,
            payload: {
                message: 'Please select at least one employee to assign shift(s) to.'
            }
        });
        return;
    }

    console.log({'shiftAssignmentForm': shiftAssignmentForm.value})

    shiftAssignmentPending.value = true;

    laraFetch("/api/shift-assignment-sync-without-detaching", {
        method: 'POST',
        body: shiftAssignmentForm.value,
    },{
        onRequestError: (request, options, error) => {
            shiftAssignmentPending.value = false;
        },
        onResponse: () => {
            shiftAssignmentPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            coreStore.setServiceError({
                prompt: true,
                payload: {
                    message: 'Shifts assigned successfully.'
                }
            });

            resetShiftAssignment();
            employeeSelectionReference.value?.paginate(1, true);
        }
    });
}

const confirmShiftAssignmentBatchDetach = () => {

    if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.CREATE_SHIFT_ASSIGNMENTS){
        if(selectedEmployees.value.length == 0){
            coreStore.setServiceError({
                prompt: true,
                payload: {
                    message: 'Please select at least one employee to clear shifts from.'
                }
            });
            return;
        }
    }

    if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS){
        if(selectedShifts.value.length == 0){
            coreStore.setServiceError({
                prompt: true,
                payload: {
                    message: 'Please select at least one shift to clear from employees.'
                }
            });
            return;
        }
    }

    let title = {
        [SHIFT_ASSIGNMENT_TAB.CREATE_SHIFT_ASSIGNMENTS]: "Confirm clear all selected employee's shifts",
        [SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS]: "Confirm clear selected shifts from all employees",
    }[shiftAssignmentTab.value] ?? '';

    useNuxtApp().$promptStore.setPrompt({
        resetable: true,
        icon: null,
        title: title,
        message: null,
        action: {
            callback: async () => {
                await submitShiftAssignmentBatchDetach();
            },
            label: 'Yes'
        }
    });
};

const shiftAssignmentBatchDetachPath = computed<string>(() => {
    return {
        [SHIFT_ASSIGNMENT_TAB.CREATE_SHIFT_ASSIGNMENTS]: '/api/shift-assignment-detach/employee',
        [SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS]: '/api/shift-assignment-detach/shift',
    }[shiftAssignmentTab.value] ?? '';
})
const shiftAssignmentBatchDetachForm = computed(() => {
    let form = {
        company_id: selectedAssociatedCompanyId.value,
    }

    if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.CREATE_SHIFT_ASSIGNMENTS){
        form = {
            ...form,
            selectedMorphables: selectedEmployees.value,
        }
    }

    if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS){
        form = {
            ...form,
            selectedMorphables: selectedShifts.value
        }
    }

    return form;
})
const submitShiftAssignmentBatchDetach = async () => {

    shiftAssignmentPending.value = true;

    await laraFetch(shiftAssignmentBatchDetachPath.value, {
        method: 'POST',
        body: shiftAssignmentBatchDetachForm.value,
    },{
        onRequestError: (request, options, error) => {
            shiftAssignmentPending.value = false;
        },
        onResponse: () => {
            shiftAssignmentPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            coreStore.setServiceError({
                prompt: true,
                payload: {
                    message: 'Shifts cleared successfully.'
                }
            });

            resetShiftAssignment();

            if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.CREATE_SHIFT_ASSIGNMENTS){
                await nextTick();

                employeeSelectionReference.value?.paginate(1, true);
            }

            if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS){
                await nextTick();

                shiftSelectionReference.value?.paginate(1, true);
            }
        }
    });
};

const updateShiftSettingsForm = computed(() => {
    let form = {
        start_date: shiftAssignmentStartDate.value,
        stated_shift_end_date: stateEndOfShift.value,
        company_id: selectedAssociatedCompanyId.value,
    }

    if(stateEndOfShift.value == 1){
        form = {...form, end_date: shiftAssignmentEndDate.value,}
    }

    return form;
})
const submitUpdateShiftAssignment = async () => {

    if(!stagedShiftAssignmentId.value){
        return;
    }

    updateShiftSettingsPending.value = true;

    await laraFetch(`/api/shift-assignment/${stagedShiftAssignmentId.value}`, {
        method: 'PATCH',
        body: updateShiftSettingsForm.value,
    },{
        onRequestError: (request, options, error) => {
            updateShiftSettingsPending.value = false;
        },
        onResponse: () => {
            updateShiftSettingsPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            coreStore.setServiceError({
                prompt: true,
                payload: {
                    message: 'Shift settings updated successfully.'
                }
            });

            resetShiftAssignment();

            await nextTick();

            shiftAssignmentsReference.value?.paginate(1, true);
        }
    });
}
</script>

<style scoped>

</style>