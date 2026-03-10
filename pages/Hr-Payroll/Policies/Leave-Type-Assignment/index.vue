<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <div class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="flex flex-row">
                        <RadioGroup
                            :disabled="disableLeaveTypeAssignmentActions"
                            class="flex-none scaffold-border px-2"
                            :selections="leaveTypeAssignmentTabs"
                            :size="'md'"
                            :orientation="leaveTypeSelectionsRadioGroupOrientation"
                            :radio-key="`leave_type_assignment_tab`"
                            v-model="leaveTypeAssignmentTab" />
                    </div>
                </div>

                <div v-if="leaveTypeAssignmentTab == LEAVE_TYPE_ASSIGNMENT_TAB.LIST">
                    <Suspense>
                        <LeaveTypeAssignments
                            ref="leaveTypeAssignmentsReference"
                            v-model:pending="leaveTypeAssignmentPending"
                            @editLeaveTypeSettings="editLeaveTypeSettings" />
                            <template #fallback>
                                <div class="px-[20px]">
                                    <UnorderedList
                                        :icon="'eos-icons:loading'"
                                        :size="'md'"
                                        :label="'Loading leave type assignments...'"/>
                                </div>
                            </template>
                    </Suspense>
                </div>

                <DialogModal
                    :show="assignLeaveTypeModalShow || editLeaveTypeSettingsModalShow"
                    :content-padding="'0'">
                    <template #title>
                    </template>
                    <template #content>
                        <div class="px-3 pt-4 pb-2.5">
                            <div class="mx-auto max-w-screen-xl space-y-4">

                                <div class="lining-shadow rounded-sm tint-background">

                                    <div class="lining-shadow rounded-t-sm text-lg font-medium font-header px-4 py-2">Leave Type Settings</div>

                                    <div class="p-4">

                                        <div class="flex flex-row gap-6">
                                            <div class="col-span-full gap-2">
                                                <InputLabel :size="'sm'" value="Override leave type initial balance"/>
                                                <RadioGroup
                                                    :disabled="disableLeaveTypeAssignmentActions"
                                                    :selections="stateOverrideLeaveTypeInitialBalanceUponEligibilitySelection"
                                                    :size="'md'"
                                                    :orientation="overrideLeaveTypeInitialBalanceUponEligibilityRadioGroupOrientation"
                                                    :radio-key="'override-leave-type-initial-balance-upon-eligibility'"
                                                    v-model="overrideBalanceUponEligibility" />
                                            </div>
                                            <div v-if="overrideBalanceUponEligibility == 1" class="max-w-max">
                                                <InputLabel :size="'sm'" value="Custom balance upon eligibility"/>
                                                <Input
                                                    type-strict
                                                    :type="'number'"
                                                    :disabled="disableLeaveTypeAssignmentActions"
                                                    v-model="balanceUponEligibility"
                                                    :size="'md'" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="leaveTypeAssignmentTab == LEAVE_TYPE_ASSIGNMENT_TAB.CREATE_LEAVE_TYPE_ASSIGNMENTS" class="lining-shadow rounded-sm tint-background">

                                    <div class="lining-shadow rounded-t-sm text-lg font-medium font-header px-4 py-2">Select Leave Types</div>

                                    <div class="p-4">
                                        <Suspense>
                                            <LeaveTypeSelection
                                                compact
                                                :clear-selection-on-form-submit="false"
                                                :disable-actions="disableLeaveTypeAssignmentActions"
                                                v-model:selected="selectedModalLeaveTypes"/>

                                            <template #fallback>
                                                <div>
                                                    <UnorderedList
                                                        :icon="'eos-icons:loading'"
                                                        :size="'md'"
                                                        :label="'Loading leave type selections...'"/>
                                                </div>
                                            </template>
                                        </Suspense>
                                    </div>
                                </div>

                                <div v-if="leaveTypeAssignmentTab == LEAVE_TYPE_ASSIGNMENT_TAB.MANAGE_ASSIGNED_LEAVE_TYPES" class="lining-shadow rounded-sm tint-background">

                                    <div class="lining-shadow rounded-t-sm text-lg font-medium font-header px-4 py-2">Select Employees</div>

                                    <div class="p-4 max-h-[400px] overflow-y-scroll">
                                        <Suspense>
                                            <LeaveTypesByEmployeesSelection
                                                compact
                                                :clear-selection-on-form-submit="false"
                                                ref="modalEmployeeSelectionReference"
                                                :disable-actions="disableLeaveTypeAssignmentActions"
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
                                    </div>
                                </div>
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
                                        :disabled="disableLeaveTypeAssignmentActions || disableEmployeeModalSelectionActions"
                                        :label="'Cancel'"
                                        @click="closeStagedLeaveTypeModal"/>
                                    <Button
                                        class="w-min"
                                        :variant="'default'"
                                        :size="'md'"
                                        :icon="submitStagedIcon"
                                        :disabled="disableLeaveTypeAssignmentActions || disableEmployeeModalSelectionActions"
                                        :label="submitStagedLabel"
                                        @click="submitStaged"/>
                                </div>
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div v-if="leaveTypeAssignmentTab == LEAVE_TYPE_ASSIGNMENT_TAB.CREATE_LEAVE_TYPE_ASSIGNMENTS">
                    <Suspense>
                        <LeaveTypesByEmployeesSelection
                            :clear-selection-on-form-submit="false"
                            ref="employeeSelectionReference"
                            :disable-actions="disableLeaveTypeAssignmentActions"
                            v-model:pending="employeeSelectionPending"
                            v-model:selected="selectedEmployees">
                            <template #selection-actions>
                                <Button :disabled="disableLeaveTypeAssignmentActions || employeeSelectionPending" @click="assignLeaveTypes" class="inline-block" :size="'sm'" :icon="'mdi:plus'" :variant="'outline'" :label="'Assign leave type from selected employees'" />
                                <Button :disabled="disableLeaveTypeAssignmentActions || employeeSelectionPending" @click="confirmLeaveTypeAssignmentBatchDetach" class="inline-block" :size="'sm'" :icon="'mdi:delete-outline'" :variant="'outline'" :label="'Clear leave type from selected employees'" />
                            </template>
                        </LeaveTypesByEmployeesSelection>

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

                <div v-if="leaveTypeAssignmentTab == LEAVE_TYPE_ASSIGNMENT_TAB.MANAGE_ASSIGNED_LEAVE_TYPES">
                    <Suspense>
                        <LeaveTypeSelection
                            :clear-selection-on-form-submit="false"
                            ref="leaveTypeSelectionReference"
                            :disable-actions="disableLeaveTypeAssignmentActions"
                            v-model:pending="leaveTypeSelectionPending"
                            v-model:selected="selectedLeaveTypes">
                            <template #selection-actions>
                                <Button :disabled="disableLeaveTypeAssignmentActions || leaveTypeSelectionPending" @click="assignLeaveTypes" class="inline-block" :size="'sm'" :icon="'mdi:plus'" :variant="'outline'" :label="'Assign selected leave types to employees'" />
                                <Button :disabled="disableLeaveTypeAssignmentActions || leaveTypeSelectionPending" @click="confirmLeaveTypeAssignmentBatchDetach" class="inline-block" :size="'sm'" :icon="'mdi:delete-outline'" :variant="'outline'" :label="'Remove selected leave types from employees'" />
                            </template>
                        </LeaveTypeSelection>

                        <template #fallback>
                            <div class="px-[20px]">
                                <UnorderedList
                                    :icon="'eos-icons:loading'"
                                    :size="'md'"
                                    :label="'Loading leave type selections...'"/>
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
import type {LeaveTypeAssignmentsInstance, LeaveTypeByEmployeeSelectionInstance, LeaveTypeSelectionInstance} from "@/public/js/types/component-instance";
import type {StringEnumInterface} from "@/public/js/common/type";

