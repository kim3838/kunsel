<template>
    <div>
        <BreadCrumbs prefix-company :size="`sm`" :extender="[{name: `Hr & Payroll Dashboard`}]" />

        <div class="space-y-6 mt-6">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div class="lining-shadow rounded-sm flex-grow tint-background">
                    <div class="lining-shadow rounded-t-sm text-lg font-medium font-business px-4 py-2">My Requests</div>

                    <div class="px-4 py-4 max-h-[408px] overflow-y-auto">

                        <UserFiledRequest/>
                    </div>
                </div>

                <div class="lining-shadow rounded-sm flex-grow tint-background">
                    <div class="lining-shadow rounded-t-sm text-lg font-medium font-business px-4 py-2">Awaiting my approval</div>

                    <div class="px-4 py-4 max-h-[408px] overflow-y-auto">
                        <UserAwaitingApproval/>
                    </div>
                </div>
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