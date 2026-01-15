<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <DialogModal
                    :max-width="'980px'"
                    :show="editing"
                    :closeable="false">
                    <template #title>
                    </template>
                    <template #content>

                        <div class="space-y-2">

                            <fieldset class="neutral-border px-2 pb-2 space-y-4">
                                <legend class="text-lg font-header">Approval Sequence</legend>

                                <div>{{_get(editPayload, 'request_title', null)}}</div>

                                <div class="mb-2 flex items-center min-h-8">
                                    <Button class="w-min" :disabled="disableActions" :variant="'outline'" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="'Add Approver'" @click="addApprover"></Button>
                                </div>

                                <DataTable
                                    :headers="approverSequenceHeaders"
                                    :disabled="disableActions"
                                    :size="'lg'"
                                    :stripped="false"
                                    :rows="approverSequence">
                                    <template v-slot:cell.actions="{cell,slot, headerIndex, rowIndex}">
                                        <div class="h-[32px] mx-0.5 space-x-0.5 w-full flex items-center">
                                            <Button
                                                class="w-min"
                                                :variant="'outline'"
                                                :size="slot.buttonSize"
                                                :disabled="disableActions"
                                                :icon="'mdi:delete-forever'"
                                                @click="deleteApprovalSequence(rowIndex, cell.id)"/>
                                        </div>
                                    </template>
                                    <template v-slot:cell.set_approver="{cell, slot, scrollReference, rowIndex}">
                                        <div class="h-[32px] mx-0.5 space-x-0.5 w-full flex items-center">
                                            <Button
                                                class="w-min"
                                                :size="slot.buttonSize"
                                                :disabled="disableActions"
                                                :icon="cell.approver_id === null ? 'mdi:plus' : 'mdi:button-cursor'"
                                                :label="cell.approver_id === null ? 'Select' : 'Reselect'"
                                                @click="setOrChangeApprover(rowIndex, cell)"/>
                                        </div>
                                    </template>
                                    <template v-slot:cell.approver="{cell, slot, scrollReference}">
                                        <div class="mx-0.5">
                                            {{cell.approver_name}}
                                        </div>
                                    </template>
                                    <template v-slot:cell.company_assignment_type="{cell,slot}">
                                        <div class="px-[3px]">
                                            <span v-if="cell.company_assignment_type?.value">{{cell.company_assignment_type?.text}}</span>
                                        </div>
                                    </template>
                                    <template v-slot:cell.account_roles_summary="{cell,slot}">
                                        <div class="p-[3px] flex items-center gap-1">
                                            <div>{{cell.account_roles_summary?.value}}</div>
                                            <div v-if="cell.account_roles_summary?.extender" class="text-xs font-sans">{{cell.account_roles_summary?.extender}}</div>
                                        </div>
                                    </template>
                                </DataTable>

                                <pre>{{approverSequence}}</pre>
                            </fieldset>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex space-x-2 justify-between">
                            <div class="space-x-2 inline-flex">
                                <div class="space-x-2 inline-flex items-center">
                                    <UnorderedList
                                        v-if="modalDisableActions"
                                        :icon="'eos-icons:loading'"
                                        :size="'md'"
                                        :label="'Please wait...'"/>
                                </div>
                            </div>
                            <div class="space-x-2 inline-flex items-center">
                                <Button
                                    :variant=" 'outline'"
                                    @click="closeEdit"
                                    :label="'Close'" />
                                <Button
                                    class="w-min"
                                    :variant="'default'"
                                    :size="'md'"
                                    :icon="`ic:sharp-save`"
                                    :disabled="modalDisableActions"
                                    :label="`Save`"
                                    @click="submit"/>
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <DialogModal
                    :show="showSelectUserAsApprover"
                    :landscape="true"
                    :content-padding="'0'">
                    <template #title>
                    </template>
                    <template #content>
                        <div class="px-3 pt-4 pb-2.5">
                            <div class="mx-auto max-w-screen-xl space-y-4">
                                <fieldset class="neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">Select Approver</legend>

                                    <Suspense>
                                        <CompanyUserSelection
                                            ref="userSelectionReference"
                                            compact
                                            :single-select="true"
                                            :clear-selection-on-form-submit="false"
                                            :selected-label="'User Selected'"
                                            :disable-actions="disableActions"
                                            v-model:pending="userSelectionPending"
                                            v-model:selected="selectedModalUsers"/>

                                        <template #fallback>
                                            <div>
                                                <UnorderedList
                                                    :icon="'eos-icons:loading'"
                                                    :size="'md'"
                                                    :label="'Loading user selections...'"/>
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
                                <div></div>
                                <div class="space-x-2 inline-flex items-center">
                                    <Button :disabled="disableUserModalSelectionActions" :variant="'outline'" :icon="'mdi:cancel'" @click="closeSetApprover" :label="'Cancel'" />
                                    <Button :disabled="disableUserModalSelectionActions || selectedModalUsers.length == 0" @click="confirmSetApprover" :label="'Select'" />
                                </div>
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Button
                            class="w-min"
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'ic:sharp-restart-alt'"
                            :disabled="disableActions"
                            @click="approvalSettingsExecute" />
                        <Label v-if="!approvalSettingsSuccessful" invert :size="'md'" :type="'danger'" :label="approvalSettingsMessage" />
                    </div>

                    <DataTable
                        v-if="approvalSettingsSuccessful"
                        :key="approvalSettingKey"
                        :headers="approvalSettingsHeaders"
                        :size="'lg'"
                        :rows="approvalSettingsData"
                        :disabled="disableDataTable"
                        :sub-row-slug="'approvers'"
                        :sub-row-settings="{
                            type: DATATABLE_SUBROW_TYPE.TITLED,
                            containerPaddingTop: 0.75,
                            containerPaddingBottom: 1.75,
                            titleSize: 'md',
                            rowVerticalLine: true,
                            verticalBorderType: 'dashed',
                            horizontalBorderType: 'dashed',
                        }">
                        <template v-slot:cell.actions="{cell, slot, scrollReference}">
                            <div class="text-base h-[32px]">
                                <div class="h-full flex items-center px-2 cursor-pointer accent-hover" @click="edit(cell)">
                                    <span class="text-base font-sans">Edit</span>
                                </div>
                            </div>
                        </template>
                        <template v-slot:sub_row_slot="{rowIndex, cell, slot}">
                            <div class="inline-flex items-center scaffold-border pr-2">
                                <Icon name="mdi:info-variant" :class="[slot.iconSizeClass]" /><div :class="[slot.titleSizeClass]">Approval Sequence</div>
                            </div>
                            <ApprovalSettingSubRow
                                :rows="cell[slot.slug]"
                                :disabled="disableDataTable"
                            ></ApprovalSettingSubRow>
                        </template>
                    </DataTable>
                </div>

            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {EnumSelection, StringEnumInterface} from "@/public/js/common/type";