useHead({titleTemplate: (titleChunk) => {return `Leave Type Assignment`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

const moment = useNuxtApp().$moment;
const {render: renderDatePicker} = dateTimePicker();
const {screenWidthBreakpoint, width: screenWidth} = useScreen();
const leaveTypeAssignmentTab = ref(LEAVE_TYPE_ASSIGNMENT_TAB.LIST);
const leaveTypeAssignmentTabs = reactive([
    $enumerableOption(LEAVE_TYPE_ASSIGNMENT_TAB_NAME, LEAVE_TYPE_ASSIGNMENT_TAB.LIST as number),
    $enumerableOption(LEAVE_TYPE_ASSIGNMENT_TAB_NAME, LEAVE_TYPE_ASSIGNMENT_TAB.CREATE_LEAVE_TYPE_ASSIGNMENTS as number),
    $enumerableOption(LEAVE_TYPE_ASSIGNMENT_TAB_NAME, LEAVE_TYPE_ASSIGNMENT_TAB.MANAGE_ASSIGNED_LEAVE_TYPES as number),
]);

watch(leaveTypeAssignmentTab, (value) => {
    resetLeaveTypeAssignment();
})
const leaveTypeSelectionsRadioGroupOrientation = computed(() => {
    return screenWidth.value >= screenWidthBreakpoint['md'] ? 'horizontal' : 'vertical';
})

const assignLeaveTypeModalShow = ref(false);
const editLeaveTypeSettingsModalShow = ref(false);

const modalEmployeeSelectionReference = useTemplateRef<LeaveTypeByEmployeeSelectionInstance>('modalEmployeeSelectionReference');
const modalEmployeeSelectionReferencePending = computed(() => {
    return !Boolean(modalEmployeeSelectionReference.value);
});

const modalEmployeeSelectionPending = ref(false);
const selectedModalEmployees = ref([]);

const selectedModalLeaveTypes = ref([]);

const leaveTypeAssignmentsReference = useTemplateRef<LeaveTypeAssignmentsInstance>('leaveTypeAssignmentsReference');

const employeeSelectionReference = useTemplateRef<LeaveTypeByEmployeeSelectionInstance>('employeeSelectionReference');
const employeeSelectionPending = ref(false);
const selectedEmployees = ref<number[]>([]);

const leaveTypeSelectionReference = useTemplateRef<LeaveTypeSelectionInstance>('leaveTypeSelectionReference');
const leaveTypeSelectionPending = ref(false);
const selectedLeaveTypes = ref<number[]>([]);

const resetLeaveTypeAssignment = () => {
    assignLeaveTypeModalShow.value = false;
    editLeaveTypeSettingsModalShow.value = false;

    selectedModalEmployees.value = [];
    if(leaveTypeAssignmentTab.value == LEAVE_TYPE_ASSIGNMENT_TAB.MANAGE_ASSIGNED_LEAVE_TYPES){
        modalEmployeeSelectionReference.value?.reset();
    }
    selectedModalLeaveTypes.value = [];
    selectedLeaveTypes.value = [];
    selectedEmployees.value = [];
    overrideBalanceUponEligibility.value = 0;
    balanceUponEligibility.value = 0;

    stagedLeaveTypeAssignmentId.value = null;
}
const assignLeaveTypes = () => {

    if(leaveTypeAssignmentTab.value == LEAVE_TYPE_ASSIGNMENT_TAB.CREATE_LEAVE_TYPE_ASSIGNMENTS && selectedEmployees.value.length == 0){
        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: 'Validation Error',
            message: `Please select at least one employee to assign leave type(s) to.`,
            action: {
                callback: () => {},
                label: 'Okay'
            }
        });
        return;
    }

    if(leaveTypeAssignmentTab.value == LEAVE_TYPE_ASSIGNMENT_TAB.MANAGE_ASSIGNED_LEAVE_TYPES && selectedLeaveTypes.value.length == 0){
        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: 'Validation Error',
            message: 'Please select at least one leave type to assign to employee(s).',
            action: {
                callback: () => {},
                label: 'Okay'
            }
        });
        return;
    }

    assignLeaveTypeModalShow.value = true;
}
const editLeaveTypeSettings = (leaveType: any) => {
    stagedLeaveTypeAssignmentId.value = _get(leaveType, 'id', null);

    let editInitialBalanceUponEligibility = _get(leaveType, 'leave_type_assignment_override_balance_upon_eligibility', false);

    overrideBalanceUponEligibility.value = editInitialBalanceUponEligibility ? 1 : 0;

    if(editInitialBalanceUponEligibility){
        balanceUponEligibility.value = _get(leaveType, 'leave_type_assignment_balance_upon_eligibility', 0)
    }

    editLeaveTypeSettingsModalShow.value = true;
}
const closeStagedLeaveTypeModal = () => {

    if(stagedLeaveTypeAssignmentId.value){
        editLeaveTypeSettingsModalShow.value = false;
    } else {
        assignLeaveTypeModalShow.value = false;
    }

    if(leaveTypeAssignmentTab.value == LEAVE_TYPE_ASSIGNMENT_TAB.CREATE_LEAVE_TYPE_ASSIGNMENTS){
        selectedModalLeaveTypes.value = [];
    }

    if(leaveTypeAssignmentTab.value == LEAVE_TYPE_ASSIGNMENT_TAB.MANAGE_ASSIGNED_LEAVE_TYPES){
        selectedModalEmployees.value = [];
        modalEmployeeSelectionReference.value?.reset();
    }

    overrideBalanceUponEligibility.value = 0;
    balanceUponEligibility.value = 0;
}
const disableLeaveTypeAssignmentActions = computed(() => {
    return leaveTypeAssignmentPending.value || updateLeaveTypeSettingsPending.value || companyAssociationPendingState().value;
});
const disableEmployeeModalSelectionActions = computed(() => {
    return (leaveTypeAssignmentTab.value == LEAVE_TYPE_ASSIGNMENT_TAB.MANAGE_ASSIGNED_LEAVE_TYPES &&
        (modalEmployeeSelectionPending.value || modalEmployeeSelectionReferencePending.value)
    );
})
const leaveTypeAssignmentPending = ref<boolean>(false);
const updateLeaveTypeSettingsPending = ref<boolean>(false);
const stagedLeaveTypeAssignmentId = ref<null | number>(null);

