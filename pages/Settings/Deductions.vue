<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <PayrollSettingsDeduction/>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: ['auth', 'company-admin']});
useLayout().setNavigationMode('solid', 'Deductions.vue');
</script>

<style scoped lang="scss">

</style>