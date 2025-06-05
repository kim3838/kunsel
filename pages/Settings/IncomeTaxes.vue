<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <PayrollSettingsIncomeTax/>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: ['auth', 'company-admin']});
useLayout().setNavigationMode('solid', 'IncomeTaxes.vue');
</script>

<style scoped lang="scss">

</style>