const overrideLeaveTypeInitialBalanceUponEligibilityRadioGroupOrientation = computed(() => {
    return screenWidth.value >= screenWidthBreakpoint['sm'] ? 'horizontal' : 'vertical';
})
const stateOverrideLeaveTypeInitialBalanceUponEligibilitySelection = reactive([
    {text : 'No', value: 0},
    {text : 'Yes', value: 1},
]);
const overrideBalanceUponEligibility = ref<number>(0);
const balanceUponEligibility = ref<number>(0);

const leaveTypeAssignmentForm = computed(() => {
    let form: {
        account_id: number,
        company_id: number,
        override_balance_upon_eligibility: number,
        balance_upon_eligibility?: number,
        employees?: number[],
        leave_types?: number[],
    } = {
        account_id: selectedAssociatedCompanyAccountId.value as number,
        company_id: selectedAssociatedCompanyId.value as number,
        override_balance_upon_eligibility: overrideBalanceUponEligibility.value,
    }

    if(overrideBalanceUponEligibility.value == 1){
        form = {...form, balance_upon_eligibility: balanceUponEligibility.value,}
    }

    if(leaveTypeAssignmentTab.value == LEAVE_TYPE_ASSIGNMENT_TAB.CREATE_LEAVE_TYPE_ASSIGNMENTS){
        form = {
            ...form,
            employees: selectedEmployees.value,
            leave_types: selectedModalLeaveTypes.value
        }
    }

    if(leaveTypeAssignmentTab.value == LEAVE_TYPE_ASSIGNMENT_TAB.MANAGE_ASSIGNED_LEAVE_TYPES){
        form = {
            ...form,
            employees: selectedModalEmployees.value,
            leave_types: selectedLeaveTypes.value
        }
    }

    return form;
});

