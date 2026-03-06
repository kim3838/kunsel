<template>
    <div>
        <BreadCrumbs prefix-company :size="`sm`" :extender="[{name: `Hr & Payroll Dashboard`}]" />

        <div class="space-y-6 mt-6">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div class="lining-shadow rounded-sm flex-grow tint-background">
                    <div class="lining-shadow rounded-t-sm text-lg font-medium font-header px-4 py-2">My Requests</div>

                    <div class="px-4 py-4 max-h-[408px] overflow-y-auto">

                        <UserFiledRequest/>
                    </div>
                </div>

                <div class="lining-shadow rounded-sm flex-grow tint-background">
                    <div class="lining-shadow rounded-t-sm text-lg font-medium font-header px-4 py-2">Awaiting my approval</div>

                    <div class="px-4 py-4 max-h-[408px] overflow-y-auto">
                        <UserAwaitingApproval/>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-9 lg:grid-cols-12 gap-y-6 gap-x-4">

                <div class="col-span-full md:col-span-3 lg:col-span-2 lining-shadow rounded-sm grow tint-background">
                    <div class="lining-shadow rounded-t-sm px-4 py-2 flex justify-between items-center">
                        <div class="text-lg font-medium font-header">Leave Today</div>
                    </div>

                    <div class="px-4 py-4">
                        <span class="text-sm font-serif">work in progress...</span>
                    </div>
                </div>

                <div class="col-span-full md:col-span-6 lg:col-span-3 lining-shadow rounded-sm grow tint-background">
                    <div class="lining-shadow rounded-t-sm px-4 py-2 flex justify-between items-center">
                        <div class="text-lg font-medium font-header">Upcoming Leaves</div>
                    </div>

                    <div class="px-4 py-4">
                        <span class="text-sm font-serif">work in progress...</span>
                    </div>
                </div>

                <div class="col-span-full md:col-span-7 lining-shadow rounded-sm grow tint-background">
                    <div class="lining-shadow rounded-t-sm px-4 py-2 flex justify-between items-center">
                        <div class="text-lg font-medium font-header">Payroll Run</div>
                    </div>

                    <div class="px-4 py-4">
                        <span class="text-sm font-serif">work in progress...</span>
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