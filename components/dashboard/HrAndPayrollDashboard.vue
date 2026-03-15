<template>
    <div>
        <BreadCrumbs prefix-company :size="`sm`" :extender="[{name: `Hr & Payroll Dashboard`}]" />

        <div class="space-y-4 mt-6">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <!-- UR -->
                <div class="lining-shadow rounded-sm grow tint-background">
                    <div class="lining-shadow rounded-t-sm text-lg font-medium font-header px-4 py-2">My Requests</div>

                    <div class="p-4 max-h-[408px] overflow-y-auto">

                        <UserFiledRequest/>
                    </div>
                </div>

                <!-- AP -->
                <div class="lining-shadow rounded-sm grow tint-background">
                    <div class="lining-shadow rounded-t-sm text-lg font-medium font-header px-4 py-2">Awaiting my approval</div>

                    <div class="p-4 max-h-[408px] overflow-y-auto">
                        <UserAwaitingApproval/>
                    </div>
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-4">

                <div class="basis-full md:basis-1/2 lg:basis-4/11">

                    <!-- LT UL -->
                    <LeaveTodayAndUpcoming class="flex flex-col gap-4"/>
                </div>

                <div v-if="false" class="basis-full md:basis-1/2 lg:basis-7/11">

                    <!-- PR -->
                    <div class="lining-shadow rounded-sm grow tint-background">
                        <div class="lining-shadow rounded-t-sm px-4 py-2 flex justify-between items-center">
                            <div class="text-lg font-medium font-header">Payroll Run</div>
                        </div>

                        <div class="p-4">
                            <span class="text-sm font-serif">work in progress...</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";

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