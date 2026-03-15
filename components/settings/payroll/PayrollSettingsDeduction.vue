<template>
    <div class="lining-shadow rounded-sm tint-background">

        <div class="lining-shadow rounded-t-sm text-lg font-medium font-header px-4 py-2">Deductions</div>

        <div class="p-4 space-y-2">
            <div v-if="userIsSuperAdmin" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                <Button class="inline-block" :variant="'outline'" :icon="'mdi:plus'" :size="'sm'" :disabled="disableActions" @click="create"/>
                <Button v-if="deductionsSuccessful" :variant="'outline'" :icon="'mdi:delete-outline'" class="inline-block" :size="'sm'" :disabled="disableActions" @click="confirmDeleteSelected"/>
                <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
            </div>

            <DeductionModal
                v-model:creatingOrEditing="creatingOrEditing"
                v-model:editPayload="editPayload"
                @resolved="deductionResolved"
            ></DeductionModal>

            <div>

                <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>

                <div v-if="!deductionsSuccessful" class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                    <Label invert :size="'md'" :type="'danger'" :label="deductionsMessage" />
                </div>

                <DataTable
                    v-if="deductionsSuccessful"
                    :headers="deductionsHeaders"
                    :size="'lg'"
                    :rows="deductionsData"
                    :disabled="disableDataTable"
                    v-model="selectedDeductions"
                    :manual-sortable="userIsSuperAdmin"
                    @manualSorted="manualSorted"
                    :selection="userIsSuperAdmin">
                    <template v-slot:cell.type="{cell,slot}">
                        <div class="p-[3px]">{{cell.type.text}}</div>
                    </template>
                    <template v-slot:cell.component_sub_type="{cell, slot, scrollReference}">
                        <div class="p-[3px]">{{cell.component_sub_type?.text}}</div>
                    </template>
                    <template v-slot:cell.assignable="{cell, slot, scrollReference}">
                        <div class="flex justify-center">
                            <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="cell.assignable" ></NonModelCheckBox>
                        </div>
                    </template>
                    <template v-slot:cell.global="{cell, slot, scrollReference}">
                        <div class="flex justify-center">
                            <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="!cell.assignable" ></NonModelCheckBox>
                        </div>
                    </template>
                    <template v-slot:cell.actions="{cell, slot, scrollReference}">
                        <div class="text-base h-[32px] px-2 gap-0.5 flex items-center justify-center cursor-pointer accent-hover" @click="edit(cell)">
                            <span class="font-narrow-thin">Edit</span>
                            <Icon class="h-5 w-5" :name="'gg:external'"/>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {Sequenceable, TableHeaderT} from "@/public/js/types/data";
import type {SequenceablePayrollComponent} from "@/public/js/types/payroll-component";
import {storeToRefs} from "pinia";
const {isAuthenticated, userIsSuperAdmin} = useAuth();
const {fetchPayrollComponentNameSelections} = useCommon();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);
const orderSequenceable = nuxtApp.$orderSequenceable as (data: Sequenceable[]) => void;

const deductionsHeaders = computed<TableHeaderT[]>(() => {
    return [
        ...(userIsSuperAdmin.value ? [
            { text: 'Order', value: 'order', alignData: 'center'},
            { text: '', alignData: 'left', value: 'actions'},
        ] : []),
        { text: 'Code', value: 'code', minWidth: '244px'},
        { text: 'Name', value: 'name', minWidth: '144px'},
        { text: 'Type', value: 'type', minWidth: '144px'},
        { text: 'Assignable', value: 'assignable'},
        { text: 'Formula', value: 'formula', minWidth: '144px'},
    ] as TableHeaderT[];
});

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        deductionsExecute();
    }
})

const deductionsData = ref<SequenceablePayrollComponent[]>([]);
const deductionsSuccessful = ref(true);
const deductionsMessage = ref('');
const deductionsPending = ref(false);
const selectedDeductions = ref([]);

const disableActions = computed(() => {
    return deductionsPending.value || creatingOrEditing.value || deductionsReOrderPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return deductionsPending.value || deleting.value || companyAssociationPendingState().value;
})

const deductionsExecute = async () => {

    if(import.meta.server){return;}

    deductionsPending.value = true;

    await laraFetch("/api/deductions", {
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
            deductionsPending.value = false;
        },
        onResponse: (request, options, response) => {
            deductionsPending.value = false;
            deductionsSuccessful.value = _get(response, '_data.successful', false);
            deductionsMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            deductionsData.value = _get(response, '_data.values.deductions', []);
        }
    }, false);
}
deductionsExecute();

const deductionsReOrderPending = ref(false);
const deductionsReOrderExecute = async () => {
    deductionsReOrderPending.value = true;

    const orderables = deductionsData.value.map((item) => {
        return {id: item.id, order: item.order}
    });

    await laraFetch("/api/orderable/re-order/deduction", {
        method: 'POST',
        params: {
            orderables: JSON.stringify(orderables),
        }
    },{
        onRequestError: () => {
            deductionsReOrderPending.value = false;
        },
        onResponse: () => {
            deductionsReOrderPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            await deductionsExecute();
        }
    });
}

const creatingOrEditing = ref(false);
const deleting = ref(false);
const editPayload = ref({});

const manualSorted = async () => {
    deductionsPending.value = true;
    orderSequenceable(deductionsData.value);
    await deductionsReOrderExecute();
}

const deductionResolved = async () => {
    creatingOrEditing.value = false;
    editPayload.value = {};
    await deductionsExecute();
    await fetchPayrollComponentNameSelections();
}

const create = () => {
    creatingOrEditing.value = true;
    editPayload.value = {};
};

const edit = (cell: SequenceablePayrollComponent) => {
    creatingOrEditing.value = true;
    editPayload.value = cell;
}

const confirmDeleteSelected = () => {

    const selectedIds = selectedDeductions.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected deduction to delete.`,
            action: {
                callback: () => {},
                label: 'Okay'
            }
        });

        return false;
    }

    useNuxtApp().$promptStore.setPrompt({
        resetable: true,
        icon: null,
        title: 'Confirm Action',
        message: `Confirm delete selected deduction${selectedIds.length > 1 ? 's' : ''}?`,
        action: {
            callback: async () => {
                await deleteSelected();
            },
            label: 'Yes'
        }
    });
}
const deleteSelected = async () => {

    let selectedIds: number[] = [];

    selectedIds = selectedDeductions.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/deductions", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            deduction_ids: selectedIds,
        },
    },{
        onRequestError: (request, options, error) => {
            deleting.value = false;
        },
        onResponse: () => {
            deleting.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: `Deduction${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedDeductions.value = [];
    await deductionsExecute();
    orderSequenceable(deductionsData.value);
    await deductionsReOrderExecute();
    await fetchPayrollComponentNameSelections();
}
</script>

<style scoped>

</style>