<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <div class="p-[20px]">
                    <div class="mb-2 flex gap-2 items-center min-h-8">
                        <UnorderedList
                            v-if="disableActions"
                            :icon="'eos-icons:loading'"
                            :size="'md'"
                            :label="'Please wait...'"/>
                    </div>

                    <DataTable
                        :headers="salaryStatementModulesHeaders"
                        :size="'lg'"
                        :rows="salaryStatementModulesData"
                        :disabled="disableActions"
                        v-model="selectedSalaryStatementModules"
                        manual-sortable
                        @manualSorted="manualSorted"
                        selection>
                        <template v-slot:cell.formulable_type="{cell,slot}">
                            <div class="p-[3px]">{{cell.formulable_type.text}}</div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {Sequenceable, TableHeaderT} from "@/public/js/types/data";
import type {SalaryStatementModuleT} from "@/public/js/types/company-component";
import {storeToRefs} from "pinia";

definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid', 'SalaryStatementModules.vue');
const route = useRoute();

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);
const orderSequenceable = nuxtApp.$orderSequenceable as (data: Sequenceable[]) => void;

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        salaryStatementModulesExecute();
    }
});

const salaryStatementModulesHeaders = reactive<TableHeaderT[]>([
    { text: 'Formulable Type', value: 'formulable_type', alignData: 'left'},
    { text: 'Order', value: 'order'},
    { text: 'Name', value: 'name'},
]);

const salaryStatementModulesData = ref<SalaryStatementModuleT[]>([]);
const salaryStatementModulesPending = ref(false)
const selectedSalaryStatementModules = ref([]);

const disableActions = computed(() => {
    return salaryStatementModulesPending.value || creatingOrEditing.value || salaryStatementModulesReOrderPending.value || deleting.value || companyAssociationPendingState().value;
});
const salaryStatementModulesExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    salaryStatementModulesPending.value = true;

    await laraFetch(`/api/salary-statement-modules`, {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompanyId.value,
            }
        }
    }, {
        onRequestError: () => {
            salaryStatementModulesPending.value = false;
        },
        onResponse: () => {
            salaryStatementModulesPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            salaryStatementModulesData.value = _get(response, '_data.values.salary_statement_modules', []);
        }
    }, false);
}
await salaryStatementModulesExecute();

const salaryStatementModulesReOrderPending = ref(false);
const salaryStatementModulesReOrderExecute = async () => {
    salaryStatementModulesReOrderPending.value = true;

    const orderables = salaryStatementModulesData.value.map((item) => {
        return {id: item.id, order: item.order}
    });

    await laraFetch("/api/re-order/salary-statement-modules", {
        method: 'POST',
        params: {
            orderables: JSON.stringify(orderables),
        }
    },{
        onRequestError: () => {
            salaryStatementModulesReOrderPending.value = false;
        },
        onResponse: () => {
            salaryStatementModulesReOrderPending.value = false;
        },
        onUnAuthorizedResponse: async (request, options, response) => {
            await salaryStatementModulesExecute();
        },
        onSuccessResponse: async (request, options, response) => {
            await salaryStatementModulesExecute();
        }
    });
}

const creatingOrEditing = ref(false);

const manualSorted = async () => {
    salaryStatementModulesPending.value = true;
    orderSequenceable(salaryStatementModulesData.value);
    await salaryStatementModulesReOrderExecute();
}

const deleting = ref(false);
</script>

<style scoped>

</style>