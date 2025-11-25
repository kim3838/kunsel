<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableMeta, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection} from "@/public/js/common/type";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Attendance`}});
definePageMeta({middleware: ['auth', 'employee-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated, userIsSuperAdmin} = useAuth();
const nuxtApp = useNuxtApp();
const {render} = dateTimePicker();
const clientReadyState = useClientReadyState();
const common = useCommon();
const formStore = nuxtApp.$formStore;
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){

    }
});
</script>

<style scoped>

</style>