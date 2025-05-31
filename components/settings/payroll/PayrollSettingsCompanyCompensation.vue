<template>
    <div class="scaffold-border-left-bottom-right">
        <div class="space-x-1 p-[20px]">
            <Button class="inline-block" :size="'sm'" :label="'Create'" :disabled="disableActions" @click="create"/>
            <Button class="inline-block" :size="'sm'" :label="'Delete selected'" :disabled="disableActions" @click="deleteSelected"/>
        </div>

        <CompanyCompensationModal
            v-model:creatingOrEditing="creatingOrEditing"
            v-model:editPayload="editPayload"
            @resolved="compensationResolved"
        ></CompanyCompensationModal>

        <AccentFrame>
            <template #content>
                <div class="pt-5">
                    <UnorderedList
                        v-if="disableActions"
                        :icon="'eos-icons:loading'"
                        :size="'md'"
                        :label="'Please wait...'"/>
                    <DataTable
                        :headers="companyCompensationsHeaders"
                        :size="'lg'"
                        :rows="companyCompensationsData"
                        :disabled="disableDataTable"
                        v-model="selectedCompanyCompensations"
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
                                    <td>{{ setting.label }}</td><td class="pl-1">{{ setting.value }}</td>
                                </tr>
                                </tbody>
                            </table>
                        </template>
                        <template v-slot:cell.actions="{cell, slot, scrollReference}">
                            <Button class="mx-0.5" type="button" :size="slot.buttonSize" :label="'Edit'" @click="edit(cell)" :disabled="disableActions"></Button>
                        </template>
                    </DataTable>
                </div>
            </template>
        </AccentFrame>
        <div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {Sequenceable, TableHeaderT} from "@/public/js/types/data";
import type {SequenceableCompanyPayrollComponent} from "@/composables/settings/payroll/use-payroll-settings-company-compensation";
import {storeToRefs} from "pinia";
const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const {
    selectedAssociatedCompany
} = storeToRefs(nuxtApp.$authStore);
const orderSequenceable = nuxtApp.$orderSequenceable as (data: Sequenceable[]) => void;

const companyCompensationsHeaders = reactive<TableHeaderT[]>([
    { text: 'Order', value: 'order', alignData: 'center'},
    { text: 'Name', value: 'name'},
    { text: 'Type', value: 'type'},
    { text: 'Assignable', value: 'assignable'},
    { text: 'Global', value: 'global'},
    { text: 'Formula', value: 'formula'},
    { text: 'Settings', value: 'settings'},
    { text: '', alignData: 'left', value: 'actions'},
]);

watch(selectedAssociatedCompany, (newValue) => {
    if(isAuthenticated.value){
        companyCompensationsExecute();
    }
})

const companyCompensationsData = ref<SequenceableCompanyPayrollComponent[]>([]);
const companyCompensationsPending = ref(false);
const selectedCompanyCompensations = ref([]);

const disableActions = computed(() => {
    return companyCompensationsPending.value || creatingOrEditing.value || companyCompensationsReOrderPending.value || deleting.value;
});
const disableDataTable = computed(() => {
    return companyCompensationsPending.value || deleting.value
})

const companyCompensationsExecute = async () => {
    companyCompensationsPending.value = true;

    await laraFetch("/api/company/compensations", {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompany.value,
            }
        }
    },{
        onRequestError: () => {
            companyCompensationsPending.value = false;
        },
        onResponse: () => {
            companyCompensationsPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            companyCompensationsData.value = _get(response, '_data.values.compensations', []);
        }
    });
}
await companyCompensationsExecute();

const companyCompensationsReOrderPending = ref(false);
const companyCompensationsReOrderExecute = async () => {
    companyCompensationsReOrderPending.value = true;

    const orderables = companyCompensationsData.value.map((item) => {
        return {id: item.id, order: item.order}
    });

    await laraFetch("/api/orderable/re-order/compensation", {
        method: 'POST',
        params: {
            orderables: JSON.stringify(orderables),
        }
    },{
        onRequestError: () => {
            companyCompensationsReOrderPending.value = false;
        },
        onResponse: () => {
            companyCompensationsReOrderPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            await companyCompensationsExecute();
        }
    });
}

const creatingOrEditing = ref(false);
const deleting = ref(false);
const editPayload = ref({});

const manualSorted = async () => {
    companyCompensationsPending.value = true;
    orderSequenceable(companyCompensationsData.value);
    await companyCompensationsReOrderExecute();
}

const compensationResolved = async () => {
    creatingOrEditing.value = false;
    editPayload.value = {};
    await companyCompensationsExecute();
}

const create = () => {
    creatingOrEditing.value = true;
    editPayload.value = {};
};

const edit = (cell: SequenceableCompanyPayrollComponent) => {
    creatingOrEditing.value = true;
    editPayload.value = cell;
}

const deleteSelected = async () => {
    deleting.value = true;

    const selectedIds = selectedCompanyCompensations.value;
    let batchDelete: Promise<any>[] = [];

    selectedIds.forEach((id) => {
        batchDelete.push(
            new Promise((resolve, reject) => {
                laraFetch(`/api/company/compensation/${id}`, {
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
    selectedCompanyCompensations.value = [];
    await companyCompensationsExecute();
    orderSequenceable(companyCompensationsData.value);
    await companyCompensationsReOrderExecute();

    deleting.value = false;
}
</script>

<style scoped>

</style>