import type {ApprovalSettingApproverT, ApprovalSettingT} from "@/public/js/types/request-approval";
import type {Sequenceable, TableHeaderT, TableRowT} from "@/public/js/types/data";
import type {UserSelectionInstance} from "@/public/js/types/component-instance";
import type {CompanyUserSelectionT} from "@/public/js/types/user";

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Approval Setting`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {screenWidthBreakpoint, width: screenWidth} = useScreen();
const coreStore = useCoreStore();
const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const orderSequenceable = nuxtApp.$orderSequenceable as (data: Sequenceable[]) => void;
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        approvalSettingsExecute();
    }
});

const approvalSettingsHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'actions'},
    { text: 'Request approval setting', value: 'request_title'},
]);
const approvalSettingKey = ref(0);
const approvalSettingsData = ref<ApprovalSettingT[]>([]);
const approvalSettingsSuccessful = ref(true);
const approvalSettingsMessage = ref('');
const approvalSettingsPending = ref(false);
const approvalSettingsExecute = async () => {

    if(import.meta.server){return;}

    approvalSettingsPending.value = true;

    await laraFetch("/api/approval-settings", {
        method: 'GET',
        params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            filters: {
                'company_id': selectedAssociatedCompanyId.value,
            }
        }
    },{
        onRequestError: () => {
            approvalSettingsPending.value = false;
        },
        onResponse: (request, options, response) => {
            approvalSettingsPending.value = false;
            approvalSettingsSuccessful.value = _get(response, '_data.successful', false);
            approvalSettingsMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            approvalSettingsData.value = _get(response, '_data.values.approval_settings', []) as ApprovalSettingT[];
            approvalSettingKey.value += 1;
        }
    }, false);
}
await approvalSettingsExecute();

const disableActions = computed(() => {
    return approvalSettingsPending.value || companyAssociationPendingState().value;
});
const disableUserModalSelectionActions = computed(() => {
    return disableActions.value || userSelectionPending.value || userSelectionReferencePending.value || companyAssociationPendingState().value;
})
const disableDataTable = computed(() => {
    return approvalSettingsPending.value || companyAssociationPendingState().value;
});

const editing = ref(false);
const editPending = ref(false);
const editModalLoading = ref(false);
const editPayload = ref<Partial<ApprovalSettingT>>({});

const approverSequenceHeaders = reactive<TableHeaderT[]>([
    {text: '', value: 'actions', minWidth: '41.38px', width: '41.38px', maxWidth: '41.38px'},
    {text: 'Order', value: 'order', alignData: 'left'},
    {text: '', value: 'set_approver', alignData: 'left'},
    {text: 'Username', value: 'approver_username', alignData: 'left'},
    {text: 'Employee #', value: 'company_employee_number', alignData: 'left'},
    {text: 'Name', value: 'company_employee_full_name', alignData: 'left'},
    {text: 'Company Assignment', value: 'company_assignment_type', alignData: 'left'},
    {text: 'Account roles', value: 'account_roles_summary', alignData: 'left'},
]);

const approverSequence = ref<ApprovalSettingApproverT[]>([]);

const splicedApproverSequence = ref<number[]>([]);
const setApproverOnApprovalSequenceRowIndexFlag = ref(-1);
const showSelectUserAsApprover = ref(false);

const deleteApprovalSequence = (index: number, id: string | number | undefined) => {
    approverSequence.value.splice(index, 1);

    if(id){
        let splicedId = id as number;
        splicedApproverSequence.value.push(splicedId);
    }

    let order = 1;

    approverSequence.value.forEach(item => {
        item.order = order;
        order += 1;
    });
}

const userSelectionReference = useTemplateRef<UserSelectionInstance>('userSelectionReference');
const userSelectionReferencePending = computed(() => {
    return !Boolean(userSelectionReference.value);
});

const userSelectionPending = ref(false);
const selectedModalUsers = ref<number[]>([]);

const setOrChangeApprover= (index: number, cell: TableRowT) => {

    let row = cell as ApprovalSettingApproverT;

    if(row.approver_id !== null){
        selectedModalUsers.value = [row.approver_id];
    }

    setApproverOnApprovalSequenceRowIndexFlag.value = index;

    showSelectUserAsApprover.value = true;
}
const closeSetApprover = () => {
    showSelectUserAsApprover.value = false;
    setApproverOnApprovalSequenceRowIndexFlag.value = -1;
    selectedModalUsers.value = [];
    userSelectionReference.value?.reset();
}
const confirmSetApprover = () => {

    let selected = userSelectionReference.value?.getSelectedData() as CompanyUserSelectionT[];

    if(!_isEmpty(selected)){

        let selectedCompanyUser = _first(selected) as CompanyUserSelectionT;
        let row = approverSequence.value[setApproverOnApprovalSequenceRowIndexFlag.value] as ApprovalSettingApproverT;

        row.approver_id = selectedCompanyUser.id;
        row.approver_username = selectedCompanyUser.username;
        row.company_employee_number = selectedCompanyUser.company_employee_number;
        row.company_employee_full_name = selectedCompanyUser.company_employee_full_name;
        row.company_assignment_type = selectedCompanyUser.company_assignment_type;
        row.account_roles_summary = selectedCompanyUser.account_roles_summary;
    }

    closeSetApprover();
}

const addApprover = () => {

    approverSequence.value.push({
        approval_setting_id: editPayload.value?.id as number,
        order: approverSequence.value.length + 1,
        approver_id: null,
    });
}

const edit = (cell: TableRowT) => {

    let row = cell as ApprovalSettingT;

    if(row){

        editing.value = true;

        editPayload.value = row;
        approverSequence.value = [...row.approvers];
    }
};

const resetEditable = () => {
    editPayload.value = {};
}

const closeEdit = () => {
    editing.value = false;
    resetEditable();
};

const modalDisableActions = computed(()=>{
    return  editPending.value
        || editModalLoading.value;
});

const modalForm = computed(()=>{
    return {
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        approval_setting_id: editPayload.value.id,
        approver_sequence: approverSequence.value,
    }
})
const submit = async() => {
    editPending.value = true;

    await laraFetch(`/api/approval-setting/${editPayload.value.id}`, {
        method: `PATCH`,
        body: modalForm.value,
    }, {
        onRequestError: () => {
            editPending.value = false;
        },
        onResponse: () => {
            editPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: `Approval setting updated.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            closeEdit();
            await approvalSettingsExecute();
        },
    });
}
</script>

<style scoped>

</style>