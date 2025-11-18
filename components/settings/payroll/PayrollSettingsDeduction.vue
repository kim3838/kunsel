<template>
    <div class="space-y-2">
        <div class="px-[20px] pt-2">
            <div class="text-lg font-header">Deductions</div>
            <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                <Button class="inline-block" :icon="'mdi:plus'" :size="'sm'" :disabled="disableActions" @click="create"/>
                <Button :variant="'outline'" :icon="'mdi:delete-outline'" class="inline-block" :size="'sm'" :disabled="disableActions" @click="deleteSelected"/>
            </div>
        </div>

        <DeductionModal
            v-model:creatingOrEditing="creatingOrEditing"
            v-model:editPayload="editPayload"
            @resolved="deductionResolved"
        ></DeductionModal>

        <div class="px-[20px]">
            <UnorderedList
                v-if="disableActions"
                :icon="'eos-icons:loading'"
                :size="'md'"
                :label="'Please wait...'"/>
            <DataTable
                :headers="deductionsHeaders"
                :size="'lg'"
                :rows="deductionsData"
                :disabled="disableDataTable"
                v-model="selectedDeductions"
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
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);
const orderSequenceable = nuxtApp.$orderSequenceable as (data: Sequenceable[]) => void;

const deductionsHeaders = reactive<TableHeaderT[]>([
    { text: 'Order', value: 'order', alignData: 'center'},
    { text: '', alignData: 'left', value: 'actions'},
    { text: 'Code', value: 'code'},
    { text: 'Name', value: 'name'},
    { text: 'Type', value: 'type'},
    { text: 'Assignable', value: 'assignable'},
    { text: 'Formula', value: 'formula'},
]);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        deductionsExecute();
    }
})

const deductionsData = ref<SequenceablePayrollComponent[]>([]);
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
            filters: {
                'company_id': selectedAssociatedCompanyId.value,
            }
        }
    },{
        onRequestError: () => {
            deductionsPending.value = false;
        },
        onResponse: () => {
            deductionsPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            deductionsData.value = _get(response, '_data.values.deductions', []);
        }
    });
}
await deductionsExecute();

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

const deleteSelected = async () => {
    const selectedIds = selectedDeductions.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    let batchDelete: Promise<any>[] = [];

    selectedIds.forEach((id) => {
        batchDelete.push(
            new Promise((resolve, reject) => {
                laraFetch(`/api/deduction/${id}`, {
                    method: 'DELETE',
                },{
                    onRequestError: (request, options, error) => {
                        reject(error);
                    },
                    onResponse: (request, options, response) => {
                        resolve(response);
                    }
                })
            })
        );
    });

    await Promise.all(batchDelete);
    selectedDeductions.value = [];
    await deductionsExecute();
    orderSequenceable(deductionsData.value);
    await deductionsReOrderExecute();
    await fetchPayrollComponentNameSelections();

    deleting.value = false;
}
</script>

<style scoped>

</style>