const submitStagedIcon = computed(() => {
    return disableLeaveTypeAssignmentActions.value ? 'eos-icons:loading' : stagedLeaveTypeAssignmentId.value ? 'ic:sharp-save' : 'mdi:plus'
});
const submitStagedLabel = computed(() => {
    return disableLeaveTypeAssignmentActions.value ? 'Please wait' : stagedLeaveTypeAssignmentId.value ? 'Save Leave Type Settings' : 'Assign leave types'
});
const submitStaged = () => {

    if(stagedLeaveTypeAssignmentId.value){
        submitUpdateLeaveTypeAssignment();
    } else {
        submitLeaveTypeAssignment();
    }
};
const submitLeaveTypeAssignment = () => {

    if(leaveTypeAssignmentTab.value == LEAVE_TYPE_ASSIGNMENT_TAB.CREATE_LEAVE_TYPE_ASSIGNMENTS && selectedModalLeaveTypes.value.length == 0){
        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: 'Validation Error',
            message: 'Please select at least one leave type to assign to employee(s).',
            action: {
                callback: () => {},
                label: 'Okay'
            }
        });
        return;
    }

    if(leaveTypeAssignmentTab.value == LEAVE_TYPE_ASSIGNMENT_TAB.MANAGE_ASSIGNED_LEAVE_TYPES && selectedModalEmployees.value.length == 0){
        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: 'Validation Error',
            message: 'Please select at least one employee to assign leave type(s) to.',
            action: {
                callback: () => {},
                label: 'Okay'
            }
        });
        return;
    }

    leaveTypeAssignmentPending.value = true;

    laraFetch("/api/leave-type-assignment-sync-without-detaching", {
        method: 'POST',
        body: leaveTypeAssignmentForm.value,
    },{
        onRequestError: (request, options, error) => {
            leaveTypeAssignmentPending.value = false;
        },
        onResponse: () => {
            leaveTypeAssignmentPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: 'Leave types assigned successfully.',
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            resetLeaveTypeAssignment();
            await employeeSelectionReference.value?.paginate(1, true);
        }
    });
}

