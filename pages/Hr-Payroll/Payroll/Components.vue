<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <div class="px-[20px] pt-[20px]">
                    <BreadCrumbs prefix-company :size="`sm`" />
                </div>
                <PayrollSettingsCompensation/>
                <PayrollSettingsDeduction/>
                <PayrollSettingsIncomeTax/>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Payroll Components`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company',
    async () => {

        const {selectedAssociatedCompanyAccountId, selectedAssociatedCompanyId} = storeToRefs(useAuthStore());
        const {data, error} = await laraUseFetch(`/api/payroll-components-gate`, {method: 'GET', params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value
        }}, {}, false);

        if(_isEmpty(data.value) && !_isEmpty(error.value)){
            let responseCode = _get(error.value, 'data.code', null);

            throw createError({ statusCode: responseCode, statusMessage: useCoreStore().servicePayloadMessage, fatal: true});
        }
    }
]});
useLayout().setNavigationMode('solid');
</script>

<style scoped>

</style>