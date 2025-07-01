<template>
    <div class="scaffold-border-left-bottom-right">
        <div class="flex space-x-1 p-[20px]">
            <Button class="inline-block" :icon="'mdi:plus'" :size="'sm'" :label="'Create'" :disabled="disableActions" @click="create"/>
            <Button :variant="'outline'" :icon="'mdi:delete-outline'" class="inline-block" :size="'sm'" :label="'Delete selected'" :disabled="disableActions" @click="deleteSelected"/>
        </div>

        <CompensationModal
            v-model:creatingOrEditing="creatingOrEditing"
            v-model:editPayload="editPayload"
            @resolved="compensationResolved"
        ></CompensationModal>

        <FansyFrame>
            <template v-slot:content>
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
                    <template v-slot:cell.settings="{cell}">
                        <table class="border-separate text-sm font-sub-data">
                            <tbody>
                            <tr v-for="(setting, key) in cell.settings">
                                <td>{{ setting.label }}</td><td class="pl-1">{{ setting.readable }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </template>
                    <template v-slot:cell.actions="{cell, slot, scrollReference}">
                        <Button class="mx-0.5" type="button" :size="slot.buttonSize" :icon="'mdi:pen'" :label="'Edit'" @click="edit(cell)" :disabled="disableActions"></Button>
                    </template>
                </DataTable>
            </template>
        </FansyFrame>
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
    selectedAssociatedCompany
} = storeToRefs(nuxtApp.$authStore);
const orderSequenceable = nuxtApp.$orderSequenceable as (data: Sequenceable[]) => void;

const compensationsHeaders = reactive<TableHeaderT[]>([
    { text: 'Order', value: 'order', alignData: 'center'},
    { text: '', alignData: 'left', value: 'actions'},
    { text: 'Name', value: 'name'},
    { text: 'Type', value: 'type'},
    { text: 'Assignable', value: 'assignable'},
    { text: 'Formula', value: 'formula'},
    { text: 'Settings', value: 'settings'},
]);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value){
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
    compensationsPending.value = true;

    await laraFetch("/api/compensations", {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompany.value,
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