const confirmLeaveTypeAssignmentBatchDetach = () => {

    if(leaveTypeAssignmentTab.value == LEAVE_TYPE_ASSIGNMENT_TAB.CREATE_LEAVE_TYPE_ASSIGNMENTS){
        if(selectedEmployees.value.length == 0){
            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Validation Error`,
                message: 'Please select at least one employee to clear leave types from.',
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
            return;
        }
    }

    if(leaveTypeAssignmentTab.value == LEAVE_TYPE_ASSIGNMENT_TAB.MANAGE_ASSIGNED_LEAVE_TYPES){
        if(selectedLeaveTypes.value.length == 0){
            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Validation Error`,
                message: 'Please select at least one leave type to clear from employees.',
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
            return;
        }
    }

    let confirmMessage = {
        [LEAVE_TYPE_ASSIGNMENT_TAB.CREATE_LEAVE_TYPE_ASSIGNMENTS as number]: "Confirm clear all selected employee's leave types",
        [LEAVE_TYPE_ASSIGNMENT_TAB.MANAGE_ASSIGNED_LEAVE_TYPES as number]: "Confirm clear selected leave types from all employees",
    }[leaveTypeAssignmentTab.value as number] ?? '';

    useNuxtApp().$promptStore.setPrompt({
        resetable: true,
        icon: null,
        title: 'Confirm Action',
        message: confirmMessage,
        action: {
            callback: async () => {
                await submitLeaveTypeAssignmentBatchDetach();
            },
            label: 'Yes'
        }
    });
};

