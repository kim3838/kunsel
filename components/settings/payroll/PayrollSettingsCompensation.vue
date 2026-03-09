<template>
    <div class="lining-shadow rounded-sm tint-background">

        <div class="lining-shadow rounded-t-sm text-lg font-medium font-header px-4 py-2">Earnings</div>

        <div class="p-4 space-y-2">
            <div v-if="userIsSuperAdmin" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                <Button class="inline-block" :variant="'outline'" :icon="'mdi:plus'" :size="'sm'" :disabled="disableActions" @click="create"/>
                <Button v-if="compensationsSuccessful" :variant="'outline'" :icon="'mdi:delete-outline'" class="inline-block" :size="'sm'" :disabled="disableActions" @click="confirmDeleteSelected"/>
                <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
            </div>

            <CompensationModal
                v-model:creatingOrEditing="creatingOrEditing"
                v-model:editPayload="editPayload"
                @resolved="compensationResolved"
            ></CompensationModal>

            <div>
                <div v-if="!compensationsSuccessful" class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                    <Label invert :size="'md'" :type="'danger'" :label="compensationsMessage" />
                </div>

                <DataTable
                    v-if="compensationsSuccessful"
                    :headers="compensationsHeaders"
                    :size="'lg'"
                    :rows="compensationsData"
                    :disabled="disableDataTable"
                    v-model="selectedCompensations"
                    :manual-sortable="userIsSuperAdmin"
                    @manualSorted="manualSorted"
                    :selection="userIsSuperAdmin">
                    <template v-slot:cell.type="{cell,slot}">
                        <div class="p-[3px]">{{cell.type.text}}</div>
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
                        <div class="flex items-center">
                            <NavDrop
                                v-if="cell.assignable || userIsSuperAdmin"
                                class="z-10"
                                :disabled="disableActions"
                                :parent-icon="'ic:baseline-arrow-right'"
                                in-horizontal-scrollable
                                :size="`sm`"
                                :drop-shadow-size="`lg`"
                                :title="'Menu'"
                                :drop-align="'top'"
                                :drop-justify="'right'"
                                :drop-options="[
                                {type: 'action',icon: 'mdi:pen',title: 'Edit',callback: () => edit(cell),},
                            ]">
                            </NavDrop>
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

const compensationsHeaders = computed<TableHeaderT[]>(() => {
    return [
        ...(userIsSuperAdmin.value ? [
            { text: 'Order', value: 'order', alignData: 'center'},
            { text: '', alignData: 'left', value: 'actions'},
        ] : []),
        { text: 'Code', value: 'code', minWidth: '244px'},
        { text: 'Name', value: 'name', minWidth: '244px'},
        { text: 'Type', value: 'type', minWidth: '244px'},
        { text: 'Assignable', value: 'assignable'},
        { text: 'Formula', value: 'formula', minWidth: '244px'},
    ] as TableHeaderT[];
});

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        compensationsExecute();
    }
})

const compensationsData = ref<SequenceablePayrollComponent[]>([]);
const compensationsSuccessful = ref(true);
const compensationsMessage = ref('');
const compensationsPending = ref(false);
const selectedCompensations = ref([]);

const disableActions = computed(() => {
    return compensationsPending.value || creatingOrEditing.value || compensationsReOrderPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return compensationsPending.value || deleting.value || companyAssociationPendingState().value;
})

const compensationsExecute = async () => {

    if(import.meta.server){return;}

    compensationsPending.value = true;

    await laraFetch("/api/compensations", {
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
            compensationsPending.value = false;
        },
        onResponse: (request, options, response) => {
            compensationsPending.value = false;
            compensationsSuccessful.value = _get(response, '_data.successful', false);
            compensationsMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            compensationsData.value = _get(response, '_data.values.compensations', []);
        }
    }, false);
}
compensationsExecute();

const compensationsReOrderPending = ref(false);
const compensationsReOrderExecute = async () => {
    compensationsReOrderPending.value = true;

    const orderables = compensationsData.value.map((item) => {
        return {id: item.id, order: item.order}
    });

    await laraFetch("/api/orderable/re-order/compensation", {
        method: 'POST',
        params: {
            orderables: JSON.stringify(orderables),
        }
    },{
        onRequestError: () => {
            compensationsReOrderPending.value = false;
        },
        onResponse: () => {
            compensationsReOrderPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            await compensationsExecute();
        }
    });
}

const creatingOrEditing = ref(false);
const deleting = ref(false);
const editPayload = ref({});

const manualSorted = async () => {
    compensationsPending.value = true;
    orderSequenceable(compensationsData.value);
    await compensationsReOrderExecute();
}

const compensationResolved = async () => {
    creatingOrEditing.value = false;
    editPayload.value = {};
    await compensationsExecute();
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

    const selectedIds = selectedCompensations.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected compensation to delete.`,
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
        message: `Confirm delete selected compensation${selectedIds.length > 1 ? 's' : ''}?`,
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

    selectedIds = selectedCompensations.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/compensations", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            compensation_ids: selectedIds,
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
                message: `Compensation${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedCompensations.value = [];
    await compensationsExecute();
    orderSequenceable(compensationsData.value);
    await compensationsReOrderExecute();
    await fetchPayrollComponentNameSelections();
}
</script>

<style scoped>

</style>