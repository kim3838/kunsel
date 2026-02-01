<template>
    <div class="lining-shadow rounded-sm tint-background space-y-2">

        <div class="lining-shadow rounded-t-sm text-lg px-4 py-2">Tax</div>

        <div class="p-4 space-y-2">
            <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                <Button class="inline-block" :variant="'outline'" :icon="'mdi:plus'" :size="'sm'" :disabled="disableActions" @click="create"/>
                <Button v-if="incomeTaxesSuccessful" :variant="'outline'" :icon="'mdi:delete-outline'" class="inline-block" :size="'sm'" :disabled="disableActions" @click="confirmDeleteSelected"/>
                <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
            </div>

            <IncomeTaxModal
                v-model:creatingOrEditing="creatingOrEditing"
                v-model:editPayload="editPayload"
                @resolved="incomeTaxResolved"
            ></IncomeTaxModal>

            <div>
                <div v-if="!incomeTaxesSuccessful" class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                    <Label invert :size="'md'" :type="'danger'" :label="incomeTaxesMessage" />
                </div>

                <DataTable
                    v-if="incomeTaxesSuccessful"
                    :headers="incomeTaxesHeaders"
                    :size="'lg'"
                    :rows="incomeTaxesData"
                    :disabled="disableDataTable"
                    v-model="selectedIncomeTaxes"
                    manual-sortable
                    @manualSorted="manualSorted"
                    selection>
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
const {isAuthenticated} = useAuth();
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

const incomeTaxesHeaders = reactive<TableHeaderT[]>([
    { text: 'Order', value: 'order', alignData: 'center'},
    { text: '', alignData: 'left', value: 'actions'},
    { text: 'Code', value: 'code', minWidth: '244px'},
    { text: 'Name', value: 'name', minWidth: '244px'},
    { text: 'Type', value: 'type', minWidth: '244px'},
    { text: 'Assignable', value: 'assignable'},
    { text: 'Formula', value: 'formula', minWidth: '244px'},
]);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        incomeTaxesExecute();
    }
})

const incomeTaxesData = ref<SequenceablePayrollComponent[]>([]);
const incomeTaxesSuccessful = ref(true);
const incomeTaxesMessage = ref('');
const incomeTaxesPending = ref(false);
const selectedIncomeTaxes = ref([]);

const disableActions = computed(() => {
    return incomeTaxesPending.value || creatingOrEditing.value || incomeTaxesReOrderPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return incomeTaxesPending.value || deleting.value || companyAssociationPendingState().value;
})

const incomeTaxesExecute = async () => {

    if(import.meta.server){return;}

    incomeTaxesPending.value = true;

    await laraFetch("/api/income-taxes", {
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
            incomeTaxesPending.value = false;
        },
        onResponse: (request, options, response) => {
            incomeTaxesPending.value = false;
            incomeTaxesSuccessful.value = _get(response, '_data.successful', false);
            incomeTaxesMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            incomeTaxesData.value = _get(response, '_data.values.income_taxes', []);
        }
    }, false);
}
incomeTaxesExecute();

const incomeTaxesReOrderPending = ref(false);
const incomeTaxesReOrderExecute = async () => {
    incomeTaxesReOrderPending.value = true;

    const orderables = incomeTaxesData.value.map((item) => {
        return {id: item.id, order: item.order}
    });

    await laraFetch("/api/orderable/re-order/income_tax", {
        method: 'POST',
        params: {
            orderables: JSON.stringify(orderables),
        }
    },{
        onRequestError: () => {
            incomeTaxesReOrderPending.value = false;
        },
        onResponse: () => {
            incomeTaxesReOrderPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            await incomeTaxesExecute();
        }
    });
}

const creatingOrEditing = ref(false);
const deleting = ref(false);
const editPayload = ref({});

const manualSorted = async () => {
    incomeTaxesPending.value = true;
    orderSequenceable(incomeTaxesData.value);
    await incomeTaxesReOrderExecute();
}

const incomeTaxResolved = async () => {
    creatingOrEditing.value = false;
    editPayload.value = {};
    await incomeTaxesExecute();
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

    const selectedIds = selectedIncomeTaxes.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected income tax to delete.`,
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
        message: `Confirm delete selected income tax${selectedIds.length > 1 ? 's' : ''}?`,
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

    selectedIds = selectedIncomeTaxes.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/income-taxes", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            income_tax_ids: selectedIds,
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
                message: `Income tax${selectedIds.length > 1 ? 'es' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedIncomeTaxes.value = [];
    await incomeTaxesExecute();
    orderSequenceable(incomeTaxesData.value);
    await incomeTaxesReOrderExecute();
    await fetchPayrollComponentNameSelections();
}
</script>

<style scoped>

</style>