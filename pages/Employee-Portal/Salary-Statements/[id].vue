<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <div class="flex px-[20px] pt-[20px] mb-2 gap-2">
                    <Button @click="useRouter().back()" class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon=" 'ic:sharp-keyboard-arrow-left'"></Button>
                </div>

                <SalaryStatementBreakdown
                    :salaryStatementUlid="route.params.id as string"
                    :salaryStatementFetchUrl="salaryStatementFetchUrl"
                    :salaryStatementParams="salaryStatementParams"
                    v-model:salary-statement-pending="salaryStatementPending" />
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Salary Statement`}});
definePageMeta({middleware: ['auth', 'verified', 'employee-of-selected-company']});
useLayout().setNavigationMode('solid');

const userCompanyEmployee = userCompanyEmployeeState();

const route = useRoute();
const {isAuthenticated} = useAuth();
const {$authStore, $associationStore, $moment} = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs($associationStore);
const {
    selectedAssociatedCompanyId,
} = storeToRefs($authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        navigateTo("/employee-portal/salary-statements", {replace: true});
    }
});

const salaryStatementPending = ref(false);
const salaryStatementFetchUrl = ref('/api/employee-portal-salary-statement/');
const salaryStatementParams = ref({});

const disableActions = computed(() => {
    return salaryStatementPending.value;
});
</script>

<style scoped>

</style>