const leaveTypeAssignmentBatchDetachPath = computed<string>(() => {
    return {
        [LEAVE_TYPE_ASSIGNMENT_TAB.CREATE_LEAVE_TYPE_ASSIGNMENTS as number]: '/api/leave-type-assignment-detach/employee',
        [LEAVE_TYPE_ASSIGNMENT_TAB.MANAGE_ASSIGNED_LEAVE_TYPES as number]: '/api/leave-type-assignment-detach/leave_type',
    }[leaveTypeAssignmentTab.value as number] ?? '';
})
const leaveTypeAssignmentBatchDetachForm = computed(() => {
    let form:{
        account_id: number,
        company_id: number,
        selectedMorphables?: number[],
    } = {
        account_id: selectedAssociatedCompanyAccountId.value as number,
        company_id: selectedAssociatedCompanyId.value as number,
    }

    if(leaveTypeAssignmentTab.value == LEAVE_TYPE_ASSIGNMENT_TAB.CREATE_LEAVE_TYPE_ASSIGNMENTS){
        form = {
            ...form,
            selectedMorphables: selectedEmployees.value,
        }
    }

    if(leaveTypeAssignmentTab.value == LEAVE_TYPE_ASSIGNMENT_TAB.MANAGE_ASSIGNED_LEAVE_TYPES){
        form = {
            ...form,
            selectedMorphables: selectedLeaveTypes.value
        }
    }

    return form;
})
const submitLeaveTypeAssignmentBatchDetach = async () => {

    leaveTypeAssignmentPending.value = true;

    await laraFetch(leaveTypeAssignmentBatchDetachPath.value, {
        method: 'POST',
        body: leaveTypeAssignmentBatchDetachForm.value,
    },{
        onRequestError: (request, options, error) => {
            leaveTypeAssignmentPending.value = false;
        },
        onResponse: () => {
            leaveTypeAssignmentPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: 'Leave types cleared successfully.',
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            resetLeaveTypeAssignment();

            if(leaveTypeAssignmentTab.value == LEAVE_TYPE_ASSIGNMENT_TAB.CREATE_LEAVE_TYPE_ASSIGNMENTS){
                await nextTick();

                employeeSelectionReference.value?.paginate(1, true);
            }

            if(leaveTypeAssignmentTab.value == LEAVE_TYPE_ASSIGNMENT_TAB.MANAGE_ASSIGNED_LEAVE_TYPES){
                await nextTick();

                leaveTypeSelectionReference.value?.paginate(1, true);
            }
        }
    });
};

const updateLeaveTypeSettingsForm = computed(() => {
    let form: {
        account_id: number,
        company_id: number,
        override_balance_upon_eligibility: number,
        balance_upon_eligibility?: number,
    } = {
        account_id: selectedAssociatedCompanyAccountId.value as number,
        company_id: selectedAssociatedCompanyId.value as number,
        override_balance_upon_eligibility: overrideBalanceUponEligibility.value,
    }

    if(overrideBalanceUponEligibility.value == 1){
        form = {...form, balance_upon_eligibility: balanceUponEligibility.value,}
    }

    return form;
})
const submitUpdateLeaveTypeAssignment = async () => {

    if(!stagedLeaveTypeAssignmentId.value){
        return;
    }

    updateLeaveTypeSettingsPending.value = true;

    await laraFetch(`/api/leave-type-assignment/${stagedLeaveTypeAssignmentId.value}`, {
        method: 'PATCH',
        body: updateLeaveTypeSettingsForm.value,
    },{
        onRequestError: (request, options, error) => {
            updateLeaveTypeSettingsPending.value = false;
        },
        onResponse: () => {
            updateLeaveTypeSettingsPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: 'Leave type settings updated successfully.',
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            resetLeaveTypeAssignment();

            await nextTick();

            leaveTypeAssignmentsReference.value?.paginate(1, true);
        }
    });
}
</script>

<style scoped>

</style>