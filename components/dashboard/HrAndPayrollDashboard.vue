<template>
    <div>
        <BreadCrumbs prefix-company :size="`sm`" :extender="[{name: `Hr & Payroll Dashboard`}]" />

        <div class="space-y-6 mt-6">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <fieldset class="flex-grow tint-background scaffold-border px-2 pb-2 space-y-2 max-h-[408px] overflow-y-auto">
                    <legend class="text-xl font-medium font-hero">My Requests</legend>

                    <UserFiledRequest/>
                </fieldset>

                <fieldset class="flex-grow tint-background scaffold-border px-2 pb-2 space-y-2 max-h-[408px] overflow-y-auto">
                    <legend class="text-xl font-medium font-hero">Awaiting my approval</legend>

                    <UserAwaitingApproval/>
                </fieldset>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {LabelTypeT} from "@/public/js/types/theme";
import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";

const {isAuthenticated, userIsSuperAdmin} = useAuth();
const user = userState();
const userCompanyEmployee = userCompanyEmployeeState();
const nuxtApp = useNuxtApp();
const userIsEmployeeOfSelectedCompany = userIsEmployeeOfSelectedCompanyState();
const userIsAdminOfSelectedCompany = userIsAdminOfSelectedCompanyState();
const {
    updatedAssociatedCompanyFlag,
    updatedAssociatedAccountSubscriptionFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAccountSubscription,
    selectedAccountSubscriptionValue,
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompany,
    selectedAssociatedCompanyId,
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && userIsAdminOfSelectedCompany.value && selectedAssociatedCompanyId.value){

    }
});

</script>

<style scoped>

</style>