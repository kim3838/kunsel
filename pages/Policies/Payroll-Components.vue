<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <PayrollSettingsCompensation/>
                <PayrollSettingsDeduction/>
                <PayrollSettingsIncomeTax/>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Payroll Components`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');
</script>

<style scoped>

</style>