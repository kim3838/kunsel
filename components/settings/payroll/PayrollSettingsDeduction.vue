<template>
    <div class="scaffold-border-left-bottom-right">
        <div class="flex space-x-1 p-[20px]">
            <Button class="inline-block" :icon="'mdi:plus'" :size="'sm'" :label="'Create'" :disabled="disableActions" @click="create"/>
            <Button :variant="'outline'" :icon="'mdi:delete-outline'" class="inline-block" :size="'sm'" :label="'Delete selected'" :disabled="disableActions" @click="deleteSelected"/>
        </div>

        <DeductionModal
            v-model:creatingOrEditing="creatingOrEditing"
            v-model:editPayload="editPayload"
            @resolved="deductionResolved"
        ></DeductionModal>

        <FansyFrame>
            <template v-slot:content>
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

const deductionsHeaders = reactive<TableHeaderT[]>([
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
        deductionsExecute();
    }
})

const deductionsData = ref<SequenceablePayrollComponent[]>([]);
const deductionsPending = ref(false);
const selectedDeductions = ref([]);

const disableActions = computed(() => {
    return deductionsPending.value || creatingOrEditing.value || deductionsReOrderPending.value || deleting.value;
});
const disableDataTable = computed(() => {
    return deductionsPending.value || deleting.value
})

const deductionsExecute = async () => {
    deductionsPending.value = true;

    await laraFetch("/api/deductions", {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompany.value,
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

    deleting.value = false;
}
</script>

<style scoped>

</style>