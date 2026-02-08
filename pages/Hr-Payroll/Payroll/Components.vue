<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <div class="px-[20px] pt-[20px] space-y-6">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <Suspense>
                        <PayrollSettingsCompensation/>
                        <template #fallback>
                            <div class="px-[20px]">
                                <UnorderedList
                                    :icon="'eos-icons:loading'"
                                    :size="'md'"
                                    :label="'Loading compensations...'"/>
                            </div>
                        </template>
                    </Suspense>
                    <Suspense>
                        <PayrollSettingsDeduction/>
                        <template #fallback>
                            <div class="px-[20px]">
                                <UnorderedList
                                    :icon="'eos-icons:loading'"
                                    :size="'md'"
                                    :label="'Loading deductions...'"/>
                            </div>
                        </template>
                    </Suspense>
                    <Suspense>
                        <PayrollSettingsIncomeTax/>
                        <template #fallback>
                            <div class="px-[20px]">
                                <UnorderedList
                                    :icon="'eos-icons:loading'"
                                    :size="'md'"
                                    :label="'Loading income taxes...'"/>
                            </div>
                        </template>
                    </Suspense>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Payroll Components`}});
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