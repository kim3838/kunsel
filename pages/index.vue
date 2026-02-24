<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl p-[20px]">

                <EmployeePortalDashboard v-if="selectedAccountSubscriptionValue == SUBSCRIPTION_MODULE.EMPLOYEE_PORTAL && userIsEmployeeOfSelectedCompany"/>

                <HrAndPayrollDashboard v-if="selectedAccountSubscriptionValue == SUBSCRIPTION_MODULE.HR_PAYROLL && userIsAdminOfSelectedCompany"/>

                <div v-if="false">
                    selectedAccountSubscription: {{selectedAccountSubscription}}<br>
                    selectedAccountSubscriptionValue: {{selectedAccountSubscriptionValue}}<br>

                    userIsAdminOfSelectedCompany: {{userIsAdminOfSelectedCompany}}<br>
                    userIsEmployeeOfSelectedCompany: {{userIsEmployeeOfSelectedCompany}}<hr>

                    selectedAssociatedCompany: {{selectedAssociatedCompany}}<br>
                    userCompanyEmployee: {{userCompanyEmployee}}<br>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Home`}});
definePageMeta({middleware: ['auth', 'verified']});
useLayout().setNavigationMode('solid');

const {isAuthenticated, userIsSuperAdmin} = useAuth();
const user = userState();
const userCompanyEmployee = userCompanyEmployeeState();
const nuxtApp = useNuxtApp();
const userIsEmployeeOfSelectedCompany = userIsEmployeeOfSelectedCompanyState();
const userIsAdminOfSelectedCompany = userIsAdminOfSelectedCompanyState();
const {
    updatedAssociatedAccountSubscriptionFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAccountSubscription,
    selectedAccountSubscriptionValue,
    selectedAssociatedCompany
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedAccountSubscriptionFlag, (newValue) => {
    if(isAuthenticated.value && !userIsSuperAdmin.value){
        //Updated selected subscription
    }
});
</script>

<style scoped>

</style>