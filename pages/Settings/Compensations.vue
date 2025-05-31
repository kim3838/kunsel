<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <PayrollSettingsCompanyCompensation/>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: ['auth', 'company-admin']});
useLayout().setNavigationMode('solid', 'Compensations.vue');
</script>

<style scoped lang="scss">

</style>