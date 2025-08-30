<template>
    <div class="space-y-2">
        <div class="px-[20px] pt-2">
            <div class="text-lg font-header">Earnings</div>
            <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                <Button class="inline-block" :icon="'mdi:plus'" :size="'sm'" :disabled="disableActions" @click="create"/>
                <Button :variant="'outline'" :icon="'mdi:delete-outline'" class="inline-block" :size="'sm'" :disabled="disableActions" @click="deleteSelected"/>
            </div>
        </div>

        <CompensationModal
            v-model:creatingOrEditing="creatingOrEditing"
            v-model:editPayload="editPayload"
            @resolved="compensationResolved"
        ></CompensationModal>

        <div class="px-[20px]">
            <UnorderedList
                v-if="disableActions"
                :icon="'eos-icons:loading'"
                :size="'md'"
                :label="'Please wait...'"/>
            <DataTable
                :headers="compensationsHeaders"
                :size="'lg'"
                :rows="compensationsData"
                :disabled="disableDataTable"
                v-model="selectedCompensations"
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
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);
const orderSequenceable = nuxtApp.$orderSequenceable as (data: Sequenceable[]) => void;

const compensationsHeaders = reactive<TableHeaderT[]>([
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
        compensationsExecute();
    }
})

const compensationsData = ref<SequenceablePayrollComponent[]>([]);
const compensationsPending = ref(false);
const selectedCompensations = ref([]);

const disableActions = computed(() => {
    return compensationsPending.value || creatingOrEditing.value || compensationsReOrderPending.value || deleting.value;
});
const disableDataTable = computed(() => {
    return compensationsPending.value || deleting.value
})

const compensationsExecute = async () => {

    if(import.meta.server){return;}

    compensationsPending.value = true;

    await laraFetch("/api/compensations", {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompanyId.value,
            }
        }
    },{
        onRequestError: () => {
            compensationsPending.value = false;
        },
        onResponse: () => {
            compensationsPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            compensationsData.value = _get(response, '_data.values.compensations', []);
        }
    });
}
await compensationsExecute();

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

    const selectedIds = selectedCompensations.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    let batchDelete: Promise<any>[] = [];

    selectedIds.forEach((id) => {
        batchDelete.push(
            new Promise((resolve, reject) => {
                laraFetch(`/api/compensation/${id}`, {
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
    selectedCompensations.value = [];
    await compensationsExecute();
    orderSequenceable(compensationsData.value);
    await compensationsReOrderExecute();

    deleting.value = false;
}
</script>

<style scoped>

</style>