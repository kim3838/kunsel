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
                                            :clear-selection-on-form-submit="false"
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
                                            :clear-selection-on-form-submit="false"
                                            ref="modalEmployeeSelectionReference"
                                            :disable-actions="disableShiftAssignmentActions"
                                            v-model:pending="modalEmployeeSelectionPending"
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
                                        :disabled="disableShiftAssignmentActions || disableEmployeeModalSelectionActions"
                                        :icon="'mdi:cancel'"
                                        :label="'Cancel'"
                                        @click="closeStagedShiftModal"/>
                                    <Button
                                        class="w-min"
                                        :variant="'default'"
                                        :size="'md'"
                                        :icon="submitStagedIcon"
                                        :disabled="disableShiftAssignmentActions || disableEmployeeModalSelectionActions"
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
                            :clear-selection-on-form-submit="false"
                            ref="employeeSelectionReference"
                            :disable-actions="disableShiftAssignmentActions"
                            v-model:pending="employeeSelectionPending"
                            v-model:selected="selectedEmployees">
                            <template #selection-actions>
                                <Button :disabled="disableShiftAssignmentActions || employeeSelectionPending" @click="assignShifts" class="inline-block" :size="'sm'" :icon="'mdi:plus'" :variant="'outline'" :label="'Assign shift from selected employees'" />
                                <Button :disabled="disableShiftAssignmentActions || employeeSelectionPending" @click="confirmShiftAssignmentBatchDetach" class="inline-block" :size="'sm'" :icon="'mdi:delete-outline'" :variant="'outline'" :label="'Clear shift from selected employees'" />
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
                            :clear-selection-on-form-submit="false"
                            ref="shiftSelectionReference"
                            :disable-actions="disableShiftAssignmentActions"
                            v-model:pending="shiftSelectionPending"
                            v-model:selected="selectedShifts">
                            <template #selection-actions>
                                <Button :disabled="disableShiftAssignmentActions || shiftSelectionPending" @click="assignShifts" class="inline-block" :size="'sm'" :icon="'mdi:plus'" :variant="'outline'" :label="'Assign selected shifts to employees'" />
                                <Button :disabled="disableShiftAssignmentActions || shiftSelectionPending" @click="confirmShiftAssignmentBatchDetach" class="inline-block" :size="'sm'" :icon="'mdi:delete-outline'" :variant="'outline'" :label="'Remove selected shifts from employees'" />
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
import type {ShiftAssignmentsInstance, ShiftByEmployeeSelectionInstance, ShiftSelectionInstance} from "@/public/js/types/component-instance";
import type {StringEnumInterface} from "@/public/js/common/type";

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Shift Assignment`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const {
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

const moment = useNuxtApp().$moment;
const {render: renderDatePicker} = dateTimePicker();
const {screenWidthBreakpoint, width: screenWidth} = useScreen();
const shiftAssignmentTab = ref(SHIFT_ASSIGNMENT_TAB.LIST);
const shiftAssignmentTabs = reactive([
    $enumerableOption(SHIFT_ASSIGNMENT_TAB_NAME, SHIFT_ASSIGNMENT_TAB.LIST as number),
    $enumerableOption(SHIFT_ASSIGNMENT_TAB_NAME, SHIFT_ASSIGNMENT_TAB.CREATE_SHIFT_ASSIGNMENTS as number),
    $enumerableOption(SHIFT_ASSIGNMENT_TAB_NAME, SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS as number),
]);

watch(shiftAssignmentTab, (value) => {
    resetShiftAssignment();
})
const shiftSelectionsRadioGroupOrientation = computed(() => {
    return screenWidth.value >= screenWidthBreakpoint['md'] ? 'horizontal' : 'vertical';
})

const assignShiftModalShow = ref(false);
const editShiftSettingsModalShow = ref(false);

const modalEmployeeSelectionReference = useTemplateRef<ShiftByEmployeeSelectionInstance>('modalEmployeeSelectionReference');
const modalEmployeeSelectionReferencePending = computed(() => {
    return !Boolean(modalEmployeeSelectionReference.value);
});

const modalEmployeeSelectionPending = ref(false);
const selectedModalEmployees = ref([]);

const selectedModalShifts = ref([]);

const shiftAssignmentsReference = useTemplateRef<ShiftAssignmentsInstance>('shiftAssignmentsReference');

const employeeSelectionReference = useTemplateRef<ShiftByEmployeeSelectionInstance>('employeeSelectionReference');
const employeeSelectionPending = ref(false);
const selectedEmployees = ref<number[]>([]);

const shiftSelectionReference = useTemplateRef<ShiftSelectionInstance>('shiftSelectionReference');
const shiftSelectionPending = ref(false);
const selectedShifts = ref<number[]>([]);

const resetShiftAssignment = () => {
    assignShiftModalShow.value = false;
    editShiftSettingsModalShow.value = false;

    selectedModalEmployees.value = [];
    if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS){
        modalEmployeeSelectionReference.value?.reset();
    }
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
        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: 'Validation Error',
            message: `Please select at least one employee to assign shift(s) to.`,
            action: {
                callback: () => {},
                label: 'Okay'
            }
        });
        return;
    }

    if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS && selectedShifts.value.length == 0){
        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: 'Validation Error',
            message: 'Please select at least one shift to assign to employee(s).',
            action: {
                callback: () => {},
                label: 'Okay'
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

    if(stagedShiftAssignmentId.value){
        editShiftSettingsModalShow.value = false;
    } else {
        assignShiftModalShow.value = false;
    }

    if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.CREATE_SHIFT_ASSIGNMENTS){
        selectedModalShifts.value = [];
    }

    if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS){
        selectedModalEmployees.value = [];
        modalEmployeeSelectionReference.value?.reset();
    }

    shiftAssignmentStartDate.value = moment().format("YYYY-MM-DD");
    stateEndOfShift.value = 0;
    shiftAssignmentEndDate.value = null;
}
const disableShiftAssignmentActions = computed(() => {
    return shiftAssignmentPending.value || updateShiftSettingsPending.value || companyAssociationPendingState().value;
});
const disableEmployeeModalSelectionActions = computed(() => {
    return (shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS &&
        (modalEmployeeSelectionPending.value || modalEmployeeSelectionReferencePending.value)
    );
})
const shiftAssignmentPending = ref<boolean>(false);
const updateShiftSettingsPending = ref<boolean>(false);
const stagedShiftAssignmentId = ref<null | number>(null);
const shiftAssignmentStartDate = ref<string>(moment().format("YYYY-MM-DD"));
const stateEndOfShiftRadioGroupOrientation = computed(() => {
    return screenWidth.value >= screenWidthBreakpoint['sm'] ? 'horizontal' : 'vertical';
})
const stateEndOfShiftSelection = reactive([
    {text : 'Shift End Not Specified', value: 0},
    {text : 'State Shift End Date', value: 1},
]);
const stateEndOfShift = ref<number>(0);
const shiftAssignmentEndDate = ref<null | string>(null);

const stateEndOfShiftSelectedChange = () => {

    if(stateEndOfShift.value == 1){
        renderDatePicker(shiftAssignmentDatePickers);
    }
}

const shiftAssignmentForm = computed(() => {
    let form: {
        start_date: string,
        stated_shift_end_date: number,
        end_date?: null | string,
        company_id: number,
        employees?: number[],
        shifts?: number[],
    } = {
        start_date: shiftAssignmentStartDate.value,
        stated_shift_end_date: stateEndOfShift.value,
        company_id: selectedAssociatedCompanyId.value as number,
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
    return disableShiftAssignmentActions.value ? 'eos-icons:loading' : stagedShiftAssignmentId.value ? 'ic:sharp-save' : 'mdi:plus'
});
const submitStagedLabel = computed(() => {
    return disableShiftAssignmentActions.value ? 'Please wait' : stagedShiftAssignmentId.value ? 'Update Shift Settings' : 'Assign shifts'
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
        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: 'Validation Error',
            message: 'Please select at least one shift to assign to employee(s).',
            action: {
                callback: () => {},
                label: 'Okay'
            }
        });
        return;
    }

    if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS && selectedModalEmployees.value.length == 0){
        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: 'Validation Error',
            message: 'Please select at least one employee to assign shift(s) to.',
            action: {
                callback: () => {},
                label: 'Okay'
            }
        });
        return;
    }

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

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: 'Shifts assigned successfully.',
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            resetShiftAssignment();
            await employeeSelectionReference.value?.paginate(1, true);
        }
    });
}

const confirmShiftAssignmentBatchDetach = () => {

    if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.CREATE_SHIFT_ASSIGNMENTS){
        if(selectedEmployees.value.length == 0){
            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Validation Error`,
                message: 'Please select at least one employee to clear shifts from.',
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
            return;
        }
    }

    if(shiftAssignmentTab.value == SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS){
        if(selectedShifts.value.length == 0){
            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Validation Error`,
                message: 'Please select at least one shift to clear from employees.',
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
            return;
        }
    }

    let confirmMessage = {
        [SHIFT_ASSIGNMENT_TAB.CREATE_SHIFT_ASSIGNMENTS as number]: "Confirm clear all selected employee's shifts",
        [SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS as number]: "Confirm clear selected shifts from all employees",
    }[shiftAssignmentTab.value as number] ?? '';

    useNuxtApp().$promptStore.setPrompt({
        resetable: true,
        icon: null,
        title: 'Confirm Action',
        message: confirmMessage,
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
        [SHIFT_ASSIGNMENT_TAB.CREATE_SHIFT_ASSIGNMENTS as number]: '/api/shift-assignment-detach/employee',
        [SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS as number]: '/api/shift-assignment-detach/shift',
    }[shiftAssignmentTab.value as number] ?? '';
})
const shiftAssignmentBatchDetachForm = computed(() => {
    let form:{
        company_id: number,
        selectedMorphables?: number[],
    } = {
        company_id: selectedAssociatedCompanyId.value as number,
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

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: 'Shifts cleared successfully.',
                action: {
                    callback: () => {},
                    label: 'Okay'
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
    let form: {
        start_date: string,
        stated_shift_end_date: number,
        end_date?: null | string,
        company_id: number
    } = {
        start_date: shiftAssignmentStartDate.value,
        stated_shift_end_date: stateEndOfShift.value,
        company_id: selectedAssociatedCompanyId.value as number,
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

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: 'Shift settings updated successfully.',
                action: {
                    callback: () => {},
                    label: 'Okay'
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